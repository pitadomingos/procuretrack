
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
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-medium text-card-foreground/90">{title}</CardTitle>
          {mainValueDescription && <CardDescription className="text-xs">{mainValueDescription}</CardDescription>}
        </div>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        {mainValue && (
          <div className="text-2xl sm:text-3xl font-bold font-headline text-card-foreground mb-3">{mainValue}</div>
        )}
        <div className={cn(
            "space-y-1.5 sm:space-y-2", // Adjusted spacing
            mainValue ? "mt-1" : "mt-3" 
        )}>
          {subStats.map((stat: SubStat, index: number) => (
            <div key={index} className="flex justify-between items-baseline text-xs sm:text-sm">
              <p className="text-muted-foreground">{stat.label}:</p>
              <div className="flex items-baseline">
                <p className="font-semibold text-card-foreground">{stat.value}</p>
                {stat.change && (
                  <span className={cn(
                    "ml-1.5 sm:ml-2 text-xs", // Adjusted margin
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
        <CardFooter className="pt-3 sm:pt-4">
          <Link href={viewMoreLink} passHref legacyBehavior={false} className="w-full">
            <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
              View Details <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

    