import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Copy, Send, CheckCircle, AlertCircle, Loader2, PlayCircle, Wand2, ExternalLink, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EntitlementTracker = () => {
  const [userMessage, setUserMessage] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem("entitlementTrackerOnboarding");
    if (hasSeenOnboarding === "true") {
      setShowOnboarding(false);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("entitlementTrackerOnboarding", "true");
  };

  const handleRunDefault = async () => {
    setIsLoading(true);
    setError("");
    setGeneratedPrompt("");
    setShowCustomInput(false);

    try {
      const response = await fetch("https://hook.us2.make.com/64kn0tphmvof4dgv8bj8zwzstvvzpp3x", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: "run it",
        }),
      });

      await processResponse(response);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError("");
    setGeneratedPrompt("");

    try {
      const response = await fetch("https://hook.us2.make.com/64kn0tphmvof4dgv8bj8zwzstvvzpp3x", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: userMessage,
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("The Make.com scenario encountered an error. Please check your scenario for errors.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();
      console.log("Response text:", responseText);
      console.log("Response content-type:", contentType);

      // Check if response is "Accepted" - this means no Webhook Response module is configured
      if (responseText === "Accepted") {
        throw new Error("Make.com webhook returned 'Accepted'. Please add a Webhook Response module to your scenario to return the generated prompt as JSON.");
      }

      // Check if response is plain text (starts with === FINAL AGENT PROMPT)
      if (responseText.includes("=== FINAL AGENT PROMPT START ===")) {
        // Extract the prompt content between the markers
        const startMarker = "=== FINAL AGENT PROMPT START ===";
        const endMarker = "=== FINAL AGENT PROMPT END ===";
        const startIndex = responseText.indexOf(startMarker) + startMarker.length;
        const endIndex = responseText.indexOf(endMarker);
        
        if (endIndex > startIndex) {
          const promptContent = responseText.substring(startIndex, endIndex).trim();
          setGeneratedPrompt(promptContent);
          toast({
            title: "Prompt Generated",
            description: "Your ChatGPT agent prompt is ready to copy.",
          });
        } else {
          throw new Error("Could not extract prompt content from response");
        }
      } else {
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error(`Invalid response format. Expected JSON but received: ${responseText.substring(0, 100)}...`);
        }
        
        if (data.final_agent_prompt) {
          setGeneratedPrompt(data.final_agent_prompt);
          toast({
            title: "Prompt Generated",
            description: "Your ChatGPT agent prompt is ready to copy.",
          });
        } else {
          console.error("Response missing final_agent_prompt:", data);
          throw new Error("No prompt returned from the service");
        }
      }
    } catch (err) {
      console.error("Error generating prompt:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to generate prompt: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to generate prompt: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard successfully.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

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
                <h1 className="text-3xl font-bold text-primary">Entitlement Tracker</h1>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                Generate ChatGPT agent prompts for planning board entitlement analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Quick Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Enter your plain-English instruction below to generate a specialized prompt for ChatGPT Agent Mode.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-2">Example instruction:</p>
                <p className="text-sm italic">"Analyze entitlements in Hoboken and Teaneck for residential development opportunities"</p>
              </div>
            </CardContent>
          </Card>

          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Your Prompt</CardTitle>
              <CardDescription>
                Describe what you want to analyze and we'll create the perfect ChatGPT agent prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Enter your instruction here... (e.g., 'Analyze entitlements in Hoboken and Teaneck')"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="min-h-24 resize-y"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!userMessage.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Prompt Display */}
          {generatedPrompt && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-success">Generated ChatGPT Agent Prompt</CardTitle>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
                <CardDescription>
                  Copy this prompt and paste it into ChatGPT Agent Mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tool Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                The Entitlement Tracker helps you analyze planning board data and identify development opportunities by creating specialized prompts for ChatGPT agents.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">What it does:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Scrapes planning board websites for entitlement data
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Identifies development opportunities and constraints
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Provides structured, actionable analysis output
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Formats data for easy review and decision-making
                  </li>
                </ul>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                <h4 className="font-semibold text-foreground mb-2">Usage Guidance:</h4>
                <p className="text-sm text-muted-foreground">
                  Be specific about locations, property types, and analysis goals. The more detailed your instruction, 
                  the more targeted and useful your generated ChatGPT prompt will be.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};