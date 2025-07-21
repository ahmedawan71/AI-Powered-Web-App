import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabaseClient';
import { requireAuth } from '../lib/requireAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await requireAuth(req, res, async () => {
    const { resume_text, job_description } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Missing resume_text or job_description' });
    }

    const user = (req as any).user;
    const response = await fetch('http://localhost:5678/webhook/tailor-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass user_id in the body so n8n can record it
      },
      body: JSON.stringify({
        user_id: user.id,
        resume_text,
        job_description
      })
    });
    if (!response.ok) throw new Error('n8n workflow error');
    const { tailored_text, feedback } = await response.json();


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
