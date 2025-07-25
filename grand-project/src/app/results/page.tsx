"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../api/lib/supabaseClient";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();

  useEffect(() => {
    const fetchLatestResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
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

  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      ));
  };

  const formatTextWithCSS = (text: string) => {
    return (
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {text}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your tailored resume...</p>
      </div>
    );
  }

  if (!latestResume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-semibold mb-4">No Resume Found</h2>
        <Button onClick={() => router.push("/dashboard")}>
          Go Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Tailored Resume</h2>
        <Button onClick={() => router.push("/dashboard")}>
          Create New Resume
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium mb-2">Tailored Resume</h3>
          <div className="p-4 border rounded-lg bg-gray-50 text-sm leading-relaxed">
            <div className="whitespace-pre-wrap">
              {latestResume.tailored_text}
            </div>
            
            </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">AI Feedback</h3>
          <div className="p-4 border rounded-lg bg-blue-50 text-sm leading-relaxed">
            <div className="whitespace-pre-wrap">
              {latestResume.feedback}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Job Description</h3>
        <div className="p-4 border rounded-lg bg-gray-50 text-sm leading-relaxed">
          <div className="whitespace-pre-wrap">
            {latestResume.job_description}
          </div>
        </div>
      </div> */}
    </div>
  );
}