
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category, POItemForPrint, Approver, User as UserType } from '@/types';
import { ArrowLeft, Printer, Download, Loader2, Edit, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FullPODataForPrint extends Omit<PurchaseOrderPayload, 'items'> {
  items: POItemForPrint[];
  supplierDetails?: Supplier;
  approverName?: string;
  // approverSignatureUrl is part of PurchaseOrderPayload
}

export default function PrintPOPage() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;
  const { toast } = useToast();

  const [poData, setPoData] = useState<FullPODataForPrint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [allUsers, setAllUsers] = useState<UserType[]>([]); // To find user ID for approval

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
        fetch('/api/users'), // Fetch all users
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
      };
      
      if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items: ${poItemsRes.statusText}`);
      const itemsDataRaw: POItemPayload[] = await poItemsRes.json();
      
      const allSuppliers: Supplier[] = suppliersRes.ok ? await suppliersRes.json() : [];
      const allSites: Site[] = sitesRes.ok ? await sitesRes.json() : [];
      const allCategories: Category[] = categoriesRes.ok ? await categoriesRes.json() : [];
      const allApprovers: Approver[] = approversRes.ok ? await approversRes.json() : [];
      const fetchedUsers: UserType[] = usersRes.ok ? await usersRes.json() : [];
      setAllUsers(fetchedUsers);

      const supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
      const approverDetails = allApprovers.find(a => a.id === headerData.approverId);

      const itemsForPrint: POItemForPrint[] = itemsDataRaw.map(item => {
        const site = allSites.find(s => s.id === (item.siteId ? Number(item.siteId) : null));
        const category = allCategories.find(c => c.id === (item.categoryId ? Number(item.categoryId) : null));
        return {
          ...item,
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

      setPoData({
        ...headerData, 
        items: itemsForPrint,
        supplierDetails: supplierDetails,
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
    if (!poData) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/generate-pdf`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'PDF generation failed. Server returned an unreadable error.' }));
        throw new Error(errorData.message || `PDF generation failed: ${response.statusText}`);
      }
      
      const result = await response.json();
       toast({
        title: 'PDF Generation (Placeholder)',
        description: result.message || 'PDF generation initiated. Actual PDF download is not yet implemented.',
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
    if (!poData) return;
    toast({
      title: 'Edit Purchase Order',
      description: `Edit functionality for PO ${poData.poNumber} would be initiated here. Full editing workflow to be implemented.`,
    });
  };

  const handleApprovePO = async () => {
    if (!poData || poData.status !== 'Pending Approval') {
      toast({ title: "Cannot Approve", description: "This PO is not pending approval.", variant: "destructive" });
      return;
    }
    
    setIsApproving(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
            error: 'Approval failed.', 
            details: `Server responded with status: ${response.status} ${response.statusText}`,
            stack: '' 
        }));
        
        let clientErrorMessage = errorData.error || `Approval failed for PO ${poId}.`;
        if (errorData.details) {
            clientErrorMessage += ` Details: ${errorData.details}`;
        }
        throw new Error(clientErrorMessage);
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.message || `Purchase Order ${poData.poNumber} approved.`,
      });
      await fetchPODataForPrint(); 

    } catch (err: any) {
      console.error('Error approving PO (client-side catch):', err); 
      let errorMessage = 'Could not approve the PO.';
      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      toast({
        title: 'Error Approving PO',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
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

  const canEditPO = poData.status === 'Pending Approval';
  const canApprovePO = poData.status === 'Pending Approval';

  return (
    <div className="print-page-container bg-gray-100 min-h-screen py-2 print:bg-white print:py-0">
      <div className="print-page-inner-container container mx-auto max-w-4xl print:max-w-full print:p-0">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">PO: {poData.poNumber} ({poData.status})</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              {canEditPO && (
                <Button 
                  onClick={handleEditPO} 
                  variant="outline" 
                  size="sm" 
                  title="Edit this Purchase Order"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit PO
                </Button>
              )}
              {canApprovePO && (
                <Button
                  onClick={handleApprovePO}
                  disabled={isApproving}
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isApproving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {isApproving ? 'Approving...' : 'Approve PO'}
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
        
        <div className="printable-po-content-wrapper bg-white p-2 sm:p-4 print:p-0">
         <PrintablePO poData={poData} />
        </div>
      </div>
    </div>
  );
}

