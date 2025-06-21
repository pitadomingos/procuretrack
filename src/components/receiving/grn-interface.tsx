
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, PackageSearch, Loader2, FileSearch, AlertTriangle, FilePlus } from 'lucide-react';
import type { POItemPayload, PurchaseOrderPayload, ApprovedPOForSelect, GRNItemFormData, GRNPostPayload } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const MOCK_RECEIVED_BY_USER_ID = 'user_grn_001'; 

export function GRNInterface() {
  const { toast } = useToast();

  const [grnDate, setGrnDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedPOId, setSelectedPOId] = useState<string>('');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [overallGrnNotes, setOverallGrnNotes] = useState<string>('');

  const [approvedPOsForSelect, setApprovedPOsForSelect] = useState<ApprovedPOForSelect[]>([]);
  const [loadedPOHeader, setLoadedPOHeader] = useState<PurchaseOrderPayload | null>(null);
  const [grnItems, setGrnItems] = useState<GRNItemFormData[]>([]);
  
  const [isLoadingPOsForSelect, setIsLoadingPOsForSelect] = useState(false);
  const [isLoadingPODetails, setIsLoadingPODetails] = useState(false);
  const [isSubmittingGRN, setIsSubmittingGRN] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ general?: string; poSelect?: string; }>({});

  const fetchInitialData = useCallback(async () => {
    setIsLoadingPOsForSelect(true);
    setErrorMessages({});
    try {
      const posRes = await fetch('/api/purchase-orders/for-grn-selection');
      if (posRes.ok) {
        setApprovedPOsForSelect(await posRes.json());
      } else {
        const err = await posRes.json().catch(() => ({}));
        setErrorMessages(prev => ({ ...prev, poSelect: `Failed to load POs: ${err.message || posRes.statusText}` }));
      }
    } catch (error: any) {
      setErrorMessages(prev => ({ ...prev, general: `Error fetching POs for selection: ${error.message}`}));
      toast({ title: "Error", description: "Could not load initial data for GRN form.", variant: "destructive" });
    } finally {
      setIsLoadingPOsForSelect(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const resetFormForNew = () => {
    setGrnDate(format(new Date(), 'yyyy-MM-dd'));
    setSelectedPOId('');
    setDeliveryNote('');
    setOverallGrnNotes('');
    setLoadedPOHeader(null);
    setGrnItems([]);
    fetchInitialData();
  };

  const handlePOSelectionChange = async (poId: string) => {
    setSelectedPOId(poId);
    setLoadedPOHeader(null);
    setGrnItems([]);
    setErrorMessages(prev => ({ ...prev, general: undefined }));

    if (!poId) return;

    const selectedFullPO = approvedPOsForSelect.find(p => p.id.toString() === poId);
    if (!selectedFullPO) return;

    setIsLoadingPODetails(true);
    try {
      // Use the endpoint that fetches full PO details for GRN
      const response = await fetch(`/api/purchase-orders/for-grn/${encodeURIComponent(selectedFullPO.poNumber)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch details for PO ${selectedFullPO.poNumber}`);
      }
      const data: { poHeader: PurchaseOrderPayload, poItems: POItemPayload[] } = await response.json();
      setLoadedPOHeader(data.poHeader);
      setGrnItems(
        data.poItems.map(item => {
          const outstanding = (item.quantity || 0) - (item.quantityReceived || 0);
          const siteDisplay = item.siteCode || item.siteName || (item.siteId ? `Site ID ${item.siteId}` : 'N/A');
          return {
            ...item,
            receiveNowQty: 0,
            outstandingQty: outstanding < 0 ? 0 : outstanding,
            siteDisplay: siteDisplay,
          };
        })
      );
    } catch (err: any) {
      setErrorMessages(prev => ({ ...prev, general: err.message || 'An unexpected error occurred while fetching PO details.' }));
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoadingPODetails(false);
    }
  };

  const handleQuantityChange = (itemId: number | undefined, receiveNowStr: string) => {
    if (!itemId) return;
    const receiveNowQty = parseInt(receiveNowStr, 10);

    setGrnItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newReceiveNow = isNaN(receiveNowQty) || receiveNowQty < 0 ? 0 : Math.min(receiveNowQty, item.outstandingQty);
          return { ...item, receiveNowQty: newReceiveNow };
        }
        return item;
      })
    );
  };
  
  const handleReceiveAllOutstanding = (itemId: number | undefined) => {
    if (!itemId) return;
    setGrnItems(prevItems =>
      prevItems.map(item => 
        item.id === itemId ? { ...item, receiveNowQty: item.outstandingQty } : item
      )
    );
  };

  const handleConfirmReceipt = async () => {
    if (!grnItems.some(item => item.receiveNowQty > 0)) {
      toast({ title: "No Items to Receive", description: "Please enter quantities for items you are receiving.", variant: "info" });
      return;
    }
    if (!selectedPOId || !loadedPOHeader || !loadedPOHeader.id) {
        toast({ title: "PO Not Selected", description: "Please select a Purchase Order.", variant: "destructive"});
        return;
    }

    setIsSubmittingGRN(true);
    
    const payload: GRNPostPayload = {
      poId: loadedPOHeader.id,
      grnDate,
      deliveryNoteNumber: deliveryNote,
      overallGrnNotes,
      receivedByUserId: MOCK_RECEIVED_BY_USER_ID,
      items: grnItems
        .filter(item => item.receiveNowQty > 0 && item.id !== undefined)
        .map(item => ({
          poItemId: item.id!,
          quantityReceivedNow: item.receiveNowQty,
          itemSpecificNotes: item.itemSpecificNotes,
        })),
    };

    try {
      const response = await fetch('/api/grn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Failed to process GRN. Server returned ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "GRN Processed Successfully!",
        description: `GRN ${result.grnNumber} processed for PO ${loadedPOHeader.poNumber}. PO Status is now: ${result.newPOStatus}`,
      });

      resetFormForNew(); // Reset the form for the next GRN
      
    } catch (error: any) {
      toast({ title: "Error Processing GRN", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingGRN(false);
    }
  };

  const supplierInfo = loadedPOHeader?.supplierDetails 
    ? `${loadedPOHeader.supplierDetails.supplierName} (${loadedPOHeader.supplierDetails.supplierCode})`
    : loadedPOHeader?.supplierId || 'N/A';
  
  const totalItemsToReceive = grnItems.reduce((sum, item) => sum + item.receiveNowQty, 0);

  return (
    <Card className="shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Goods Received Note (GRN)</CardTitle>
        <CardDescription>Record items received against an approved Purchase Order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessages.general && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{errorMessages.general}</p>}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="po-select-grn">Select Purchase Order *</Label>
            <Select 
              value={selectedPOId} 
              onValueChange={handlePOSelectionChange}
              disabled={isLoadingPOsForSelect || isLoadingPODetails}
            >
              <SelectTrigger id="po-select-grn" className="w-full">
                <SelectValue placeholder={isLoadingPOsForSelect ? "Loading POs..." : "Choose a PO to receive against"} />
              </SelectTrigger>
              <SelectContent>
                {approvedPOsForSelect.length === 0 && !isLoadingPOsForSelect && (
                  <div className="p-2 text-sm text-muted-foreground">No approved POs found for GRN.</div>
                )}
                {approvedPOsForSelect.map(po => (
                  <SelectItem key={po.id} value={po.id.toString()}>
                    {po.poNumber} - {po.supplierName} ({format(new Date(po.creationDate), 'dd MMM yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessages.poSelect && <p className="text-xs text-destructive mt-1">{errorMessages.poSelect}</p>}
          </div>

          <div>
            <Label htmlFor="grn-date">GRN Date *</Label>
            <Input id="grn-date" type="date" value={grnDate} onChange={e => setGrnDate(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="supplier-info">Supplier</Label>
            <Input id="supplier-info" value={loadedPOHeader ? supplierInfo : 'N/A'} readOnly className="bg-muted/50" />
          </div>
          <div>
            <Label htmlFor="delivery-note">Supplier Delivery Note No.</Label>
            <Input id="delivery-note" placeholder="Enter delivery note/invoice ref" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} />
          </div>
        </div>

        {isLoadingPODetails && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading PO items...</span>
          </div>
        )}

        {grnItems.length > 0 && loadedPOHeader && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium font-headline">Items for PO: {loadedPOHeader.poNumber}</h3>
            <div className="rounded-md border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background shadow-sm">
                  <TableRow>
                    <TableHead className="w-[200px]">Description</TableHead>
                    <TableHead className="w-[100px]">Site</TableHead>
                    <TableHead className="text-center w-[80px]">UOM</TableHead>
                    <TableHead className="text-right w-[80px]">Ordered</TableHead>
                    <TableHead className="text-right w-[100px]">Prev. Rec.</TableHead>
                    <TableHead className="text-right w-[100px]">Outstanding</TableHead>
                    <TableHead className="w-[120px] text-center">Receive Now *</TableHead>
                    <TableHead className="w-[80px]"></TableHead> 
                    <TableHead className="w-[150px]">Item Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grnItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="py-2">{item.description}</TableCell>
                      <TableCell className="py-2 text-xs">{item.siteDisplay}</TableCell>
                      <TableCell className="text-center py-2">{item.uom}</TableCell>
                      <TableCell className="text-right py-2">{item.quantity}</TableCell>
                      <TableCell className="text-right py-2">{item.quantityReceived || 0}</TableCell>
                      <TableCell className="text-right py-2 font-medium">{item.outstandingQty}</TableCell>
                      <TableCell className="text-right py-2">
                        <Input 
                          type="number" 
                          value={item.receiveNowQty} 
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
                          className="h-8 text-right w-full"
                          disabled={item.outstandingQty <= 0}
                          min="0"
                          max={item.outstandingQty}
                        />
                      </TableCell>
                       <TableCell className="text-center py-2">
                        {item.outstandingQty > 0 && (
                            <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleReceiveAllOutstanding(item.id)}
                            title="Receive all outstanding for this item"
                            >
                            All
                            </Button>
                        )}
                      </TableCell>
                       <TableCell className="py-2">
                        <Input 
                          placeholder="Batch, remarks..." 
                          value={item.itemSpecificNotes || ''}
                          onChange={(e) => setGrnItems(prev => prev.map(i => i.id === item.id ? {...i, itemSpecificNotes: e.target.value} : i))}
                          className="h-8 text-xs"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div className="mt-4">
                <Label htmlFor="overall-grn-notes">Overall GRN Notes</Label>
                <Textarea id="overall-grn-notes" placeholder="Any general comments about this delivery..." value={overallGrnNotes} onChange={e => setOverallGrnNotes(e.target.value)} />
            </div>
          </div>
        )}
         {selectedPOId && !isLoadingPODetails && grnItems.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
                <FileSearch className="mx-auto h-10 w-10 mb-2" />
                <p>No items found for the selected PO, or all items have been fully received.</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={resetFormForNew} variant="outline"><FilePlus className="mr-2 h-4 w-4"/> Start New GRN</Button>
        <Button 
            onClick={handleConfirmReceipt} 
            disabled={isSubmittingGRN || isLoadingPODetails || grnItems.length === 0 || totalItemsToReceive === 0 || !selectedPOId}
            size="lg"
        >
          {isSubmittingGRN ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckSquare className="mr-2 h-4 w-4" />}
          Confirm Receipt ({totalItemsToReceive} items)
        </Button>
      </CardFooter>
    </Card>
  );
}
