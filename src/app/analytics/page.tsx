import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <BarChart3 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">Advanced Analytics</CardTitle>
                <CardDescription className="mt-2">
                    This section will provide in-depth analytics and reporting capabilities.
                    Detailed charts, custom report generation, and data export features are planned for a future release.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Stay tuned for powerful insights into your procurement data!
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
