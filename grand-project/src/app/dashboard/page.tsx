"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/api/lib/supabaseClient";

export default function Dashboard() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
      } else {
        alert("Please log in to tailor your resume.");
        router.push("/");
      }
    };
    getSession();
  }, [router]);

  const handleSubmit = async () => {
    if (!resume || !jd) {
      alert("Please enter both resume and job description.");
      return;
    }
    if (!token) {
      alert("You must be logged in to tailor your resume.");
      router.push("/");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume_text: resume, job_description: jd }),
      });

      if (res.ok) {
        router.push("/results");
      } else {
        const errorData = await res.json();
        alert(`Error tailoring resume: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary rounded-full opacity-20 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-secondary rounded-full opacity-25 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Resume Tailor Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Transform your resume with AI precision</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-glass rounded-3xl p-8 shadow-2xl hover-glow">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-primary rounded-full px-4 py-2 mb-4">
                <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-black font-medium text-sm">AI Resume Optimization</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">Tailor Your Resume</h2>
              <p className="text-white/80 text-lg">Upload your resume and job description to get started</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Resume Input */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-black font-bold text-sm">1</span>
                  </div>
                  <label className="text-lg font-semibold text-white">Your Resume</label>
                </div>
                <Textarea
                  rows={10}
                  placeholder="Paste your current resume content here...

Include your:
• Contact information
• Professional summary
• Work experience
• Skills and qualifications
• Education background"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl transition-all duration-300 resize-none"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
                <div className="text-xs text-white/60 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {resume.length}/5000 characters
                </div>
              </div>

              {/* Job Description Input */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-secondary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-black font-bold text-sm">2</span>
                  </div>
                  <label className="text-lg font-semibold text-white">Job Description</label>
                </div>
                <Textarea
                  rows={10}
                  placeholder="Paste the job description here...

Include:
• Job title and company
• Required qualifications
• Responsibilities and duties
• Preferred skills
• Company culture and values"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl transition-all duration-300 resize-none"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
                <div className="text-xs text-white/60 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                  {jd.length}/3000 characters
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !resume || !jd}
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-12 py-4 rounded-xl text-lg transition-all duration-300 hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>AI is analyzing and tailoring your resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tailor My Resume
                  </div>
                )}
              </Button>
              
              {(!resume || !jd) && (
                <p className="text-white/60 text-sm mt-3">
                  Please fill in both fields to continue
                </p>
              )}
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Analysis</h3>
                <p className="text-white/70 text-sm">AI analyzes job requirements and matches your skills</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Content Optimization</h3>
                <p className="text-white/70 text-sm">Rewrite and enhance your content for maximum impact</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quality Feedback</h3>
                <p className="text-white/70 text-sm">Get actionable insights and improvement suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}