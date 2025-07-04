
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category, POItemForPrint, Approver, User as UserType } from '@/types';
import { ArrowLeft, Printer, Download, Loader2, Edit, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FullPODataForPrint extends Omit<PurchaseOrderPayload, 'items'> {
  items: POItemForPrint[];
  supplierDetails?: Supplier;
  approverName?: string;
  creatorName?: string;
}

function PrintPOPageContent() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const viewContext = searchParams.get('context'); 

  const [poData, setPoData] = useState<FullPODataForPrint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>(undefined);

  const fetchPODataForPrint = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [poHeaderRes, poItemsRes, suppliersRes, sitesRes, categoriesRes, approversRes, usersRes] = await Promise.all([
        fetch(`/api/purchase-orders/${poId}`),
        fetch(`/api/purchase-orders/${poId}/items`),
        fetch('/api/suppliers'),
        fetch('/api/sites'),
        fetch('/api/categories'),
        fetch('/api/approvers'),
        fetch('/api/users'), 
      ]);

      if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header: ${poHeaderRes.statusText}`);
      const rawHeaderData: any = await poHeaderRes.json(); 

      const headerData: PurchaseOrderPayload = {
        ...rawHeaderData,
        id: rawHeaderData.id ? Number(rawHeaderData.id) : undefined,
        subTotal: Number(rawHeaderData.subTotal || 0),
        vatAmount: Number(rawHeaderData.vatAmount || 0),
        grandTotal: Number(rawHeaderData.grandTotal || 0),
        pricesIncludeVat: Boolean(rawHeaderData.pricesIncludeVat),
        siteId: rawHeaderData.siteId ? Number(rawHeaderData.siteId) : null,
        items: [], 
      };
      
      if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items: ${poItemsRes.statusText}`);
      const itemsDataRaw: POItemPayload[] = await poItemsRes.json();
      
      const allSuppliers: Supplier[] = suppliersRes.ok ? await suppliersRes.json() : [];
      const allSites: Site[] = sitesRes.ok ? await sitesRes.json() : [];
      const allCategories: Category[] = categoriesRes.ok ? await categoriesRes.json() : [];
      const allApprovers: Approver[] = approversRes.ok ? await approversRes.json() : [];
      const allUsers: UserType[] = usersRes.ok ? await usersRes.json() : [];

      const supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
      const approverDetails = allApprovers.find(a => a.id === headerData.approverId);
      const creatorDetails = allUsers.find(u => u.id === headerData.creatorUserId);

      const itemsForPrint: POItemForPrint[] = itemsDataRaw.map(item => {
        const site = allSites.find(s => s.id === (item.siteId ? Number(item.siteId) : null));
        const category = allCategories.find(c => c.id === (item.categoryId ? Number(item.categoryId) : null));
        return {
          ...item, // Includes quantityReceived and itemStatus from POItemPayload
          id: item.id ? Number(item.id) : undefined,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
          categoryId: item.categoryId ? Number(item.categoryId) : null,
          siteId: item.siteId ? Number(item.siteId) : null,
          siteDisplay: site?.siteCode || site?.name || (item.siteId ? `Site ID ${item.siteId}` : 'N/A'),
          categoryDisplay: category?.category || (item.categoryId ? `Category ID ${item.categoryId}` : 'N/A'),
        };
      });
      
      const approverSignatureUrl = approverDetails ? `/signatures/${approverDetails.id}.png` : undefined;
      
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
            console.warn('Client-side logo fetch failed, using default path for preview.');
            setLogoDataUri(undefined); 
        }
      } catch (logoError) {
          console.warn('Error fetching client-side logo:', logoError);
          setLogoDataUri(undefined); 
      }

      setPoData({
        ...headerData, 
        items: itemsForPrint,
        supplierDetails: supplierDetails,
        creatorName: creatorDetails?.name,
        approverName: approverDetails?.name,
        approverSignatureUrl: approverSignatureUrl,
        poNumber: headerData.poNumber || `PO-${poId}`, 
        status: headerData.status || 'Pending Approval', 
        quoteNo: headerData.quoteNo || '', 
      });

    } catch (err: any) {
      console.error('Error fetching PO data for printing:', err);
      setError(err.message || 'Failed to load purchase order data.');
      toast({ title: "Error", description: `Failed to load PO data: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [poId, toast]);

  useEffect(() => {
    if (!poId) return;
    fetchPODataForPrint();
  }, [poId, fetchPODataForPrint]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!poData || !poId) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/generate-po-pdf?poId=${poId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'PDF generation failed. Server returned an unreadable error.' }));
        throw new Error(errorData.message || `PDF generation failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${poData.poNumber || `PO-${poId}`}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'PDF Downloaded',
        description: `${poData.poNumber || `PO-${poId}`}.pdf has started downloading.`,
      });
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
      toast({
        title: 'Error Downloading PDF',
        description: err.message || 'Could not download the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditPO = () => {
    if (!poData || !poId) return;
    router.push(`/create-document?editPoId=${poId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Purchase Order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-destructive p-4">
        <p className="font-semibold">Error loading Purchase Order:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!poData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Purchase Order not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const canEditPO = poData.status === 'Pending Approval' && viewContext !== 'creator';
  const isRejected = poData.status === 'Rejected';

  return (
    <div className="print-page-container">
      <div className="print-page-inner-container">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">PO: {poData.poNumber}</h1>
              {isRejected && (
                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-md flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" /> REJECTED
                </span>
              )}
              {!isRejected && (
                 <span className={`text-sm font-semibold px-2 py-1 rounded-md ${poData.status === 'Approved' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
                    {poData.status}
                 </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              {canEditPO && !isRejected && (
                <Button 
                  onClick={handleEditPO} 
                  variant="outline" 
                  size="sm" 
                  title="Edit this Purchase Order"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit PO
                </Button>
              )}
              <Button onClick={handlePrint} size="sm">
                <Printer className="mr-2 h-4 w-4" /> Print PO
              </Button>
              <Button onClick={handleDownloadPdf} disabled={isDownloading} size="sm">
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading ? 'Preparing...' : 'Download PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="printable-po-content-wrapper">
         <PrintablePO poData={poData} logoDataUri={logoDataUri} />
        </div>
      </div>
    </div>
  );
}

export default function PrintPOPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Loading...</div>}>
      <PrintPOPageContent />
    </Suspense>
  );
}
