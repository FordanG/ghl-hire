import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateMatchScore } from '@/lib/openai';

// Hard caps on inputs to bound OpenAI token cost
const MAX_DESCRIPTION_LENGTH = 20000;
const MAX_TITLE_LENGTH = 200;
const MAX_RESUME_LENGTH = 50000;
const MAX_SKILLS = 50;

export async function POST(request: NextRequest) {
  try {
    // Require an authenticated session to prevent anonymous OpenAI cost abuse
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobDescription, jobTitle, requiredSkills, candidateResume, candidateSkills } = body;

    if (
      !jobDescription || typeof jobDescription !== 'string' ||
      !jobTitle || typeof jobTitle !== 'string' ||
      !candidateResume || typeof candidateResume !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Job description, title, and candidate resume are required' },
        { status: 400 }
      );
    }

    if (
      jobDescription.length > MAX_DESCRIPTION_LENGTH ||
      jobTitle.length > MAX_TITLE_LENGTH ||
      candidateResume.length > MAX_RESUME_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    const toSkillList = (value: unknown): string[] =>
      Array.isArray(value)
        ? value.filter((s): s is string => typeof s === 'string').slice(0, MAX_SKILLS)
        : [];

    const matchResult = await calculateMatchScore(
      jobDescription,
      jobTitle,
      toSkillList(requiredSkills),
      candidateResume,
      toSkillList(candidateSkills)
    );

    return NextResponse.json({
      match: matchResult,
      success: true
    });

  } catch (error) {
    console.error('Error in match-job API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate job match' },
      { status: 500 }
    );
  }
}
