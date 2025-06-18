
'use client';

import type { GroupedStatCardItem, SubStat } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupedStatCardProps extends GroupedStatCardItem {}

export function GroupedStatCard({ title, icon: Icon, subStats, viewMoreLink, mainValue, mainValueDescription }: GroupedStatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col h-[190px]"> {/* Increased height */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1 pt-3 px-3"> {/* Reduced padding */}
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium text-card-foreground/90">{title}</CardTitle> {/* Reduced font size */}
          {mainValueDescription && <CardDescription className="text-xs">{mainValueDescription}</CardDescription>}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" /> {/* Reduced icon size */}
      </CardHeader>
      <CardContent className="pt-1 px-3 flex-grow"> {/* Reduced padding */}
        {mainValue && (
          <div className="text-xl font-bold font-headline text-card-foreground mb-1.5">{mainValue}</div> /* Reduced font size and margin */
        )}
        <div className={cn(
            "space-y-1", 
            mainValue ? "mt-0.5" : "mt-2" 
        )}>
          {subStats.map((stat: SubStat, index: number) => (
            <div key={index} className="flex justify-between items-baseline text-xs"> {/* Reduced font size */}
              <p className="text-muted-foreground/90">{stat.label}:</p> {/* Slightly less muted */}
              <div className="flex items-baseline">
                <p className="font-semibold text-card-foreground/95">{stat.value}</p> {/* Slightly less muted */}
                {stat.change && (
                  <span className={cn(
                    "ml-1 text-xs", 
                    stat.changeType === 'positive' ? 'text-green-600' : '',
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                  )}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {viewMoreLink && (
        <CardFooter className="pt-2 pb-3 px-3"> {/* Reduced padding */}
          <Link href={viewMoreLink} passHref legacyBehavior={false} className="w-full">
            <Button variant="outline" size="sm" className="w-full text-xs"> {/* Reduced font size */}
              View Details <ArrowRight className="ml-1 h-3 w-3" /> {/* Reduced icon size */}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
