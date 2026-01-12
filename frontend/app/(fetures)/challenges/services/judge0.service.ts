import axios from 'axios';

const JUDGE0_API = process.env.NEXT_PUBLIC_JUDGE_ZERO!;
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST!;

const getLanguageId = (language: string): number => {
  const languageMap: { [key: string]: number } = {
    'JavaScript': 63,
    'Python': 71,
    'Java': 62,
    'C++': 54,
    'C': 50,
  };
  return languageMap[language] || 63;
};

export const runCodeOnJudge0 = async (code: string, language: string, input: string) => {
  try {
    
    const payload = {
      source_code: code,
      language_id: getLanguageId(language),
      stdin: input || '',
    };
    
    
    const response = await axios.post(
      `${JUDGE0_API}?base64_encoded=false&wait=true`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        timeout: 30000,
      }
    );


    return {
      success: true,
      output: response.data.stdout?.trim() || response.data.stderr || 'No output',
      status: response.data.status?.description,
      error: response.data.stderr || response.data.compile_output,
      time: response.data.time,
      memory: response.data.memory,
    };
  } catch (error: any) {
    console.error('Judge0 error:', error);
    console.error('Error response:', error.response?.data);
    return {
      success: false,
      output: '',
      error: error.response?.data?.message || error.message || 'Execution failed',
    };
  }
};

const formatInputData = (input: string): string => {
  if (input.includes('nums = ') && input.includes('target = ')) {
    const parts = input.split(', ');
    const nums = parts[0].replace('nums = ', '');
    const target = parts[1].replace('target = ', '');
    return `${nums}\n${target}`;
  }
  return input;
};

export const runTestCases = async (code: string, language: string, testCases: any[]) => {
  
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const inputData = testCase.inputData || formatInputData(testCase.input);
    
    
    if (i > 0) {
      await new Promise((resolve: any) => setTimeout(resolve, 1000));
    }

    const result = await runCodeOnJudge0(code, language, inputData);
    
    const output = result.output || 'No output';
    const expected = testCase.expected;
    const isCorrect = output === expected;

    results.push({
      caseNumber: i + 1,
      input: testCase.input,
      inputData: inputData,
      output: output,
      expected: expected,
      status: isCorrect ? '✅ PASS' : '❌ FAIL',
      isCorrect: isCorrect,
      error: result.error,
    });
  }

  return results;
};