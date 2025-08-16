import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Copy, Send, CheckCircle, AlertCircle, Loader2, PlayCircle, Wand2, ExternalLink, Info, Book } from "lucide-react";
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
    dismissOnboarding();

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

      await processResponse(response);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const processResponse = async (response: Response) => {
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
  };

  const handleError = (err: any) => {
    console.error("Error generating prompt:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    setError(`Failed to generate prompt: ${errorMessage}`);
    toast({
      title: "Error",
      description: `Failed to generate prompt: ${errorMessage}`,
      variant: "destructive",
    });
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

  const showCustomizeForm = () => {
    setShowCustomInput(true);
    dismissOnboarding();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
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
            {!showOnboarding && (
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(true)}
                className="flex items-center gap-2"
              >
                <Book className="h-4 w-4" />
                Rewatch Getting Started
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Onboarding Alert */}
          {showOnboarding && !generatedPrompt && (
            <Alert className="border-primary bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-base">
                <strong className="block mb-2">Welcome to the Entitlement Tracker! 🎯</strong>
                <p className="mb-3">This tool helps you analyze planning board data across multiple municipalities.</p>
                <p className="mb-3">Choose one of these options to get started:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li><strong>Run Entitlement Agent</strong> - Instantly analyze default municipalities</li>
                  <li><strong>Make a Change to the Agent</strong> - Customize locations or analysis parameters</li>
                </ul>
                <p className="text-sm text-muted-foreground">This message will only appear once.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Action Buttons */}
          {!generatedPrompt && !showCustomInput && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={handleRunDefault}>
                <CardContent className="p-8 text-center">
                  <PlayCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Run Entitlement Agent</h3>
                  <p className="text-muted-foreground">
                    Analyze default municipalities (Bayonne, Hoboken, Hackensack, Teaneck, Jersey City)
                  </p>
                  <Button 
                    className="mt-4 text-lg px-6 py-6" 
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunDefault();
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Run Now"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={showCustomizeForm}>
                <CardContent className="p-8 text-center">
                  <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Make a Change to the Agent</h3>
                  <p className="text-muted-foreground">
                    Customize municipalities, time frames, or analysis focus
                  </p>
                  <Button 
                    variant="secondary" 
                    className="mt-4 text-lg px-6 py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      showCustomizeForm();
                    }}
                  >
                    Customize
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Custom Input Form */}
          {showCustomInput && !generatedPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Analysis</CardTitle>
                <CardDescription>
                  Tell the agent what changes you want to make
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter your customization request..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="min-h-32 resize-y text-base"
                      disabled={isLoading}
                      autoFocus
                    />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Example requests:</p>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">• "Only analyze Hoboken and Teaneck"</p>
                        <p className="text-sm text-muted-foreground">• "Focus on residential developments over 50 units"</p>
                        <p className="text-sm text-muted-foreground">• "Look at the last 60 days instead of 30"</p>
                        <p className="text-sm text-muted-foreground">• "Include Newark and Elizabeth in the analysis"</p>
                        <p className="text-sm text-muted-foreground">• "Only show projects with affordable housing components"</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
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
                          Generate Custom Prompt
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false);
                        setUserMessage("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generated Prompt Display with Instructions */}
          {generatedPrompt && (
            <>
              <Card className="border-success bg-success/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-success flex items-center gap-2">
                      <CheckCircle className="h-6 w-6" />
                      Your Agent Prompt is Ready!
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Next Steps:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                        <div>
                          <p className="font-medium">Copy the optimized prompt below</p>
                          <p className="text-sm text-muted-foreground">Click the "Copy Prompt" button to copy to your clipboard</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                        <div>
                          <p className="font-medium">Open ChatGPT and enable Agent Mode</p>
                          <p className="text-sm text-muted-foreground">Make sure you're using ChatGPT Plus or Team with Agent Mode enabled</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                        <div>
                          <p className="font-medium">Paste the prompt and run</p>
                          <p className="text-sm text-muted-foreground">The agent will automatically analyze planning board data and return structured results</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={copyToClipboard}
                      size="lg"
                      className="flex-1 text-base py-6"
                    >
                      <Copy className="mr-2 h-5 w-5" />
                      Copy Prompt to Clipboard
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1 text-base py-6"
                      asChild
                    >
                      <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Open ChatGPT
                      </a>
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Need help with Agent Mode?</strong> Watch our{" "}
                      <a href="#" className="underline text-primary">video tutorial</a> or{" "}
                      <a href="https://help.openai.com/en/articles/8554397-creating-a-gpt" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                        read OpenAI's guide
                      </a>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                      {generatedPrompt}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedPrompt("");
                        setUserMessage("");
                        setShowCustomInput(false);
                      }}
                    >
                      Generate Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};