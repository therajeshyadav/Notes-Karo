import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/auth.css";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <Container fluid className="px-0">
        {/* Mobile Header */}
        <div className="d-md-none index-mobile-header">
  <div className="index-mobile-logo-section">
    <div className="index-mobile-logo-circle">
      <div className="index-mobile-logo-inner"></div>
    </div>
    <h1 className="index-mobile-app-name">NoteKaro</h1>
  </div>
</div>

        <Row className="w-100 g-0 min-vh-100">
          {/* Left Section with light gradient */}
          <Col
  xs={12}
  md={6}
  className="d-flex flex-column justify-content-center align-items-center px-4 py-5 index-left"
  style={{
    background:
      "linear-gradient(to bottom right, rgba(26,115,232,0.05), rgba(26,115,232,0.15))",
  }}
>

            <div className="w-100" style={{ maxWidth: "500px" }}>
              {/* Desktop Logo */}
              <div className="d-none d-md-flex align-items-center mb-4">
                <div className="auth-logo-circle">
                  <div className="auth-logo-inner"></div>
                </div>
                <h1 className="auth-app-name ms-2">NoteKaro</h1>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your Smart Note Space
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Collect ideas, organize with tags, and never lose your thoughts
                again.  
                Notekaro makes note-taking simple, fast, and distraction-free.
              </p>
              <div className="mt-6 flex gap-3">
                <Button size="lg" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Section */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center auth-right-section px-4 py-5"
          >
            <div className="w-100" style={{ maxWidth: "420px" }}>
              <Card className="auth-card">
                <CardHeader>
                  <CardTitle>Why Notekaro?</CardTitle>
                  <CardDescription>
                    Everything you need for smarter note-taking
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="text-sm text-muted-foreground">
                    📝 Create and edit notes seamlessly
                  </div>
                  <div className="text-sm text-muted-foreground">
                    🏷️ Organize with tags and categories
                  </div>
                  <div className="text-sm text-muted-foreground">
                    🔍 Powerful search to find notes instantly
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ☁️ Access anywhere, anytime
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✨ Minimal and distraction-free design
                  </div>
                </CardContent>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Index;
