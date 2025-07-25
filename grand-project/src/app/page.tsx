"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/api/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendLink = async () => {
    setLoading(true);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    console.log(siteUrl);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/dashboard`,
      },
    });

    if (!error) {
      setSent(true);
    } else {
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sent) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/dashboard");
        }
      });
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [sent, router]);

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleBackToLanding = () => {
    setShowLogin(false);
    setEmail("");
    setSent(false);
  };

  if (showLogin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Login via Magic Link</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email to get started with AI-Powered Resume Tailor
            </p>
          </div>
          
          {sent ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                Check your email for the magic link! Click it to continue.
              </p>
              <Button 
                variant="outline" 
                onClick={handleBackToLanding}
                className="mt-4"
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={sendLink}
                disabled={loading || !email}
                className="w-full"
                size="lg"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBackToLanding}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">AI-Powered Resume Tailor</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Instantly optimize your resume for any job.
        </p>
        <Button size="lg" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    </main>
  );
}