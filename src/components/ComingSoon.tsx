import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Bell } from "lucide-react";

const toolDescriptions: Record<string, { title: string; description: string; features: string[] }> = {
  "schedule-analyzer": {
    title: "Schedule Performance Analyzer",
    description: "Advanced AI-powered project timeline analysis and optimization for construction projects.",
    features: [
      "Real-time schedule performance tracking",
      "Predictive delay analysis",
      "Resource optimization recommendations",
      "Critical path visualization"
    ]
  },
  "outreach-coordinator": {
    title: "Client Outreach Coordinator",
    description: "Intelligent automation for client communication workflows and relationship management.",
    features: [
      "Automated follow-up sequences",
      "Personalized communication templates",
      "Client sentiment analysis",
      "Engagement tracking and reporting"
    ]
  },
  "sentiment-surveillance": {
    title: "Sentiment Surveillance Agent",
    description: "Monitor and analyze client feedback, reviews, and market sentiment across all channels.",
    features: [
      "Multi-platform sentiment monitoring",
      "Real-time alert system",
      "Trend analysis and reporting",
      "Competitive sentiment comparison"
    ]
  },
  "proforma-analysis": {
    title: "Proforma Analysis Agent",
    description: "Intelligent financial modeling and project analysis for data-driven decision making.",
    features: [
      "Automated financial projections",
      "Risk assessment modeling",
      "Market comparison analysis",
      "ROI optimization recommendations"
    ]
  },
  "consultant-tracker": {
    title: "Consultant Engagement Tracker",
    description: "Comprehensive management system for external consultant relationships and performance.",
    features: [
      "Performance tracking dashboard",
      "Cost analysis and optimization",
      "Contract management integration",
      "Quality assessment workflows"
    ]
  },
  "governance-manager": {
    title: "Agent Governance Manager",
    description: "Centralized oversight and control system for all AI agents and automated processes.",
    features: [
      "Unified agent monitoring",
      "Performance analytics dashboard",
      "Access control and permissions",
      "Audit trail and compliance reporting"
    ]
  }
};

export const ComingSoon = () => {
  const { toolId } = useParams();
  const tool = toolId ? toolDescriptions[toolId] : null;

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-primary">{tool.title}</h1>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Coming Soon
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                Advanced AI tool in development
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Coming Soon Notice */}
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Tool In Development</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                This powerful AI tool is currently being developed by our team at Disruptors. 
                We're working hard to bring you the most advanced construction industry solutions.
              </p>
              <Button variant="outline" className="flex items-center gap-2" disabled>
                <Bell className="h-4 w-4" />
                Notify Me When Available
              </Button>
            </CardContent>
          </Card>

          {/* Tool Description */}
          <Card>
            <CardHeader>
              <CardTitle>About {tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-foreground mb-4">Planned Features:</h4>
              <div className="grid gap-3">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Interface Preview</CardTitle>
              <CardDescription>
                This is how the tool interface will look when it becomes available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/20">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Tool Interface Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground">
                  Input fields, controls, and results display will be available here
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Development Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Expected Release:</strong> Q2 2024 • 
                  <strong className="ml-3">Status:</strong> Active Development • 
                  <strong className="ml-3">Priority:</strong> High
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};