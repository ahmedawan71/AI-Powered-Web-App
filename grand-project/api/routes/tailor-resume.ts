import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabaseClient';
import { requireAuth } from '../lib/requireAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth guard
  await requireAuth(req, res, async () => {
    const { resume_text, job_description } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Missing resume_text or job_description' });
    }

    const user = (req as any).user;
    // TODO: enqueue to n8n webhook or call your LLM service here
    // placeholder:
    const tailored_text = `TAILORED: ${resume_text.slice(0, 50)}...`;
    const feedback = `Feedback for job: ${job_description.slice(0, 50)}...`;

    // Save to DB
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        original_text: resume_text,
        tailored_text,
        job_description
      })
      .select()
      .single();

    if (error) {
      console.error('DB insert error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({
      resume: data,
      tailored_text,
      feedback
    });
  });
}
