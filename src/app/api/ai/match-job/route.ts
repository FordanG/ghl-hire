import { NextRequest, NextResponse } from 'next/server';
import { calculateMatchScore } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, jobTitle, requiredSkills, candidateResume, candidateSkills } = body;

    if (!jobDescription || !jobTitle || !candidateResume) {
      return NextResponse.json(
        { error: 'Job description, title, and candidate resume are required' },
        { status: 400 }
      );
    }

    const matchResult = await calculateMatchScore(
      jobDescription,
      jobTitle,
      requiredSkills || [],
      candidateResume,
      candidateSkills || []
    );

    return NextResponse.json({
      match: matchResult,
      success: true
    });

  } catch (error: any) {
    console.error('Error in match-job API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate job match' },
      { status: 500 }
    );
  }
}
