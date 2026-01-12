const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const PLUSDSA_INFO = `
PlusDSA Platform Information:
- PlusDSA is a comprehensive DSA (Data Structures & Algorithms) learning platform
- Features: Interactive problem solving, progress tracking, timer functionality, leaderboards
- Courses: Striver A2Z DSA Course with 455+ problems across 18 steps
- Tools: Problem practice, coding challenges, weekly tests, space repetition
- Community: Learning partners, discussions, peer connections
- Progress tracking with difficulty-wise problem counts (Easy/Medium/Hard)
- Real-time collaboration and mentorship opportunities
- Integrated with popular coding platforms like LeetCode, GitHub
`;

export const getAIRecommendation = async (userMessage: string, userData: any[]) => {
  
  try {
    const partnersData = userData.map(partner => 
      `- ${partner.name} from ${partner.college}, ${partner.year}\n` +
      `  Skills: ${partner.tags?.join(', ')}\n` +
      `  Description: ${partner.description}\n` +
      `  Contact: LinkedIn - ${partner.linkedinUrl}, GitHub - ${partner.githubUrl}\n`
    ).join('\n');

    const prompt = `You are PlusDSA AI Assistant. Give SHORT and CONCISE responses in ENGLISH only.

${PLUSDSA_INFO}

RULES:
1. Answer ONLY about: learning partners, PlusDSA features, DSA help, programming
2. Keep responses under 100 words
3. Recommend specific partners when relevant
4. Use simple English, no Hindi/other languages

User: "${userMessage}"

Partners:
${partnersData}

Give a brief, helpful response:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        recommendation: data.candidates[0].content.parts[0].text
      };
    } else {
      return {
        success: false,
        recommendation: 'I can help you find learning partners on PlusDSA platform and guide you with DSA learning. What specific help do you need?'
      };
    }
  } catch (error) {
    console.error('AI recommendation error:', error);
    return { 
      success: false, 
      error: (error as Error).message,
      recommendation: 'I can help you find learning partners on PlusDSA platform and guide you with DSA learning. What specific help do you need?'
    };
  }
};