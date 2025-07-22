"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetch("/api/tailor-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resume, job_description: jd }),
    });
    if (res.ok) router.push("/results");
    else alert("Error tailoring resume.");
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
