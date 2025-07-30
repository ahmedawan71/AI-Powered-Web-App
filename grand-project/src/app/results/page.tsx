"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../api/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";  // Import jsPDF

interface Resume {
  id: string;
  original_text: string;
  tailored_text: string;
  job_description: string;
  feedback: string;
  created_at: string;
}

export default function ResultsPage() {
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resume' | 'feedback' | 'comparison'>('resume');
  const router = useRouter();

  useEffect(() => {
    const fetchLatestResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        alert("Error fetching resume data");
        router.push("/dashboard");
      } else {
        setLatestResume(data);
      }
      setLoading(false);
    };

    fetchLatestResume();
  }, [router]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // New function to download as PDF
  const downloadAsPDF = (content: string, filename: string) => {
    const doc = new jsPDF();
    doc.text(content, 10, 10);  // Add text to PDF at position (10, 10)
    doc.save(filename + '.pdf');  // Trigger PDF download
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full opacity-20 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-secondary rounded-full opacity-20 blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        <div className="bg-glass rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your tailored resume...</p>
        </div>
      </div>
    );
  }

  if (!latestResume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full opacity-20 blur-3xl animate-float"></div>
        </div>
        <div className="bg-glass rounded-2xl p-8 text-center">
          <div className="bg-gradient-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-white">No Resume Found</h2>
          <p className="text-white/70 mb-6">It looks like you haven't tailored any resumes yet.</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover-glow"
          >
            Create Your First Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary rounded-full opacity-15 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-secondary rounded-full opacity-20 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-accent rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-gradient-primary rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Resume Successfully Tailored!</h1>
                <p className="text-white/70 text-sm">Generated on {new Date(latestResume.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => copyToClipboard(latestResume.tailored_text)}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Resume
            </Button>
            <Button 
              onClick={() => downloadAsText(latestResume.tailored_text, 'tailored-resume.txt')}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 4V4a 2 2 0 012-2h4a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2z" />
              </svg>
              Download as Text
            </Button>
            {/* New Button for PDF Download */}
            <Button 
              onClick={() => downloadAsPDF(latestResume.tailored_text, 'tailored-resume')}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 4V4a2 2 0 012-2h4a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2z" />
              </svg>
              Download as PDF
            </Button>
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-primary hover:opacity-90 text-white font-semibold transition-all duration-300 hover-glow"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-glass rounded-2xl p-2 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'resume' 
                  ? 'bg-gradient-primary text-black shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tailored Resume
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'feedback' 
                  ? 'bg-gradient-secondary text-black shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Feedback
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'comparison' 
                  ? 'bg-gradient-accent text-black shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0l6 0m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Before & After
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-glass rounded-3xl p-8 shadow-2xl">
            {activeTab === 'resume' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <div className="bg-gradient-primary rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Your Optimized Resume
                  </h3>
                  <div className="flex gap-2">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ AI Optimized
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      Ready to Use
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white leading-relaxed">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {latestResume.tailored_text}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-secondary rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI Analysis & Recommendations</h3>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-2xl p-6 text-white leading-relaxed">
                  <div className="whitespace-pre-wrap">
                    {latestResume.feedback}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-accent rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0l6 0m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Before & After Comparison</h3>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-sm mr-2">BEFORE</span>
                      Original Resume
                    </h4>
                    <div className="bg-white/5 border border-red-400/20 rounded-2xl p-4 text-white/80 text-sm leading-relaxed max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-wrap font-mono">
                        {latestResume.original_text}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm mr-2">AFTER</span>
                      Tailored Resume
                    </h4>
                    <div className="bg-white/5 border border-green-400/20 rounded-2xl p-4 text-white text-sm leading-relaxed max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-wrap font-mono">
                        {latestResume.tailored_text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}