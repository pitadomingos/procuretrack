
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintableRequisition } from '@/components/requisitions/printable-requisition';
import type { RequisitionPayload } from '@/types';
import { ArrowLeft, Printer, Download, Loader2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

function PrintRequisitionPageContent() {
  const router = useRouter();
  const params = useParams();
  const requisitionId = params.id as string;
  const { toast } = useToast();

  const [requisitionData, setRequisitionData] = useState<RequisitionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>(undefined);

  const fetchRequisitionData = useCallback(async () => {
    if (!requisitionId) return;
    setLoading(true);
    setError(null);
    try {
      const reqRes = await fetch(`/api/requisitions/${requisitionId}`); 
      if (!reqRes.ok) {
        const errorData = await reqRes.json().catch(() => ({ message: 'Failed to fetch requisition details.' }));
        throw new Error(errorData.message || `Failed to fetch requisition: ${reqRes.statusText}`);
      }
      const data: RequisitionPayload = await reqRes.json();
      setRequisitionData(data);

      try {
        const logoResponse = await fetch('/jachris-logo.png'); 
        if (logoResponse.ok) {
            const logoBlob = await logoResponse.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoDataUri(reader.result as string);
            };
            reader.readAsDataURL(logoBlob);
        } else {
            console.warn('Client-side logo fetch failed for requisition, using default path for preview.');
            setLogoDataUri(undefined); 
        }
      } catch (logoError) {
          console.warn('Error fetching client-side logo for requisition:', logoError);
          setLogoDataUri(undefined); 
      }

    } catch (err: any) {
      console.error('Error fetching requisition data for printing:', err);
      setError(err.message || 'Failed to load requisition data.');
      toast({ title: "Error", description: `Failed to load requisition data: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [requisitionId, toast]);

  useEffect(() => {
    fetchRequisitionData();
  }, [fetchRequisitionData]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPdf = async () => {
    toast({
      title: 'Feature Not Implemented',
      description: `PDF download for Requisition ${requisitionData?.requisitionNumber} is not yet available.`,
    });
  };

  const handleEditRequisition = () => {
    if (!requisitionData || !requisitionId) return;
    // For now, navigating to the generic create page, which doesn't support editing requisitions yet.
    // This will need to be updated if/when requisition editing is fully implemented in the form.
    toast({ title: 'Info', description: 'Requisition editing via the main form is not yet fully supported. This action is a placeholder.' });
    // router.push(`/create-document?editRequisitionId=${requisitionId}`);
  };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Requisition...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-destructive p-4">
        <p className="font-semibold">Error loading Requisition:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!requisitionData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Requisition not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  const canEditRequisition = requisitionData.status === 'Draft' || requisitionData.status === 'Pending Approval';


  return (
    <div className="print-page-container bg-gray-100 min-h-screen py-2 print:bg-white print:py-0">
      <div className="print-page-inner-container container mx-auto max-w-4xl print:max-w-full print:p-0">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
                Requisition: {requisitionData.requisitionNumber}
              </h1>
              <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                    requisitionData.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    requisitionData.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                    requisitionData.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    requisitionData.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700' 
                }`}>
                    {requisitionData.status}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close Preview
              </Button>
              {canEditRequisition && (
                <Button onClick={handleEditRequisition} variant="outline" size="sm" title="Edit Requisition (Placeholder)">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button onClick={handlePrint} size="sm" variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print Requisition
              </Button>
              <Button onClick={handleDownloadPdf} size="sm" disabled> {/* PDF download disabled for now */}
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="printable-po-content-wrapper bg-white p-2 sm:p-4 print:p-0 shadow-lg">
         <PrintableRequisition requisitionData={requisitionData} logoDataUri={logoDataUri} />
        </div>
      </div>
    </div>
  );
}

export default function PrintRequisitionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Loading Requisition Details...</div>}>
      <PrintRequisitionPageContent />
    </Suspense>
  );
}
