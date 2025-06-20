
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookUser, // Main icon for the page
  Info,     // For Introduction section
  Palette,  // For Getting Started section
  LayoutDashboard, // For Dashboard section
  ArrowRight // Used in text
  // Add other icons back progressively once this parses
} from "lucide-react";

export default function UserManualPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <BookUser className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">ProcureTrack User Manual</CardTitle>
              <CardDescription className="text-md">
                Your comprehensive guide to navigating and utilizing the ProcureTrack application.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-10 text-muted-foreground text-sm leading-relaxed">
          
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <Info className="mr-2 h-6 w-6 text-primary" />1. Introduction
            </h2>
            <p>
              Welcome to ProcureTrack! This application is designed to streamline and manage your organization's procurement processes, from initial requisitions to purchase orders, goods receiving, client quotations, and fuel record management. This manual will guide you through its features and functionalities.
            </p>
            <div className="mt-3 p-3 border-l-4 border-primary bg-primary/10 rounded-r-md">
              <h4 className="font-medium text-primary mb-1">How to use this manual:</h4>
              <p className="text-xs">
                Use the table of contents (if available on the platform) or scroll through the sections. Click on the links in the Table of Contents <ArrowRight className="inline h-4 w-4" /> to jump to specific sections. Look for icons next to section titles for a quick visual cue about the content.
              </p>
            </div>
          </section>

          <section id="getting-started">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <Palette className="mr-2 h-6 w-6 text-primary" />2. Getting Started
            </h2>
            <p>
              Currently, ProcureTrack uses a mock authentication system for demonstration (e.g., the "My Approvals" page is hardcoded for 'pita.domingos@jachris.com'). Full user authentication, login, and role-based access control are planned future enhancements.
            </p>
            <p className="mt-2">
              <strong>Theme Customization:</strong> You can switch between Light, Dark, and System default themes using the sun/moon icon in the top header bar.
            </p>
             <p className="mt-2">
              <strong>Page Rating:</strong> Most pages feature a star rating system in the header. Your feedback helps us understand page usefulness and identify areas for improvement.
            </p>
          </section>

          <section id="dashboard">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <LayoutDashboard className="mr-2 h-6 w-6 text-primary" />3. Dashboard Overview
            </h2>
            <p>
              The Dashboard (Home page) provides a snapshot of key procurement metrics and recent activities. (Further content of the manual would follow here, simplified for this test).
            </p>
          </section>

          {/* Other sections are omitted for this diagnostic step */}

        </CardContent>
      </Card>
    </div>
  );
}
