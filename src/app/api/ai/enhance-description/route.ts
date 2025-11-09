import { NextRequest, NextResponse } from 'next/server';
import { enhanceJobDescription } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, jobTitle, industry } = body;

    if (!description || !jobTitle) {
      return NextResponse.json(
        { error: 'Description and job title are required' },
        { status: 400 }
      );
    }

    const enhancedDescription = await enhanceJobDescription(
      description,
      jobTitle,
      industry || 'GoHighLevel'
    );

    return NextResponse.json({
      enhanced_description: enhancedDescription,
      original_description: description
    });

  } catch (error: any) {
    console.error('Error in enhance-description API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enhance description' },
      { status: 500 }
    );
  }
}
