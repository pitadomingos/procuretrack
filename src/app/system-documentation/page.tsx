
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileCode } from "lucide-react";
import Image from 'next/image';

export default function SystemDocumentationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">ProcureTrack System Documentation</CardTitle>
              <CardDescription>
                Technical details about the ProcureTrack application architecture and components.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              This document provides a technical overview of the ProcureTrack application, including its architecture, components, and other relevant system details. It is intended for developers and system administrators.
              Content will be updated as the system evolves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. System Architecture</h2>
            <p className="text-muted-foreground mb-2">
              ProcureTrack is designed as a modern web application with a distinct frontend and backend, intended for cloud deployment.
            </p>
            <div className="ml-4 space-y-3">
              <div>
                <h3 className="text-lg font-medium">2.1 Frontend</h3>
                <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li><strong>Framework:</strong> Next.js (using the App Router)</li>
                  <li><strong>Language:</strong> TypeScript</li>
                  <li><strong>UI Components:</strong> ShadCN UI</li>
                  <li><strong>Styling:</strong> Tailwind CSS</li>
                  <li><strong>Key Features:</strong> Server Components, Client Components, API Route Handlers (potentially for some frontend-specific logic or BFF patterns).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">2.2 Backend API (Current)</h3>
                 <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li><strong>Framework:</strong> Node.js with Express.js</li>
                  <li><strong>Language:</strong> JavaScript (as per existing `backend` folder scripts)</li>
                  <li><strong>Purpose:</strong> Provides RESTful APIs for data operations (e.g., fetching suppliers, purchase orders). Serves as the primary interface to the database.</li>
                </ul>
              </div>
               <div>
                <h3 className="text-lg font-medium">2.3 AI Backend (Future Integration)</h3>
                 <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li><strong>Toolkit:</strong> Genkit</li>
                  <li><strong>Models:</strong> Google AI (e.g., Gemini)</li>
                  <li><strong>Purpose:</strong> To handle generative AI functionalities, such as AI-assisted form filling, data analysis, or report generation. Genkit flows will be invoked from Next.js Server Actions or API routes.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">2.4 Database</h3>
                <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li><strong>Type:</strong> MySQL</li>
                  <li><strong>Interaction:</strong> The Express.js backend API connects to and queries the MySQL database.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">2.5 Hosting & Deployment</h3>
                 <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li><strong>Platform:</strong> Firebase App Hosting (as configured in `apphosting.yaml`) for the Next.js application.</li>
                  <li><strong>Database Hosting:</strong> (Details to be added - e.g., Google Cloud SQL, or other managed MySQL service).</li>
                  <li><strong>Backend API Hosting:</strong> (Details to be added - could be co-located with Next.js via App Hosting's Express support, or a separate service like Cloud Run/Cloud Functions).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">2.6 Data Flow (Simplified)</h3>
                <div className="my-4 p-4 border border-dashed rounded-md bg-muted/20 flex justify-center items-center">
                  <Image
                    src="https://placehold.co/700x350.png"
                    alt="Data Flow Diagram Placeholder"
                    width={700}
                    height={350}
                    className="rounded-md"
                    data-ai-hint="data flow"
                  />
                </div>
                <p className="text-muted-foreground ml-4">
                  User interacts with Next.js frontend in browser ➔ Frontend (Client/Server Components) makes requests (e.g., via Server Actions or `fetch` to API routes) ➔
                  Next.js API routes or Server Actions may call Express.js backend API ➔ Express.js API interacts with MySQL Database ➔ Data flows back to the user.
                  For AI features, Next.js will interact with Genkit flows.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Frontend Overview</h2>
            <p className="text-muted-foreground">
              (Detailed explanation of key frontend components, routing strategy, state management approach (if any specific global state solution is adopted), and UI conventions will be added here.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Backend API Details</h2>
            <p className="text-muted-foreground">
              (List of current API endpoints, their request/response formats, authentication mechanisms (once implemented), and any specific backend logic will be documented here.)
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>GET /api/suppliers - Fetches all suppliers.</li>
                <li>GET /api/purchase-orders - Fetches all purchase orders.</li>
                <li>GET /api/purchase-orders/:poId - Fetches a single purchase order.</li>
                <li>GET /api/purchase-orders/:poId/items - Fetches items for a specific PO.</li>
                <li>POST /api/upload/* - Placeholder endpoints for file uploads.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Database Schema</h2>
            <p className="text-muted-foreground">
              (Overview of the main database tables, their columns, relationships, and any important constraints. This will be based on the `scripts/create_*.js` files.)
              Key tables include: User, Supplier, PurchaseOrder, POItem, Category, Site, Approver, ActivityLog, etc.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Deployment Process</h2>
            <p className="text-muted-foreground">
              (Step-by-step guide on how to build and deploy the application to Firebase App Hosting and other relevant services. Include environment variable setup.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Future Enhancements & Roadmap</h2>
            <p className="text-muted-foreground">
              (Outline of planned features, potential architectural changes, and long-term goals for the system.)
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
