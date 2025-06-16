import type { StatCardItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps extends StatCardItem {}

export function StatCard({ title, value, icon: Icon, description, change, changeType }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground/80">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-bold font-headline text-card-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1 mt-1">{description}</p>}
        {change && (
          <p className={cn(
            "text-xs text-muted-foreground pt-1",
            changeType === 'positive' ? 'text-green-600' : '',
            changeType === 'negative' ? 'text-red-600' : ''
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
