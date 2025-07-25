import { NextResponse } from 'next/server';
import { supabase } from '../../../api/lib/supabaseClient';
import { requireAuth } from '../../../api/lib/requireAuth';
const WEBHOOK_BASE = process.env.N8N_WEBHOOK_URL!;

export async function POST(req: Request) {
  try {
    const { resume_text, job_description } = await req.json();

    if (!resume_text || !job_description) {
      return NextResponse.json({ error: 'Missing resume_text or job_description' }, { status: 400 });
    }

    return await requireAuth(req, async () => {
      try {
        const n8nResponse = await fetch(`https://resumetailorn8n-production.up.railway.app/webhook/tailor-resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume_text: resume_text,
            job_description: job_description
          }),
        });

        if (!n8nResponse.ok) {
          throw new Error(`n8n webhook failed with status: ${n8nResponse.status}`);
        }

        const tailoredData = await n8nResponse.json();

        if (!tailoredData.tailored_text) {
          throw new Error('Invalid response from AI service: missing tailored_text');
        }

        const { data, error } = await supabase
          .from('resumes')
          .insert({
            original_text: resume_text,
            tailored_text: tailoredData.tailored_text,
            job_description,
            feedback: tailoredData.feedback || 'No feedback provided',
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        return NextResponse.json({
          resume: data,
          tailored_text: tailoredData.tailored_text,
          feedback: tailoredData.feedback || 'No feedback provided'
        });

      } catch (n8nError: any) {
        console.error('n8n webhook error:', n8nError.message);
        return NextResponse.json({
          error: `AI service unavailable: ${n8nError.message}`
        }, { status: 503 });
      }
    });

  } catch (error: any) {
    console.error('API error:', error.message);
    return NextResponse.json({
      error: `Internal server error: ${error.message}`
    }, { status: 500 });
  }
}