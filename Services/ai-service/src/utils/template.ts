export const CAREER_GUIDANCE_PROMPT = (skills: string[]) => `
Based on the following skills: ${skills.join(", ")}.
Please act as a career advisor and generate a career path suggestion.
Your entire response must be in a valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:
{
  "summary": "A brief, encouraging summary of the user's skill set and their general job title.",
  "jobOptions": [
    {
      "title": "The name of the job role.",
      "responsibilities": "A description of what the user would do in this role.",
      "why": "An explanation of why this role is a good fit for their skills."
    }
  ],
  "skillsToLearn": [
    {
      "category": "A general category for skill improvement",
      "skills": [
        {
          "title": "The name of the skill to learn.",
          "why": "Why learning this skill is important.",
          "how": "Specific examples of how to learn or apply this skill."
        }
      ]
    }
  ],
  "learningApproach": {
    "title": "How to Approach Learning",
    "points": ["A bullet point list of actionable advice for learning."]
  }
}
`;

export const RESUME_ANALYSIS_PROMPT = (resumeText: string) => `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance

Resume text:
${resumeText}

Your entire response must be in valid JSON format. Do not include any text or markdown formatting outside of the JSON structure.
The JSON object should have the following structure:
{
  "atsScore": 85,
  "scoreBreakdown": {
    "formatting": {
      "score": 90,
      "feedback": "Brief feedback on formatting"
    },
    "keywords": {
      "score": 80,
      "feedback": "Brief feedback on keyword usage"
    },
    "structure": {
      "score": 85,
      "feedback": "Brief feedback on resume structure"
    },
    "readability": {
      "score": 88,
      "feedback": "Brief feedback on readability"
    }
  },
  "suggestions": [
    {
      "category": "Category name",
      "issue": "Description of the issue found",
      "recommendation": "Specific actionable recommendation to fix it",
      "priority": "high/medium/low"
    }
  ],
  "strengths": ["List of things the resume does well for ATS"],
  "summary": "A brief 2-3 sentence summary of the overall ATS performance"
}
`;