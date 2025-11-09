import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeResume(resumeText);

    return NextResponse.json({
      analysis,
      success: true
    });

  } catch (error: any) {
    console.error('Error in analyze-resume API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
