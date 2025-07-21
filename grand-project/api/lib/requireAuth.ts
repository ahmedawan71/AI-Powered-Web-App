import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from './supabaseClient';

export async function requireAuth(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  (req as any).user = user;
  return next();
}
