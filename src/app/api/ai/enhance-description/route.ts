import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { enhanceJobDescription } from '@/lib/openai';

// Hard caps on inputs to bound OpenAI token cost
const MAX_DESCRIPTION_LENGTH = 20000;
const MAX_TITLE_LENGTH = 200;
const MAX_INDUSTRY_LENGTH = 100;

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
    const { description, jobTitle, industry } = body;

    if (!description || typeof description !== 'string' || !jobTitle || typeof jobTitle !== 'string') {
      return NextResponse.json(
        { error: 'Description and job title are required' },
        { status: 400 }
      );
    }

    if (
      description.length > MAX_DESCRIPTION_LENGTH ||
      jobTitle.length > MAX_TITLE_LENGTH ||
      (typeof industry === 'string' && industry.length > MAX_INDUSTRY_LENGTH)
    ) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    const enhancedDescription = await enhanceJobDescription(
      description,
      jobTitle,
      typeof industry === 'string' && industry ? industry : 'GoHighLevel'
    );

    return NextResponse.json({
      enhanced_description: enhancedDescription,
      original_description: description
    });

  } catch (error) {
    console.error('Error in enhance-description API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enhance description' },
      { status: 500 }
    );
  }
}
