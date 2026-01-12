"use client";
import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import Sidebar from '../../shared/components/Sidebar'
import clsx from "clsx";
import { useRouter } from 'next/navigation';
import { MdArrowForwardIos } from "react-icons/md";
import { getContestStatus, joinContest } from './services/contestService';

function ChallengesPage() {
  const router = useRouter();
  const [confirmRegistration, setConfirmRegistration] = useState(false);
  const [contestData, setContestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const contestID = process.env.NEXT_PUBLIC_CONTEST_ID || '';

  useEffect(() => {
    const fetchContestStatus = async () => {
      try {
        const response = await getContestStatus(contestID);
        setContestData(response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load contest");
        } else {
          setError("Failed to load contest");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContestStatus();
  }, []);

  const handleEnrollment = async () => {
    setEnrolling(true);
    setEnrollError(null);
    try {
      const result = await joinContest(contestID);

      if (result.success) {
        const response = await getContestStatus(contestID);
        setContestData(response);
        setConfirmRegistration(false);
        alert("Successfully registered for contest!");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err: any) {
      setEnrollError(err?.message || "Failed to register");
      console.error("Registration error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  

  if (loading) return (
    <div className='min-h-screen bg-black overflow-x-hidden'>
      <div className='flex flex-row'>
        <div className='sticky top-0 h-screen'>
          <Sidebar/>
        </div>
        <main className="flex-1 bg-black min-h-screen">
          <header className='border-b bg-black w-full h-16 border-[#191919] flex items-center px-6'>
            <div className='flex items-center gap-2 text-white'>
              <span className='text-neutral-500'>Contest</span>
              <MdArrowForwardIos className='text-neutral-500' />
              <span>Coding</span>
            </div>
          </header>
          <p className="text-white text-center mt-20">Loading contest...</p>
        </main>
      </div>
    </div>
  );
  
  if (error) return (
    <div className='min-h-screen bg-black overflow-x-hidden'>
      <div className='flex flex-row'>
        <div className='sticky top-0 h-screen'>
          <Sidebar/>
        </div>
        <main className="flex-1 bg-black min-h-screen">
          <header className='border-b bg-black w-full h-16 border-[#191919] flex items-center px-6'>
            <div className='flex items-center gap-2 text-white'>
              <span className='text-neutral-500'>Contest</span>
              <MdArrowForwardIos className='text-neutral-500' />
              <span>Coding</span>
            </div>
          </header>
          <div className="p-2 md:p-2">
            <div className="max-w-7xl mx-auto">
              <div className='bg-green-500/40 border border-green-500/20 rounded-lg p-2 mb-2 text-center text-green-400 font-semibold'>
                <h2>Participate in coding contest and compete with <span className='bg-black text-yellow-500 font-bold rounded-xl px-3 py-2'>150+</span> candidates</h2>
              </div>
              
              <div className="w-full mx-auto relative mb-8">
                <div className="w-full h-95 relative overflow-hidden rounded-lg">
                  <img
                    src='https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/challnage.png'
                    alt="contest banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full max-w-md mx-auto border border-neutral-500/50 bg-black rounded-lg overflow-hidden relative shadow-lg">
                <div className="w-full p-2 h-40 relative mb-4">
                  <img 
                    src='https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png?updatedAt=1767366130662'
                    alt="contest logo"
                    className="w-full p-2 h-40 object-cover border border-neutral-500/50 rounded-xl"
                  />
                  <SlCalender className="absolute top-4 right-4 text-gray-500/50 text-white text-xl" />
                </div>

                <div className="flex flex-col px-4">
                  <h1 className="text-white text-xl font-bold">Contest Error</h1>
                  <p className="text-gray-400 text-sm">Failed to load</p>
                  <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-bold mt-2 bg-red-500 text-white">
                    Error
                  </span>
                  <p className="text-gray-300 text-sm mt-1"><b>Error: {error}</b></p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 font-bold rounded-lg mt-4 text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  const renderContent = () => {
    const action = contestData?.action;

    if (action === "JOIN_CONTEST") {
      return {
        title: contestData?.contestName || "Contest",
        round: contestData?.currentRound?.roundName || "Registration Round",
        status: "Live",
        button: "Join Contest",
        buttonColor: "bg-green-500 hover:bg-green-600",
        message: "Registration is open",
        isDisabled: false,
      };
    }

    if (action === "ALREADY_REGISTERED") {
      return {
        title: contestData?.contestName || "Contest",
        round: "Registration Round",
        status: "Registered",
        button: "Already Registered",
        buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        message: contestData?.message || "You are registered",
        isDisabled: true,
      };
    }

    if (action === "START_CODING_ROUND") {
      return {
        title: contestData?.contestName || "Contest",
        round: contestData?.currentRound?.roundName || "Coding Round",
        status: "Live",
        button: "Start Coding Test",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
        message: "Coding round is active",
        isDisabled: false,
      };
    }

    if (action === "TEST_ALREADY_TAKEN") {
      return {
        title: contestData?.contestName || "Contest",
        round: "Coding Round",
        status: "Completed",
        button: "Test Already Taken",
        buttonColor: "bg-gray-500 cursor-not-allowed",
        message: "You have already completed this test",
        isDisabled: true,
      };
    }

    if (action === "WAIT") {
      return {
        title: "Contest",
        round: "No Active Round",
        status: "Waiting",
        button: "Wait",
        buttonColor: "bg-gray-500 cursor-not-allowed",
        message: contestData?.message || "No active rounds",
        isDisabled: true,
      };
    }

    return {
      title: "No Contest",
      round: "Check back later",
      status: "Inactive",
      button: "Refresh",
      buttonColor: "bg-gray-500",
      message: "No contest available",
      isDisabled: true,
    };
  };

  const content = renderContent();
const handleButtonClick = async () => {
  if (content.isDisabled) {
    return;
  }

  if (contestData?.action === "JOIN_CONTEST") {
    setConfirmRegistration(true);
    return;
  }

  if (contestData?.action === "START_CODING_ROUND") {
    router.push('/challenges/coding');
    return;
  }
};

  return (
    <div className='min-h-screen bg-black overflow-x-hidden'>
      <div className='flex flex-row'>
        <div className='sticky top-0 h-screen'>
          <Sidebar/>
        </div>
        
        <main className="flex-1 bg-black min-h-screen">
          <header className='border-b bg-black w-full h-16 border-[#191919] flex items-center px-6'>
            <div className='flex items-center gap-2 text-white'>
              <span className='text-neutral-500'>Contest</span>
              <MdArrowForwardIos className='text-neutral-500' />
              <span>Coding</span>
            </div>
          </header>
          
          <div className="p-2 md:p-2">
            <div className="max-w-7xl mx-auto">
              <div className='bg-green-500/40 border border-green-500/20 rounded-lg p-2 mb-2 text-center text-green-400 font-semibold'>
                <h2>Participate in coding contest and compete with <span className='bg-black text-yellow-500 font-bold rounded-xl px-3 py-2'>150+</span> candidates</h2>
              </div>
              
              <div className="w-full mx-auto relative mb-8">
                <div className="w-full h-95 relative overflow-hidden rounded-lg">
                  <img
                    src='https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/challnage.png'
                    alt="contest banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full max-w-md mx-auto border border-neutral-500/50 bg-black rounded-lg overflow-hidden relative shadow-lg">
                <div className="w-full p-2 h-40 relative mb-4">
                  <img 
                    src='https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/amazone.png'
                    alt="contest logo"
                    className="w-full p-2 h-40 object-cover border border-neutral-500/50 rounded-xl"
                  />
                  <SlCalender className="absolute top-4 right-4 text-gray-500/50 text-white text-xl" />
                </div>

                <div className="flex flex-col px-4">
                  <h1 className="text-white text-xl font-bold">{content.title}</h1>
                  <p className="text-gray-400 text-sm">{content.round}</p>

                  <span
                    className={clsx(
                      "inline-block w-fit px-3 py-1 rounded-full text-xs font-bold mt-2",
                      content.status === "Live"
                        ? "bg-green-500 text-black"
                        : content.status === "Registered"
                        ? "bg-yellow-500 text-black"
                        : content.status === "Waiting"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-500 text-white"
                    )}
                  >
                    {content.status}
                  </span>

                  <p className="text-gray-300 text-sm mt-1"><b>{content.message}</b></p>

                  <button
                    onClick={handleButtonClick}
                    className={clsx(
                      "px-4 py-2 font-bold rounded-lg mt-4 text-white",
                      content.buttonColor,
                      (enrolling || content.isDisabled) && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={content.isDisabled || enrolling}
                  >
                    {content.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
        
      {confirmRegistration && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl border border-neutral-500 p-6 w-80">
            <h3 className="text-white font-bold text-lg">Confirm Registration</h3>
            <p className="text-gray-400 mt-2">Do you want to register for this contest?</p>
            {enrollError && <p className="text-red-500 text-sm mt-2">{enrollError}</p>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="flex-1 bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50"
              >
                {enrolling ? "Registering..." : "Yes"}
              </button>
              <button
                onClick={() => {
                  setConfirmRegistration(false);
                  setEnrollError(null);
                }}
                disabled={enrolling}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengesPage;
