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
        router.push("/login");
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
      router.push("/login");
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

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tailor Your Resume</h2>
      <Textarea
        rows={6}
        placeholder="Paste your resume here..."
        className="mb-4"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />
      <Textarea
        rows={4}
        placeholder="Paste the job description here..."
        className="mb-4"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={loading}
      >
        {loading ? "Tailoring..." : "Tailor Resume"}
      </Button>
    </div>
  );
}