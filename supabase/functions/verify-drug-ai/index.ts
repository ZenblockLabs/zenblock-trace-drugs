import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drugName, facility, batchId, scannedData, imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received verification request:", { 
      hasDrugName: !!drugName, 
      hasFacility: !!facility, 
      hasBatchId: !!batchId,
      hasImageData: !!imageData,
      imageDataLength: imageData?.length || 0
    });

    // Determine if this is an image-based or text-based verification
    const isImageVerification = !!imageData && imageData.startsWith('data:image');

    let messages: any[];

    if (isImageVerification) {
      // Image-based verification using vision capabilities
      const systemPrompt = `You are a pharmaceutical drug verification expert with image analysis capabilities. 
Your role is to analyze images of drug packages, QR codes, or barcodes and determine if they appear to be genuine pharmaceutical products.

Analyze the image for:
1. QR code or barcode presence and readability
2. Pharmaceutical packaging characteristics (labels, logos, text clarity)
3. Drug name visibility and format
4. Batch/lot numbers visible
5. Manufacturing details visible
6. Signs of tampering or counterfeiting (poor print quality, spelling errors, missing elements)

Respond with a JSON object containing:
- "isGenuine": boolean (true if likely genuine, false if suspicious or cannot verify)
- "confidence": number (0-100, confidence level in your assessment)
- "analysis": string (detailed explanation of what you found in the image)
- "detectedInfo": object with any drug info you can extract from the image:
  - "drugName": string or null
  - "batchId": string or null  
  - "facility": string or null
  - "expiryDate": string or null
- "riskFactors": array of strings (list any red flags found)
- "recommendations": array of strings (suggestions for the user)

Be thorough but conservative - if the image is unclear or you cannot verify authenticity, mark as suspicious with lower confidence.`;

      messages = [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { 
              type: "text", 
              text: "Please analyze this pharmaceutical product image and verify if it appears to be genuine. Extract any visible drug information (drug name, batch ID, facility, expiry date) from the image." 
            },
            { 
              type: "image_url", 
              image_url: { url: imageData }
            }
          ]
        }
      ];
    } else {
      // Text-based verification (original flow)
      const systemPrompt = `You are a pharmaceutical drug verification expert. Your role is to analyze drug information and determine if a drug appears to be genuine based on the provided data.

You must analyze the following aspects:
1. Drug name format and validity - Check if it follows standard pharmaceutical naming conventions
2. Facility name - Check if it appears to be a legitimate pharmaceutical facility
3. Batch ID format - Check if it follows standard batch numbering patterns
4. Overall consistency - Check if all data points are consistent with each other

Respond with a JSON object containing:
- "isGenuine": boolean (true if likely genuine, false if suspicious)
- "confidence": number (0-100, confidence level in your assessment)
- "analysis": string (brief explanation of your findings)
- "riskFactors": array of strings (list any red flags found)
- "recommendations": array of strings (suggestions for the user)

Be conservative - if there's doubt, mark as suspicious with lower confidence.`;

      const userPrompt = `Please verify this drug information that was NOT found in our database:

Drug Name: ${drugName || "Not provided"}
Facility: ${facility || "Not provided"}
Batch ID: ${batchId || "Not provided"}
Raw Scanned Data: ${scannedData || "Not provided"}

Analyze whether this appears to be a genuine pharmaceutical product or potentially counterfeit/suspicious.`;

      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];
    }

    console.log("Calling AI gateway with", isImageVerification ? "image analysis" : "text analysis");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "verify_drug",
              description: "Return drug verification analysis result",
              parameters: {
                type: "object",
                properties: {
                  isGenuine: { 
                    type: "boolean",
                    description: "Whether the drug appears to be genuine"
                  },
                  confidence: { 
                    type: "number",
                    description: "Confidence level 0-100"
                  },
                  analysis: { 
                    type: "string",
                    description: "Detailed explanation of findings"
                  },
                  detectedInfo: {
                    type: "object",
                    description: "Drug info extracted from image (for image verification)",
                    properties: {
                      drugName: { type: "string" },
                      batchId: { type: "string" },
                      facility: { type: "string" },
                      expiryDate: { type: "string" }
                    }
                  },
                  riskFactors: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of red flags found"
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Suggestions for the user"
                  }
                },
                required: ["isGenuine", "confidence", "analysis", "riskFactors", "recommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "verify_drug" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI verification failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      console.log("Verification result:", { isGenuine: result.isGenuine, confidence: result.confidence });
      
      // For text-based verification, include the input data as detectedInfo if not already present
      if (!isImageVerification && !result.detectedInfo) {
        result.detectedInfo = {
          drugName: drugName || null,
          batchId: batchId || null,
          facility: facility || null,
          expiryDate: null
        };
      }
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content as JSON
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Failed to parse AI response content as JSON");
        return new Response(JSON.stringify({
          isGenuine: false,
          confidence: 0,
          analysis: "Unable to verify - AI response was not in expected format",
          riskFactors: ["Verification system error"],
          recommendations: ["Please try again or contact support"]
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({
      isGenuine: false,
      confidence: 0,
      analysis: "Unable to verify - no response from AI",
      riskFactors: ["Verification system error"],
      recommendations: ["Please try again or contact support"]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in verify-drug-ai:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
