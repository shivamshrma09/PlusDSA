"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import CodingEnvironment from "../components/Codinground";
import { startCodingRound, submitTest } from '../services/contestService';

function CodingRound() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contestID = process.env.NEXT_PUBLIC_CONTEST_ID || '';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await startCodingRound(contestID);
        
        if (response.success) {
          setQuestions(response.questions || []);
        } else {
          throw new Error(response.message || 'Failed to start coding round');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('Error starting coding round:', err);
        } else {
          setError('An unexpected error occurred');
          console.error('Unknown error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (savedCodes: any = {}, selectedLang = 'JavaScript', questionsList: any = null) => {
    try {
      
      const questionsToUse = questionsList || questions;
      
      if (!questionsToUse || !Array.isArray(questionsToUse) || questionsToUse.length === 0) {
        throw new Error('No questions available for submission');
      }
      
      const codes = savedCodes || {};
      
      const questionsWithCode = questionsToUse.map((question: any, index: number) => {
        const questionNum = index + 1;
        const codeKey = `q${questionNum}_${selectedLang}`;
        
        return {
          question: question.title || `Question ${questionNum}`,
          answer: codes[codeKey] || ""
        };
      });


      const result = await submitTest(contestID, questionsWithCode);
      
      if (result.success) {
        alert("Test submitted successfully!");
        router.push('/challenges');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error?.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading coding round...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <CodingEnvironment 
      questionsList={questions}
      testdetails={{
        companyName: "Contest",
        roundType: "Coding Round",
        duration: "90 minutes"
      }}
      contestId={contestID}
      onBack={() => router.push('/challenges')}
      onSubmit={handleSubmit}
    />
  );
}

export default CodingRound;
