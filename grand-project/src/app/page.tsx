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
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full opacity-20 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-secondary rounded-full opacity-20 blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-md w-full relative z-10">
          <div className="bg-glass rounded-2xl p-8 shadow-2xl hover-glow">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-3 text-gradient">Welcome Back</h2>
              <p className="text-sm text-white/80">
                Enter your email to get started with AI-Powered Resume Tailor
              </p>
            </div>
            
            {sent ? (
              <div className="text-center">
                <div className="bg-gradient-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white mb-6 text-lg font-medium">
                  Check your email for the magic link!
                </p>
                <p className="text-white/70 text-sm mb-6">
                  Click the link to continue to your dashboard
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleBackToLanding}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Back to Home
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={sendLink}
                  disabled={loading || !email}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover-glow"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Magic Link...
                    </div>
                  ) : (
                    "Send Magic Link"
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleBackToLanding}
                  className="w-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  Back to Home
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-primary rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-secondary rounded-full opacity-25 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-accent rounded-full opacity-20 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-4xl relative z-10">
        <div className="bg-glass rounded-3xl p-12 shadow-2xl hover-glow animate-float">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-secondary rounded-full px-4 py-2 mb-6">
              <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-black font-medium text-sm">AI-Powered Technology</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
              Resume Tailor
              <span className="block text-4xl text-gradient mt-2">Made Simple</span>
            </h1>
            <p className="mb-8 text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Transform your resume instantly with our AI-powered technology. 
              Get perfectly tailored resumes for any job in seconds, not hours.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-primary hover:opacity-90 text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover-glow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 rounded-xl text-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See How It Works
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/70 text-sm">Get your tailored resume in under 30 seconds</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-secondary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-white/70 text-sm">Advanced algorithms analyze and optimize your content</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Perfect Match</h3>
              <p className="text-white/70 text-sm">Customized for each specific job description</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}