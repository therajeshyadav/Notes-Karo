import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Notekaro</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your personal space for thoughts, tasks, and inspiration.  
              Create notes instantly, organize them with tags, and never lose an idea again.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button size="lg" onClick={() => navigate("/login")}>Signin</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>Signup</Button>
            </div>
          </div>

          {/* Right Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Notekaro?</CardTitle>
              <CardDescription>Everything you need for smarter note-taking</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="text-sm text-muted-foreground">📝 Create and edit notes seamlessly</div>
              <div className="text-sm text-muted-foreground">🏷️ Organize with tags and categories</div>
              <div className="text-sm text-muted-foreground">🔍 Powerful search to find notes instantly</div>
              <div className="text-sm text-muted-foreground">☁️ Access anywhere, anytime</div>
              <div className="text-sm text-muted-foreground">✨ Minimal and distraction-free design</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Index;
