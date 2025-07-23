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
  const router = useRouter();

  // Get the Supabase session token when the component mounts
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session:", session); // Debug: Check if session exists
      if (session) {
        setToken(session.access_token);
        console.log(token)
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

    const res = await fetch("/api/tailor-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token here
      },
      body: JSON.stringify({ resume_text: resume, job_description: jd }),
    });

    if (res.ok) {
      router.push("/results");
    } else {
      const errorData = await res.json();
      console.error("Error response:", errorData);
      alert(`Error tailoring resume: ${errorData.error || "Unknown error"}`);
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
      <Button onClick={handleSubmit}>Tailor Resume</Button>
    </div>
  );
}