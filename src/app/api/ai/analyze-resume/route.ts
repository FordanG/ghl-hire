import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/openai';

// Hard cap on resume input to bound OpenAI token cost
const MAX_RESUME_LENGTH = 50000;

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
    const { resumeText } = body;

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    if (resumeText.length > MAX_RESUME_LENGTH) {
      return NextResponse.json(
        { error: `Resume text exceeds maximum length of ${MAX_RESUME_LENGTH} characters` },
        { status: 400 }
      );
    }

    const analysis = await analyzeResume(resumeText);

    return NextResponse.json({
      analysis,
      success: true
    });

  } catch (error) {
    console.error('Error in analyze-resume API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
