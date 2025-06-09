'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckSquare, PackageSearch } from 'lucide-react';
import type { POItem } from '@/types';

const mockPOItems: POItem[] = [
  { id: 'item1', description: 'Heavy Duty Wrench Set', quantity: 10, unitPrice: 55.00, category: 'Tools', allocation: 'Workshop', uom: 'Set' },
  { id: 'item2', description: 'Industrial Grade Solvent (5L)', quantity: 5, unitPrice: 25.50, category: 'Consumables', allocation: 'Maintenance', uom: 'Can' },
  { id: 'item3', description: 'Safety Goggles (Pack of 10)', quantity: 2, unitPrice: 30.00, category: 'Safety', allocation: 'All Sites', uom: 'Pack' },
];


interface ReceivedItem extends POItem {
  quantityReceived: number;
}

export function GRNInterface() {
  const [poNumber, setPoNumber] = useState('');
  const [searchedPOItems, setSearchedPOItems] = useState<ReceivedItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchPO = () => {
    setErrorMessage('');
    if (!poNumber.trim()) {
      setErrorMessage('Please enter a PO number.');
      setSearchedPOItems(null);
      return;
    }
    // Simulate API call
    if (poNumber.trim().toUpperCase() === 'PO12300') {
      setSearchedPOItems(mockPOItems.map(item => ({ ...item, quantityReceived: 0 })));
    } else {
      setErrorMessage(`PO Number "${poNumber}" not found or has no pending items.`);
      setSearchedPOItems(null);
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (searchedPOItems) {
      setSearchedPOItems(
        searchedPOItems.map((item) =>
          item.id === itemId ? { ...item, quantityReceived: Math.max(0, Math.min(quantity, item.quantity)) } : item
        )
      );
    }
  };

  const handleReceiveItems = () => {
    if (!searchedPOItems || searchedPOItems.every(item => item.quantityReceived === 0)) {
      alert('No items selected or quantities entered for receiving.');
      return;
    }
    const receivedSummary = searchedPOItems
      .filter(item => item.quantityReceived > 0)
      .map(item => `${item.description}: ${item.quantityReceived}/${item.quantity}`)
      .join('\n');
    
    alert(`Items received for PO ${poNumber}:\n${receivedSummary}\n\nGRN generation not functional in MVP.`);
    // Reset after "receiving"
    setPoNumber('');
    setSearchedPOItems(null);
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Receive Items (GRN)</CardTitle>
        <CardDescription>Enter a PO number to retrieve items and record received quantities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="po-number-grn">PO Number</Label>
            <Input
              id="po-number-grn"
              placeholder="e.g., PO12300"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleSearchPO}>
            <PackageSearch className="mr-2 h-4 w-4" /> Search PO
          </Button>
        </div>

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        {searchedPOItems && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Items for PO: {poNumber.toUpperCase()}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Previously Received</TableHead>
                  <TableHead className="w-[120px] text-right">Receive Now</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedPOItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">0</TableCell> {/* Mocked */}
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.quantityReceived}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className="h-8 text-right"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button onClick={handleReceiveItems} disabled={!searchedPOItems || searchedPOItems.every(item => item.quantityReceived === 0)}>
                <CheckSquare className="mr-2 h-4 w-4" /> Confirm Receipt
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This interface simulates item receipt. Full GRN functionality and back-order updates are not part of the MVP.
        </p>
      </CardFooter>
    </Card>
  );
}
