
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckSquare, PackageSearch, Loader2 } from 'lucide-react';
import type { POItemPayload, PurchaseOrderPayload } from '@/types';

interface ReceivedItem extends POItemPayload {
  quantityReceivedNow: number; // Quantity being received in this transaction
  originalQuantityOrdered: number;
  alreadyReceived: number; // Quantity already received prior to this transaction
}

export function GRNInterface() {
  const [poNumber, setPoNumber] = useState('');
  const [searchedPO, setSearchedPO] = useState<PurchaseOrderPayload | null>(null);
  const [searchedPOItems, setSearchedPOItems] = useState<ReceivedItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchPO = async () => {
    setErrorMessage('');
    setSearchedPO(null);
    setSearchedPOItems(null);
    if (!poNumber.trim()) {
      setErrorMessage('Please enter a PO number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/purchase-orders/for-grn/${encodeURIComponent(poNumber.trim().toUpperCase())}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch PO for GRN.' }));
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }
      const data: { poHeader: PurchaseOrderPayload, poItems: POItemPayload[] } = await response.json();
      
      setSearchedPO(data.poHeader);
      setSearchedPOItems(
        data.poItems.map(item => ({ 
          ...item, 
          quantityReceivedNow: 0, // Initialize "Receive Now" to 0
          originalQuantityOrdered: item.quantity,
          alreadyReceived: item.quantityReceived || 0, // Use fetched quantityReceived
        }))
      );

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (itemId: number | undefined, quantityReceivedNow: number) => {
    if (searchedPOItems && itemId !== undefined) {
      setSearchedPOItems(
        searchedPOItems.map((item) => {
          if (item.id === itemId) {
            const remainingToReceive = item.originalQuantityOrdered - item.alreadyReceived;
            const newQuantityReceivedNow = Math.max(0, Math.min(quantityReceivedNow, remainingToReceive));
            return { ...item, quantityReceivedNow: newQuantityReceivedNow };
          }
          return item;
        })
      );
    }
  };

  const handleReceiveItems = () => {
    if (!searchedPOItems || searchedPOItems.every(item => item.quantityReceivedNow === 0)) {
      alert('No items selected or quantities entered for receiving.');
      return;
    }
    const receivedSummary = searchedPOItems
      .filter(item => item.quantityReceivedNow > 0)
      .map(item => `${item.description}: ${item.quantityReceivedNow} (Ordered: ${item.originalQuantityOrdered}, Prev. Rec: ${item.alreadyReceived})`)
      .join('\n');
    
    alert(`Items received for PO ${poNumber.toUpperCase()}:\n${receivedSummary}\n\nGRN generation and actual stock update with new item statuses is not fully functional in this version. This simulates the UI interaction.`);
    // Reset after "receiving"
    setPoNumber('');
    setSearchedPO(null);
    setSearchedPOItems(null);
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Receive Items (GRN)</CardTitle>
        <CardDescription>Enter an approved PO number to retrieve items and record received quantities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="po-number-grn">PO Number</Label>
            <Input
              id="po-number-grn"
              placeholder="e.g., PO-00001"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleSearchPO} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageSearch className="mr-2 h-4 w-4" />}
            Search PO
          </Button>
        </div>

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        {searchedPOItems && searchedPO && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Items for PO: {searchedPO.poNumber} (Supplier: {searchedPO.supplierDetails?.supplierName || searchedPO.supplierId || 'N/A'})</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">Prev. Received</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="w-[150px] text-right">Receive Now</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedPOItems.map((item) => {
                    const remainingToReceive = item.originalQuantityOrdered - item.alreadyReceived;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.originalQuantityOrdered} {item.uom}</TableCell>
                        <TableCell className="text-right">{item.alreadyReceived} {item.uom}</TableCell> 
                        <TableCell className="text-right">{remainingToReceive} {item.uom}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0" 
                            max={remainingToReceive} 
                            value={item.quantityReceivedNow} 
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)} 
                            className="h-8 text-right"
                            disabled={remainingToReceive <= 0}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleReceiveItems} disabled={!searchedPOItems || searchedPOItems.every(item => item.quantityReceivedNow === 0)}>
                <CheckSquare className="mr-2 h-4 w-4" /> Confirm Receipt
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This interface fetches approved POs for receiving. Full GRN functionality, including updating item statuses and stock, is planned for a future version.
        </p>
      </CardFooter>
    </Card>
  );
}
