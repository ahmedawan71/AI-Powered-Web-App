import { NextResponse } from 'next/server';
import { supabase } from '../../../api/lib/supabaseClient';
import { requireAuth } from '../../../api/lib/requireAuth';

export async function POST(req: Request) {
  try {
    const { resume_text, job_description } = await req.json();

    if (!resume_text || !job_description) {
      return NextResponse.json({ error: 'Missing resume_text or job_description' }, { status: 400 });
    }

    return await requireAuth(req, async () => {
      // Mock response for testing
      const tailoredData = {
        tailored_text: "Mock tailored resume",
        feedback: "Mock feedback",
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          original_text: resume_text,
          tailored_text: tailoredData.tailored_text,
          job_description,
          feedback: tailoredData.feedback,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return NextResponse.json({ 
        resume: data, 
        tailored_text: tailoredData.tailored_text, 
        feedback: tailoredData.feedback 
      });
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: `Internal server error: ${error.message}` 
    }, { status: 500 });
  }
}