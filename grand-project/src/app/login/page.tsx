"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../api/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
    else alert(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login via Magic Link</h2>
      {sent ? (
        <p className="text-green-600">Check your email for the magic link!</p>
      ) : (
        <>
          <Input
            type="email"
            placeholder="you@example.com"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={sendLink}>Send Magic Link</Button>
        </>
      )}
    </div>
  );
}
