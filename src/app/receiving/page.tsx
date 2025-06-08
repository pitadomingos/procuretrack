import { GRNInterface } from '@/components/receiving/grn-interface';
import { BackOrderReportForm } from '@/components/receiving/back-order-report-form';
import { Separator } from '@/components/ui/separator';

export default function ReceivingPage() {
  return (
    <div className="container mx-auto py-4 space-y-8">
      <GRNInterface />
      <Separator />
      <BackOrderReportForm />
    </div>
  );
}
