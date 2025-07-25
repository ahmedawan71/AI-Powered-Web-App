"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../api/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login via Magic Link</h2>
      {sent ? (
        <p className="text-green-600">Check your email for the magic link! Click it to continue.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            className="mb-4 p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={sendLink} 
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
        </>
      )}
    </div>
  );
}