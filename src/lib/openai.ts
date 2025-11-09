import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Enhance a job description using AI
 */
export async function enhanceJobDescription(rawDescription: string, jobTitle: string, industry: string = 'GoHighLevel'): Promise<string> {
  try {
    const prompt = `You are an expert job description writer specializing in ${industry} positions.

Job Title: ${jobTitle}
Raw Description: ${rawDescription}

Please enhance this job description to be more compelling, clear, and professional. Include:
1. A strong opening paragraph that sells the opportunity
2. Clear responsibilities in bullet points
3. Required and preferred qualifications
4. Benefits and perks (if mentioned, otherwise suggest industry-standard benefits)
5. Call to action for candidates

Keep the GoHighLevel/marketing automation context in mind. Make it engaging but professional.
Limit to 600-800 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert job description writer who creates compelling, clear, and inclusive job postings.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || rawDescription;
  } catch (error) {
    console.error('Error enhancing job description:', error);
    throw new Error('Failed to enhance job description');
  }
}

/**
 * Generate suggested skills based on job title and description
 */
export async function generateSkillSuggestions(jobTitle: string, description: string): Promise<string[]> {
  try {
    const prompt = `Based on this job posting, suggest 8-12 relevant technical and soft skills:

Job Title: ${jobTitle}
Description: ${description}

Return only a JSON array of skill names. Example: ["JavaScript", "Communication", "Problem Solving"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || '[]';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating skill suggestions:', error);
    return [];
  }
}

/**
 * Analyze a resume and extract key information
 */
export async function analyzeResume(resumeText: string): Promise<{
  summary: string;
  skills: string[];
  experience_years: number;
  strengths: string[];
  areas_for_improvement: string[];
  job_titles: string[];
  match_score?: number;
}> {
  try {
    const prompt = `Analyze this resume and provide a structured assessment:

${resumeText}

Return a JSON object with:
- summary: Brief 2-3 sentence summary of the candidate
- skills: Array of technical and soft skills identified
- experience_years: Estimated years of professional experience
- strengths: Array of 3-5 key strengths
- areas_for_improvement: Array of 2-3 areas for growth
- job_titles: Array of past job titles

Example:
{
  "summary": "Experienced developer with...",
  "skills": ["JavaScript", "React"],
  "experience_years": 5,
  "strengths": ["Strong communication", "Fast learner"],
  "areas_for_improvement": ["Could expand backend knowledge"],
  "job_titles": ["Senior Developer", "Developer"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer and career coach.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

/**
 * Calculate job-candidate match score
 */
export async function calculateMatchScore(
  jobDescription: string,
  jobTitle: string,
  requiredSkills: string[],
  candidateResume: string,
  candidateSkills: string[]
): Promise<{
  score: number;
  matching_skills: string[];
  missing_skills: string[];
  reasoning: string;
  recommendations: string[];
}> {
  try {
    const prompt = `You are a job matching expert. Calculate how well this candidate matches the job:

JOB:
Title: ${jobTitle}
Description: ${jobDescription}
Required Skills: ${requiredSkills.join(', ')}

CANDIDATE:
Resume: ${candidateResume}
Skills: ${candidateSkills.join(', ')}

Return a JSON object with:
- score: Match score from 0-100
- matching_skills: Array of skills the candidate has that match job requirements
- missing_skills: Array of required skills the candidate appears to lack
- reasoning: 2-3 sentence explanation of the score
- recommendations: Array of 2-3 suggestions for the candidate

Example:
{
  "score": 75,
  "matching_skills": ["JavaScript", "React"],
  "missing_skills": ["Node.js"],
  "reasoning": "Strong match overall...",
  "recommendations": ["Consider learning Node.js", "Highlight project management experience"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at matching candidates to job opportunities.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error calculating match score:', error);
    throw new Error('Failed to calculate match score');
  }
}

/**
 * Generate interview questions based on job description
 */
export async function generateInterviewQuestions(jobTitle: string, jobDescription: string, experienceLevel: string): Promise<{
  technical: string[];
  behavioral: string[];
  situational: string[];
}> {
  try {
    const prompt = `Generate interview questions for this position:

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Description: ${jobDescription}

Return a JSON object with:
- technical: Array of 5 technical questions
- behavioral: Array of 5 behavioral questions
- situational: Array of 3 situational questions

Make questions specific to GoHighLevel and marketing automation where relevant.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer who creates insightful, role-specific questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw new Error('Failed to generate interview questions');
  }
}

export { openai };
