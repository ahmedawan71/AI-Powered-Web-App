"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/api/lib/supabaseClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const [resume, setResume] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // Fetch the latest resume from Supabase
        const { data, error } = await supabase
          .from("resumes")
          .select("tailored_text, feedback")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Supabase fetch error:", error.message);
          alert("Failed to load resume: " + error.message);
          router.push("/dashboard");
          return;
        }

        setResume(data.tailored_text || "No tailored resume available");
        setFeedback(data.feedback || "No feedback available");
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error loading resume");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tailored Resume</h2>
      <h3 className="text-lg font-medium mb-2">Your Tailored Resume</h3>
      <Textarea rows={10} readOnly value={resume || ""} className="mb-4" />
      <h3 className="text-lg font-medium mb-2">Feedback</h3>
      <Textarea rows={4} readOnly value={feedback || ""} className="mb-4" />
      <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
    </div>
  );
}