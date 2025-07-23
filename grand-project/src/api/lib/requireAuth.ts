import { NextResponse } from 'next/server';
import { supabase } from './supabaseClient';

export async function requireAuth(req: Request, next: () => Promise<NextResponse>) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  (req as any).user = user;
  return await next();
}