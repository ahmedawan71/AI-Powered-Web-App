import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">AI-Powered Resume Tailor</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Instantly optimize your resume for any job.
      </p>
      <Button size="lg" asChild>
        <a href="/login">Get Started</a>
      </Button>
    </main>
  );
}
