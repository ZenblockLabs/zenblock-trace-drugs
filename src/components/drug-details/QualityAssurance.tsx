
export function QualityAssurance() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Quality Assurance</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Verified Authentic</p>
            <p className="text-sm text-gray-500">Blockchain verified original product</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Temperature Controlled</p>
            <p className="text-sm text-gray-500">Stored between 2-8°C during transport</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">GMP Compliant</p>
            <p className="text-sm text-gray-500">Manufactured following Good Manufacturing Practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
