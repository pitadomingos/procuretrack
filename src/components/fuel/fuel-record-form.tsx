
'use client';

import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Site, Tag, FuelRecord } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Save, Loader2 } from 'lucide-react';
import { randomUUID } from 'crypto';

interface FuelRecordFormValues {
  fuelDate: string;
  reqNo?: string;
  invNo?: string;
  driver?: string;
  odometer?: number;
  tagId: string | null;
  siteId: string | null;
  description?: string;
  uom?: string;
  quantity: number;
  unitCost: number;
}

const MOCK_RECORDER_USER_ID = 'USR_FUEL_RECORDER_001';

export function FuelRecordForm() {
  const { toast } = useToast();
  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  const [sites, setSites] = useState<Site[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const form = useForm<FuelRecordFormValues>({
    defaultValues: {
      fuelDate: format(new Date(), 'yyyy-MM-dd'),
      reqNo: '',
      invNo: '',
      driver: '',
      odometer: undefined,
      tagId: null,
      siteId: null,
      description: 'Diesel',
      uom: 'Liters',
      quantity: 0,
      unitCost: 0,
    },
    mode: 'onBlur',
  });

  const fetchInitialData = useCallback(async () => {
    setIsLoadingInitialData(true);
    try {
      const [sitesRes, tagsRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/tags')
      ]);

      if (sitesRes.ok) setSites(await sitesRes.json());
      else toast({ title: "Error", description: "Could not load sites.", variant: "destructive" });

      if (tagsRes.ok) setTags(await tagsRes.json());
      else toast({ title: "Error", description: "Could not load tags (vehicles/equipment).", variant: "destructive" });

    } catch (error) {
      toast({ title: "Error Loading Data", description: "Could not load initial form data for fuel records.", variant: "destructive" });
    } finally {
      setIsLoadingInitialData(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const watchedQuantity = form.watch('quantity');
  const watchedUnitCost = form.watch('unitCost');

  useEffect(() => {
    const quantity = Number(watchedQuantity) || 0;
    const unitCost = Number(watchedUnitCost) || 0;
    setTotalCost(parseFloat((quantity * unitCost).toFixed(2)));
  }, [watchedQuantity, watchedUnitCost]);

  const onSubmit = async (formData: FuelRecordFormValues) => {
    setIsSubmitting(true);

    const payload: Omit<FuelRecord, 'id' | 'tagName' | 'siteName' | 'totalCost' | 'distanceTravelled'> & { recorderUserId?: string } = {
      fuelDate: new Date(formData.fuelDate).toISOString(),
      reqNo: formData.reqNo,
      invNo: formData.invNo,
      driver: formData.driver,
      odometer: formData.odometer ? Number(formData.odometer) : undefined,
      tagId: formData.tagId!,
      siteId: formData.siteId ? Number(formData.siteId) : null,
      description: formData.description,
      uom: formData.uom,
      quantity: Number(formData.quantity),
      unitCost: Number(formData.unitCost),
      recorderUserId: MOCK_RECORDER_USER_ID,
    };

    try {
      const response = await fetch('/api/fuel-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save fuel record. Server error.' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      toast({ title: 'Fuel Record Saved', description: `Fuel record ID ${result.fuelRecordId} has been saved successfully.` });
      form.reset();
      setTotalCost(0);

    } catch (error: any) {
      toast({ title: 'Error Saving Fuel Record', description: error.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatValue = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  if (isLoadingInitialData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading form data...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Record Fuel Consumption</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField control={form.control} name="fuelDate" rules={{ required: 'Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField
                control={form.control}
                name="tagId"
                rules={{ required: 'Tag (Vehicle/Equipment) is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (Vehicle/Equipment)</FormLabel>
                    <Select
                      onValueChange={(selectedTagId) => {
                        field.onChange(selectedTagId); // Update the form state for tagId
                        const selectedTag = tags.find(t => t.id === selectedTagId);
                        if (selectedTag && selectedTag.siteId) {
                          form.setValue('siteId', selectedTag.siteId.toString());
                        } else {
                          form.setValue('siteId', null); // Reset site if tag has no assigned site
                        }
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Tag" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tags.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.tagNumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteId"
                rules={{ required: 'Site is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Site" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sites.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name} ({s.siteCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <FormField control={form.control} name="driver" render={({ field }) => ( <FormItem> <FormLabel>Driver</FormLabel> <FormControl><Input placeholder="Driver's name" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="odometer" render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 123456"
                      {...field}
                      value={field.value ?? ''}
                      onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="reqNo" render={({ field }) => ( <FormItem> <FormLabel>Requisition No.</FormLabel> <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="invNo" render={({ field }) => ( <FormItem> <FormLabel>Invoice No.</FormLabel> <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Input placeholder="e.g., Diesel, Petrol" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="uom" rules={{ required: "UOM is required"}} render={({ field }) => ( <FormItem> <FormLabel>UOM</FormLabel> <FormControl><Input placeholder="e.g., Liters, Gal" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div className="grid md:grid-cols-3 gap-4 items-end">
              <FormField control={form.control} name="quantity" rules={{ required: 'Quantity is required', min: { value: 0.01, message: 'Must be > 0' } }} render={({ field }) => (
                <FormItem> <FormLabel>Quantity</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl> <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="unitCost" rules={{ required: 'Unit Cost is required', min: { value: 0.01, message: 'Must be > 0' } }} render={({ field }) => (
                <FormItem> <FormLabel>Unit Cost (MZN)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl> <FormMessage />
                </FormItem>
              )} />
              <FormItem>
                <FormLabel>Total Cost (MZN)</FormLabel>
                <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">{formatValue(totalCost)}</div>
              </FormItem>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isSubmitting || !form.formState.isValid || isLoadingInitialData}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Saving...' : 'Save Fuel Record'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Ensure all fuel consumption details are accurate. Data is now saved directly to the database.
        </p>
      </CardFooter>
    </Card>
  );
}
