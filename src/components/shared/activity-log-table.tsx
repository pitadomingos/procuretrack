
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ActivityLogEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button'; // Added Button

interface ActivityLogTableProps {
  title?: string;
  description?: string;
  activities: ActivityLogEntry[];
  maxHeight?: string;
  isLoading?: boolean; // New prop
  error?: string | null; // New prop
  onRetry?: () => void; // New prop for retry mechanism
}

export function ActivityLogTable({
  title = "Activity Log",
  description = "Recent system and user activities.",
  activities,
  maxHeight = "400px",
  isLoading = false, // Default value
  error = null,      // Default value
  onRetry,           // Default value
}: ActivityLogTableProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center" style={{ height: maxHeight }}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-destructive p-4" style={{ height: maxHeight }}>
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold">Error loading activities:</p>
            <p className="text-sm text-center mb-3">{error}</p>
            {onRetry && <Button onClick={onRetry} variant="outline">Retry</Button>}
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No activities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-xs">
                        {activity.details || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
