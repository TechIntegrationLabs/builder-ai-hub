import { useState } from "react";
import { ToolCard } from "./ToolCard";

const tools = [
  {
    id: "entitlement-tracker",
    title: "Entitlement Tracker",
    description: "Generate prompts to analyze planning board entitlements using AI agents",
    status: "active" as const,
  },
  {
    id: "schedule-analyzer",
    title: "Schedule Performance Analyzer",
    description: "Track and optimize project timeline performance",
    status: "coming-soon" as const,
  },
  {
    id: "outreach-coordinator",
    title: "Client Outreach Coordinator",
    description: "Automate and streamline client communication workflows",
    status: "coming-soon" as const,
  },
  {
    id: "sentiment-surveillance",
    title: "Sentiment Surveillance Agent",
    description: "Monitor and analyze client feedback and market sentiment",
    status: "coming-soon" as const,
  },
  {
    id: "proforma-analysis",
    title: "Proforma Analysis Agent",
    description: "Intelligent financial modeling and project analysis",
    status: "coming-soon" as const,
  },
  {
    id: "consultant-tracker",
    title: "Consultant Engagement Tracker",
    description: "Manage and optimize external consultant relationships",
    status: "coming-soon" as const,
  },
  {
    id: "governance-manager",
    title: "Agent Governance Manager",
    description: "Centralized oversight and control for all AI agents",
    status: "coming-soon" as const,
  },
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Cornerstone AI Tools</h1>
            <p className="mt-1 text-muted-foreground">
              by Disruptors
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Available Tools</h2>
          <p className="text-muted-foreground">
            Access powerful AI tools designed specifically for construction project management and client engagement.
          </p>
        </div>

        <div className="space-y-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </main>
    </div>
  );
};