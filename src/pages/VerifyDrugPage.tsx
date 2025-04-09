import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBlockchainService } from '@/services/blockchainServiceFactory';

export const VerifyDrugPage = () => {
  const [sgtin, setSgtin] = useState('');
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSgtin(e.target.value);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setDrugDetails(null);

    try {
      const service = await getBlockchainService();
      const details = await service.getDrugDetailsBySGTIN(sgtin);

      if (details) {
        setDrugDetails(details);
      } else {
        setError('Drug not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify drug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify Drug by SGTIN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="sgtin" className="text-right">
                SGTIN:
              </label>
              <input
                type="text"
                id="sgtin"
                value={sgtin}
                onChange={handleInputChange}
                className="col-span-3 rounded-md border border-gray-200 px-3 py-1.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            {error && <div className="text-red-500">{error}</div>}
            {drugDetails && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Drug Details:</h3>
                <pre>{JSON.stringify(drugDetails, null, 2)}</pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
