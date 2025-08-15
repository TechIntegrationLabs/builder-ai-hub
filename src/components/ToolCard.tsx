import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  status: "active" | "coming-soon";
}

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold text-foreground truncate">
                {tool.title}
              </CardTitle>
              {tool.status === "coming-soon" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Coming Soon
                </Badge>
              )}
              {tool.status === "active" && (
                <Badge className="bg-success text-success-foreground">
                  Active
                </Badge>
              )}
            </div>
            <CardDescription className="text-muted-foreground text-base">
              {tool.description}
            </CardDescription>
          </div>
          
          <div className="ml-6 flex-shrink-0">
            {tool.status === "active" ? (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to={`/tool/${tool.id}`} className="flex items-center gap-2">
                  Launch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button disabled variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};