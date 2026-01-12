"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from 'next/navigation';
import { TfiTimer } from "react-icons/tfi";
import { MdFullscreen, MdFullscreenExit, MdVideoCall } from "react-icons/md";
import { TbBrandCpp } from "react-icons/tb";
import { FaJs, FaPython, FaJava } from "react-icons/fa";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { runTestCases } from "../services/judge0.service";
import { trackActivity, submitTest } from '../services/contestService'
import { toast } from 'react-hot-toast';


import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { lineNumbers } from "@codemirror/view";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoPlay } from "react-icons/io5";

interface CodingEnvironmentProps {
  questionsList: any[];
  testdetails: any;
  onBack: () => void;
  onSubmit: (savedCodes?: any, selectedLang?: string, questionsList?: any[]) => void;
  contestId: string;
}

function CodingEnvironment({ questionsList, testdetails, onBack, onSubmit, contestId }: CodingEnvironmentProps) {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [assessmentStarted, setAssessmentStarted] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string>("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [localQuestionsList, setLocalQuestionsList] = useState<any[]>(questionsList || []);
  const [timer, setTimer] = useState<number>(5400);
  const [selectedLang, setSelectedLang] = useState<string>("JavaScript");
  const [activeTab, setActiveTab] = useState<string>("description");
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [font, setFont] = useState<number>(15);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [videoOpen, setVideoOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [savedCodes, setSavedCodes] = useState<Record<string, string>>({});
  const [numberoftest, setNumberoftest] = useState<number>(0);
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(0);
  const [testResults, setTestResults] = useState<Record<number, any[]>>({});
  const [orientation, setOrientation] = useState<string>('landscape');
  const [suspiciousActivityCount, setSuspiciousActivityCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const videoFloatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateOrientation = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile && window.innerHeight > window.innerWidth) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  const interviewers = [
    "Rajesh Kumar",
    "Vikram Patel",
    "Arjun Mehta",
    "Rohit Agarwal",
    "Amit Verma",
    "Sanjay Malhotra",
    "Karan Singh",
    "Aditya Sharma",
    "Manish Gupta",
    "Ravi Nair",
  ];

  const videoNumber = Math.floor(Math.random() * 10) + 1;
  const interviewerName = interviewers[videoNumber - 1];

  useEffect(() => {
    setVerified(true);
    setLoading(false);
  }, []);


  useEffect(() => {
    // Questions are already provided via props, no need to fetch
    if (questionsList && questionsList.length > 0) {
      setLocalQuestionsList(questionsList);
      if (questionsList[0]?.time) {
        setTimer(questionsList[0].time);
      }
    }
  }, [questionsList]);

  useEffect(() => {
    if (localQuestionsList && localQuestionsList[currentQuestion - 1]) {
      const key = `q${currentQuestion}_${selectedLang}`;
      if (savedCodes[key]) {
        setCode(savedCodes[key]);
      } else {
        const question = localQuestionsList[currentQuestion - 1];
        const codeObj = question.defaultCode?.find(
          (item: any) => item.language === selectedLang
        );
        setCode(codeObj ? codeObj.code : "// Write your code here");
      }
    }
  }, [currentQuestion, selectedLang, localQuestionsList, savedCodes]);

  useEffect(() => {
    setSelectedTestCase(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (!assessmentStarted) return;
    
    const intervalId = setInterval(() => {
      setTimer((prev: any) => {
        if (prev <= 1) {
          if (contestId) {
            handleSubmitTest();
          } else {
            setShowSubmitConfirm(true);
          }
          return 0;
        }
        return prev - 1; 
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [assessmentStarted, contestId]);

  useEffect(() => {
    if (!assessmentStarted || !contestId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackActivity(contestId, 'tab_switch');
        setSuspiciousActivityCount(prev => prev + 1);
      }
    };

    const handleBlur = () => {
      trackActivity(contestId, 'window_blur');
      setSuspiciousActivityCount(prev => prev + 1);
    };

    const handleRightClick = (e: any) => {
      e.preventDefault();
      trackActivity(contestId, 'right_click');
      setSuspiciousActivityCount(prev => prev + 1);
    };

    const handleKeyDown = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        trackActivity(contestId, 'copy_paste');
        setSuspiciousActivityCount(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [assessmentStarted, contestId]);


  const saveCurrentCode = () => {
    if (code.trim()) {
      const key = `q${currentQuestion}_${selectedLang}`;
      setSavedCodes((prev: any) => ({ ...prev, [key]: code }));
    }
  };

  const getCurrentTestResults = () => {
    return testResults[currentQuestion] || [];
  };

  const getTotalQuestions = () => localQuestionsList.length;

  const getCurrentQuestion = () => {
    if (localQuestionsList && localQuestionsList[currentQuestion - 1]) {
      return localQuestionsList[currentQuestion - 1];
    }
    return null;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 ";
      case "Medium":
        return "text-yellow-400 bg-yellow-200";
      case "Hard":
        return "text-red-400 bg-red-200";
      default:
        return "text-gray-400 bg-gray-200";
    }
  };

  const languageExtensions: Record<string, any[]> = {
    JavaScript: [javascript(), lineNumbers()],
    Python: [python(), lineNumbers()],
    Java: [java(), lineNumbers()],
    "C++": [cpp(), lineNumbers()],
    C: [cpp(), lineNumbers()],
  };

  const handelquestionformard = (): void => {
    if (!verified) {
      router.push('/challenges');
      return;
    }
    
    if (currentQuestion < getTotalQuestions()) {
      saveCurrentCode();
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handelquestionbackeward = (): void => {
    if (!verified) {
      router.push('/challenges');
      return;
    }
    
    if (currentQuestion > 1) {
      saveCurrentCode();
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const minute = Math.floor(timer / 60);
  const second = timer % 60;
  
  const formatTimer = () => {
    const hours = Math.floor(timer / 3600);
    const mins = Math.floor((timer % 3600) / 60);
    const secs = timer % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitTest = async () => {
    if (!contestId || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      saveCurrentCode();
      
      const questions = localQuestionsList.map((question: any, index: any) => {
        const questionNumber = index + 1;
        const jsKey = `q${questionNumber}_JavaScript`;
        const pyKey = `q${questionNumber}_Python`;
        const javaKey = `q${questionNumber}_Java`;
        const cppKey = `q${questionNumber}_C++`;
        
        const answer = savedCodes[jsKey] || savedCodes[pyKey] || savedCodes[javaKey] || savedCodes[cppKey] || '';
        
        return {
          question: question.title,
          answer: answer
        };
      });
      
      const result = await submitTest(contestId, questions);
      
      if (result.success) {
        toast.success('Test submitted successfully!');
        if (onSubmit) onSubmit();
        router.push('/challenges');
      } else {
        toast.error(result.message || 'Submission failed');
        alert(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit test. Please try again.');
      alert('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  const handleFullscreenToggle = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setFullscreen(true);
      }).catch(() => {
        if (contestId) {
          trackActivity(contestId, 'fullscreen_exit');
          setSuspiciousActivityCount(prev => prev + 1);
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        setFullscreen(false);
        if (contestId) {
          trackActivity(contestId, 'fullscreen_exit');
          setSuspiciousActivityCount(prev => prev + 1);
        }
      });
    }
  };

  const getLanguageIcon = () => {
    switch (selectedLang) {
      case "JavaScript":
        return <FaJs className="text-yellow-400" size={16} />;
      case "Python":
        return <FaPython className="text-blue-400" size={16} />;
      case "Java":
        return <FaJava className="text-red-500" size={16} />;
      case "C++":
        return <TbBrandCpp className="text-blue-500" size={16} />;
      case "C":
        return <TbBrandCpp className="text-green-500" size={16} />;
      default:
        return <FaJs className="text-yellow-400" size={16} />;
    }
  };

  const handleLanguageChange = (lang: any) => {
    if (!verified) {
      router.push('/challenges');
      return;
    }
    
    saveCurrentCode();
    setSelectedLang(lang);
  };

  const handleCodeChange = (value: any) => {
    if (!verified) {
      router.push('/challenges');
      return;
    }
    
    setCode(value);
    const key = `q${currentQuestion}_${selectedLang}`;
    setSavedCodes((prev: any) => ({ ...prev, [key]: value }));
  };

  const runCode = async () => {
    if (!verified) {
      router.push('/challenges');
      return;
    }
    
    if (!code.trim()) {
      toast.error("Please write some code first!");
      setOutput("Please write some code first!");
      return;
    }
    setActiveTab("results");
    setCodeLoading(true);
    setOutput("Running code...");

    const currentQ = getCurrentQuestion();
    const testCases = currentQ?.testCases || [];
    setNumberoftest(testCases.length);

    try {
      const detailedResults = await runTestCases(code, selectedLang, testCases);

      const results = detailedResults.map(
        (result: any) =>
          `Test Case ${result.caseNumber}: ${result.output} | Expected: ${result.expected} | ${result.status}`
      );

      setOutput(results.join("\n"));
      setTestResults((prev: any) => ({
        ...prev,
        [currentQuestion]: detailedResults,
      }));
    } catch (error) {
      console.error("Error running code:", error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setCodeLoading(false);
    }
  };






  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Verifying access...</div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">Access denied. Redirecting...</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Verifying access...</div>
      </div>
    );
  }

  



  if (showFullscreenPrompt) {
    const handlePermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        await document.documentElement.requestFullscreen();
        setShowFullscreenPrompt(false);
        setAssessmentStarted(true);
      } catch (error) {
        if (error instanceof Error && error.name === "NotAllowedError") {
          setPermissionError(
            "Camera and fullscreen permissions are required to start the assessment."
          );
          toast.error("Camera and fullscreen permissions are required!");
        } else {
          setPermissionError(
            "Unable to access camera or enable fullscreen. Please try again."
          );
          toast.error("Unable to access camera or enable fullscreen!");
        }
      }
    };

    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8  rounded-lg  ">
  <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-white text-xl">Step</span>
              <div className="bg-[#d97757] font-bold text-2xl w-10 h-10 rounded-full text-white flex items-center justify-center">
                2
              </div>
            </div>
          </div>

                    <h1 className="text-2xl font-bold mb- text-[#d97757]">Required Permissions</h1>
                      <p className="text-gray-400 text-lg mb-8">Grant necessary permissions to proceed</p>

          <div className="text-left mb-6">
            <div className="flex items-center ml-12 gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-300 ">
                Camera access for proctoring (Required)
              </span>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">
                Fullscreen mode for focus (Required)
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            We are trying to give you same enviorment like real coding round
          </p>

          {permissionError && (
            <div className="bg-red-900/50 border border-red-500 rounded p-3 mb-4">
              <p className="text-red-300 text-sm">{permissionError}</p>
            </div>
          )}

          <div className="space-y- flex gap-2">
            <button
              onClick={handlePermissions}
              className="w-full px-4 py-3 bg-[#d97757] hover:bg-[#c86a47] text-white rounded font-semibold"
            >
              Grant Permissions
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center ">
        <div className="text-center max-w-md mx-auto p-8 rounded-lg  ">
          <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-white text-xl">Step</span>
                        <div className="bg-[#d97757] font-bold text-2xl w-10 h-10 rounded-full text-white flex items-center justify-center">
                          1
                        </div>
                      </div>
                    </div>

          <h1 className="text-2xl font-bold mb-1 text-[#d97757]">Ready to Begin?</h1>
          <p className="text-gray-400 text-sm mb-4">Prepare for your coding assessment</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Company:</span>
              <span className="text-white font-semibold">
                {testdetails?.companyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Round:</span>
              <span className="text-white font-semibold">
                {testdetails?.roundType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Questions:</span>
              <span className="text-white font-semibold">
                {localQuestionsList.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white font-semibold">
                {testdetails?.duration}
              </span>
            </div>
          </div>
          <p className="text-white mb-2">Type "start" to give mock test </p>
          <div className="gap-2 flex ">
            <input
              type="text"
              value={inputText}
              onChange={(e: any) => setInputText(e.target.value)}
              placeholder="Type here..."
              className="w-70 px-4 py-2 bg-black border border-gray-600 rounded text-white focus:outline-none focus:border-[#d97757]"
              autoFocus
            />

            <button
              onClick={() => setShowFullscreenPrompt(true)}
              disabled={inputText.toLowerCase() !== "start"}
              className={`w-30 py-0 rounded font-bold transition-all ${
                inputText.toLowerCase() === "start"
                  ? "bg-[#d97757] hover:bg-[#c86a47] text-white cursor-pointer"
                  : "hidden"
              }`}
            >
              {inputText.toLowerCase() === "start" ? "Enter" : ""}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orientation === "portrait") {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl mb-4">Please rotate your device</h2>
          <p className="text-gray-400">This application works best in landscape mode</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#d97757] rounded hover:bg-[#c86a47]">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="border-b border-[#191919] h-12 px-4">
        <div className="flex items-center h-full">
          <div className="flex items-center gap-2 text-white">
            <TfiTimer className="text-[#d97757]" size={20} />
            <span className={`${timer <= 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {formatTimer()}
            </span>

            <IoIosArrowBack
              className={
                currentQuestion === 1
                  ? "hidden"
                  : "block cursor-pointer hover:text-[#0340aa]"
              }
              onClick={handelquestionbackeward}
            />
            <IoIosArrowForward
              className={
                currentQuestion === getTotalQuestions()
                  ? "hidden"
                  : "block cursor-pointer hover:text-[#0340aa]"
              }
              onClick={handelquestionformard}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              {getLanguageIcon()}
              <select
                value={selectedLang}
                onChange={(e: any) => handleLanguageChange(e.target.value)}
                className="bg-[#191919] text-white border border-[#333] rounded px-2 py-1 text-sm"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C">C</option>
              </select>
            </div>

            <BiSolidUpvote
              onClick={() => font <= 25 && setFont(font + 5)}
              className="text-white cursor-pointer"
            />
            <BiSolidDownvote
              onClick={() => font >= 20 && setFont(font - 5)}
              className="text-white cursor-pointer"
            />

            <button
              onClick={handleFullscreenToggle}
              className="text-white hover:text-[#d97757] transition-colors"
            >
              {fullscreen ? (
                <MdFullscreenExit size={20} />
              ) : (
                <MdFullscreen size={20} />
              )}
            </button>

            <button
              ref={videoButtonRef}
              onClick={() => setVideoOpen(!videoOpen)}
              className="text-white hover:text-[#d97757] transition-colors"
              title="Toggle Video Help"
            >
              <MdVideoCall size={20} />
            </button>

            <button
              className="bg-[#d97757] hover:bg-[#c86a47] text-white border border-[#d97757] rounded px-3 py-1 transition-colors flex items-center gap-1 disabled:opacity-50"
              title="Run Code"
              onClick={runCode}
              disabled={codeLoading}
            >
              <IoPlay size={16} />
              <span className="text-sm font-medium">
                {codeLoading ? "Running..." : "Run"}
              </span>
            </button>

            {currentQuestion === getTotalQuestions() && (
              <button
                onClick={() => contestId ? handleSubmitTest() : setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white border border-green-600 rounded px-3 py-1 transition-colors flex items-center gap-1 disabled:opacity-50"
                title="Submit Assessment"
              >
                <span className="text-sm font-medium">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-48px)]">
        <div
          className={
            fullscreen
              ? "hidden"
              : "w-16 bg-[#0a0a0a] border-r border-[#191919] flex flex-col items-center py-4 gap-3"
          }
        >
          {localQuestionsList.map((question: any, index: any) => (
            <button
              key={index + 1}
              onClick={() => {
                saveCurrentCode();
                setCurrentQuestion(index + 1);
              }}
              className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors ${
                currentQuestion === index + 1
                  ? "bg-[#d97757] border-[#d97757] text-white"
                  : "border-gray-500 text-gray-400 hover:border-[#d97757] hover:text-white"
              }`}
              title={question?.title}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div
          className={
            fullscreen
              ? "hidden"
              : "w-2/5 border-r border-[#191919] flex flex-col"
          }
        >
          <div className="flex border-b border-[#191919]">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2 text-sm ${
                activeTab === "description"
                  ? "text-[#0340aa]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("testcases")}
              className={`px-4 py-2 text-sm ${
                activeTab === "testcases"
                  ? "text-[#0340aa]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-4 py-2 text-sm ${
                activeTab === "results"
                  ? "text-[#0340aa]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Test Results
            </button>
          </div>

          <div
            className="h-full p-4 text-white overflow-y-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activeTab === "description" && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {getCurrentQuestion()?.title || "Problem Title"}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded text-xl font-medium p-1 border border-neutral-500/30 rounded-xl ${getDifficultyColor(
                      getCurrentQuestion()?.difficulty
                    )}`}
                  >
                    {getCurrentQuestion()?.difficulty || "Easy"}
                  </span>
                </div>

                <p className="mb-4 text-gray-300 leading-relaxed">
                  {getCurrentQuestion()?.description ||
                    "Problem description will appear here..."}
                </p>

                {getCurrentQuestion()?.examples && (
                  <div className="space-y-4">
                    {getCurrentQuestion().examples.map((example: any, index: any) => (
                      <div key={index} className=" rounded-lg">
                        <p className="font-bold text-lg text-[#0340aa] mb-2">
                          Example {index + 1}:
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-bold text-md">Input:</span>{" "}
                           <span className='text-neutral-500'>{example.input}</span> 
                          </p>
                          <p>
                            <span className="font-bold text-md">Output:</span>{" "}
                                                       <span className='text-neutral-500 font-semibold'>{example.input}</span> 

                          </p>
                          {example.explanation && (
                            <p>
                              <span className="font-bold text-md">Explanation:</span>{" "}
                                                                                     <span className='text-neutral-500'>{example.explanation}</span> 


                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {getCurrentQuestion()?.constraints && (
                  <div className="mt-6">
                    <h4 className="font-bold text-lg mb-3 text-[#0340aa]">
                      Constraints:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {getCurrentQuestion().constraints.map(
                        (constraint: any, index: any) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#0340aa] mr-2 ">•</span>
                           <span className='text-bold text-md'>{constraint}</span> 
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "testcases" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Test Cases</h3>
                <div className="space-y-3">
                  {getCurrentQuestion()?.testCases?.map((testCase: any, index: any) => (
                    <div
                      key={index}
                      className={index <= 2 ? "p-3 rounded" : "hidden"}
                    >
                      <p className="font-bold text-lg text-[#0340aa] mb-2">
                        Test Case {index + 1}:
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Input:</span>{" "}
                        {testCase.input}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Expected:</span>{" "}
                        {testCase.expected}
                      </p>
                    </div>
                  )) || <p>No test cases available</p>}
                </div>
              </div>
            )}

            {activeTab === "results" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Test Results</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getCurrentQuestion()?.testCases?.map((test: any, idx: any) => {
                    if (idx >= 3) {
                      return;
                    }
                    const currentResults = getCurrentTestResults();
                    const result = currentResults.find(
                      (r: any) => r.caseNumber === idx + 1
                    );
                    return (
                      <button
                        className={`px-3 py-1 rounded-full  text-sm font-medium transition-colors
                           ${
                             selectedTestCase === idx + 1
                               ? "bg-[#0340aa]"
                               : "bg-black"
                           }`}
                        key={idx}
                        onClick={() => setSelectedTestCase(idx + 1)}
                      >
                        Case {idx + 1}{" "}
                        {result?.isCorrect ? "✅" : result ? "❌" : ""}
                      </button>
                    );
                  }) || (
                    <p className="text-gray-400">No test cases available</p>
                  )}
                </div>

                {selectedTestCase && getCurrentTestResults().length > 0 && (
                  <div className=" rounded-lg p-4 border border-gray-700">
                    {(() => {
                      const currentResults = getCurrentTestResults();
                      const result = currentResults.find(
                        (r: any) => r.caseNumber === selectedTestCase
                      );
                      if (!result)
                        return <p className="text-gray-400">No result found</p>;

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2 py-1 rounded text-sm font-medium 
                            "
                            ></span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500 font-medium">
                                Input:
                              </span>
                              <div className="  text-white p-2 rounded mt-1 font-mono ">
                                {result.input}
                              </div>
                            </div>

                            <div>
                              <span className="text-gray-500 font-medium">
                                Output:
                              </span>
                              <div className="p-2 rounded mt-1 font-mono text-white">
                                {result.output}
                              </div>
                            </div>

                            <div>
                              <span className="text-gray-500 font-medium">
                                Expected:
                              </span>
                              <div className=" p-2 rounded mt-1 font-mono text-white">
                                {result.expected}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {!selectedTestCase && getCurrentTestResults().length > 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Click on a test case button to view details
                  </p>
                )}

                {getCurrentTestResults().length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Run your code to see test results
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={
            fullscreen
              ? "w-full bg-black flex flex-col"
              : "w-3/5 bg-black flex flex-col"
          }
        >
          <div
            className="flex-1 overflow-y-scroll mb-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <CodeMirror
              value={code}
              height="100%"
              extensions={languageExtensions[selectedLang]}
              onChange={handleCodeChange}
              theme="dark"
              className="[&_.cm-editor]:!bg-black [&_.cm-content]:!bg-black [&_.cm-gutter]:!bg-black"
              style={{
                backgroundColor: "#000000",
                fontSize: font + "px",
              }}
            />
          </div>
        </div>
      </div>

      {videoOpen && (
        <div
          ref={videoFloatingRef}
          className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl fixed top-16 right-4"
          style={{ width: 320, height: 200, zIndex: 1000 }}
        >
          <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
            <span className="text-white text-sm font-medium">
              {interviewerName}
            </span>
            <button
              onClick={() => setVideoOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <video
            width="320"
            height="160"
            autoPlay
            muted
            loop
            className="w-full"
          >
            <source src={`/${videoNumber}video.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Submit Assessment?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to submit your assessment? You won't be able
              to make changes after submission.
            </p>
            <div className="flex gap-4">
              <button

                onClick={async () => {
                  saveCurrentCode();
                  setLoading(true);

                  try {
                    if (onSubmit) {
                      await onSubmit(savedCodes, selectedLang, localQuestionsList);
                      toast.success("Assessment submitted successfully!");
                      setShowSubmitConfirm(false);
                      if (onBack) onBack();
                    } else {
                      toast.error("No submission handler available");
                      throw new Error("No submission handler available");
                    }
                  } catch (error) {
                    console.error('Submission error:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Please try again.';
                    toast.error(`Submission failed: ${errorMessage}`);
                    alert(`Submission failed: ${errorMessage}`);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Yes, Submit"}
              </button>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodingEnvironment;
