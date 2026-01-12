"use client";
import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast'
import Sidebar from "../../../shared/components/Sidebar";
import { CiCircleInfo } from "react-icons/ci";

import {
  MdArrowForwardIos,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ActivityCalendar } from "react-activity-calendar";
import { IoIosChatboxes } from "react-icons/io";
import { MdQuiz } from "react-icons/md";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { GrCheckboxSelected } from "react-icons/gr";
import { SiLeetcode } from "react-icons/si";
import { BiLogoYoutube } from "react-icons/bi";
import { CiStickyNote } from "react-icons/ci";
import { HiOutlineStar } from "react-icons/hi";
import { BsStarFill } from "react-icons/bs";
import { PiTimer } from "react-icons/pi";
import { GrArticle } from "react-icons/gr";
import { blind75SheetData } from "../../../shared/data/blind75Sheet";
import loveBabbarSheetData from "../../../shared/data/loveBabbarSheet";
import { striverA2ZAllSteps } from "../../../shared/data/striver455sheet";
import neetcode150 from "../../../shared/data/neetcode150";
import DatePickerInput from "../../../shared/components/DatePickerInput";
import { FaCalendarAlt } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GiPodiumWinner } from "react-icons/gi";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Getsheetdata,
  handelquestionClick,
  handelNotepadClick,
  handelBookmarkClick,
  handelTimerClick,
  CreatePlaylist,
  AddQuestionToPlaylist,
  trackUserVisit,
  getUserActivity,
  submitTestData,
  getLeaderboard,
} from "../services/getsheetdata";
import { LuSave } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaPlusCircle } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import GeeksforGeeksPOTD from "../components/GeeksforGeeksPOTD"



import Feedback from "../../../shared/components/Feedback";
import { getTestQuestions } from "../../../shared/data/testQuestions";

import { IoCodeSlash, IoSearch } from "react-icons/io5";

ChartJS.register(ArcElement, Tooltip, Legend);

interface NotepadModalProps {
  isVisible: boolean;
  questionNumber: string;
  questionTitle: string;
  existingNote: string;
  onClose: () => void;
  onSave: (questionNumber: string, noteText: string) => void;
}

function NotepadModal({
  isVisible,
  questionNumber,
  questionTitle,
  existingNote,
  onClose,
  onSave,
}: NotepadModalProps) {
  const [noteText, setNoteText] = useState(existingNote || "");

  useEffect(() => {
    setNoteText(existingNote || "");
  }, [existingNote]);

  if (!isVisible) return null;

  const handleSave = () => {
    onSave(questionNumber, noteText);
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex justify-center items-center'>
      <div className='bg-black border border-neutral-500/30 rounded-lg max-w-md w-full mx-4'>
        <div className='flex justify-between items-center p-4 border-b border-neutral-500/30'>
          <h3 className='text-white text-lg font-semibold'>
            Add note for {questionTitle}
          </h3>
          <button 
            onClick={onClose}
            className='text-white hover:text-red-400 text-xl'
          >
            ✕
          </button>
        </div>
        <div className='p-4'>
          <textarea
            value={noteText}
            onChange={(e: any) => setNoteText(e.target.value)}
            placeholder='Write your note here...'
            className='w-full h-32 bg-neutral-800 text-white border border-neutral-600 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500'
          />
          <div className='flex justify-end gap-2 mt-4'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-4 py-2 bg-[#0340aa] hover:bg-[#0340aa]/80 text-white rounded-lg transition-colors'
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlaylistComponentProps {
  result: any;
  questionNumber: string;
  onCreatePlaylist: (name: string, description: string, isPublic: boolean) => void;
  onAddToPlaylist: (playlistId: string, questionNumber: string, difficulty: string) => void;
  difficulty: string;
}

function PlaylistComponent({
  result,
  questionNumber,
  onCreatePlaylist,
  onAddToPlaylist,
  difficulty,
}: PlaylistComponentProps) {
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      toast.error("Please enter playlist name");
      return;
    }
    onCreatePlaylist(playlistName, description, isPublic);
    setShowCreateForm(false);
    setShowModal(false);
    setPlaylistName("");
    setDescription("");
    setIsPublic(false);
  };

  const handleAddToPlaylist = (playlist: { playlistId: string }) => {
    onAddToPlaylist(playlist.playlistId, questionNumber, difficulty);
    setShowModal(false);
  };

  if (showCreateForm) {
    return (
      <div className='fixed inset-0 z-50 bg-black/50 flex justify-center items-center'>
        <div className='bg-black border border-neutral-500/30 rounded-lg max-w-md w-full mx-4'>
          <div className='flex justify-between items-center p-4 border-b border-neutral-500/30'>
            <h3 className='text-white text-lg font-semibold'>
              Create New Playlist
            </h3>
            <button 
              onClick={() => setShowCreateForm(false)}
              className='text-white hover:text-red-400 text-xl'
            >
              ✕
            </button>
          </div>
          <div className='p-4'>
            <input
              value={playlistName}
              onChange={(e: any) => setPlaylistName(e.target.value)}
              placeholder='Playlist name...'
              className='w-full mb-3 bg-neutral-800 text-white border border-neutral-600 rounded-lg p-3 focus:outline-none focus:border-blue-500'
            />
            <textarea
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              placeholder='Description (optional)...'
              className='w-full h-20 mb-3 bg-neutral-800 text-white border border-neutral-600 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500'
            />
            <select
              value={isPublic ? "true" : "false"}
              onChange={(e: any) => setIsPublic(e.target.value === "true")}
              className='w-full mb-4 bg-neutral-800 text-white border border-neutral-600 rounded-lg p-3 focus:outline-none focus:border-blue-500'
            >
              <option value="false">Private</option>
              <option value="true">Public</option>
            </select>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowCreateForm(false)}
                className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className='px-4 py-2 bg-[#0340aa] hover:bg-[#0340aa]/80 text-white rounded-lg transition-colors'
              >
                Create Playlist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showModal) {
    return (
      <div className='fixed inset-0 z-50 bg-black/50 flex justify-center items-center'>
        <div className='bg-black border border-neutral-500/30 rounded-lg max-w-md w-full mx-4'>
          <div className='flex justify-between items-center p-4 border-b border-neutral-500/30'>
            <h3 className='text-white text-lg font-semibold'>
              Add to Playlist
            </h3>
            <button 
              onClick={() => setShowModal(false)}
              className='text-white hover:text-red-400 text-xl'
            >
              ✕
            </button>
          </div>
          <div className='p-4'>
            <button
              onClick={() => setShowCreateForm(true)}
              className='w-full mb-3 p-3 border border-neutral-600 rounded-lg text-white hover:bg-neutral-800/50 transition-colors flex items-center gap-2'
            >
              <FaPlusCircle className='text-[#0340aa]' />
              Create New Playlist
            </button>
            
            {result?.data?.playlists?.length > 0 && (
              <div className='max-h-48 overflow-y-auto'>
                <p className='text-neutral-400 text-sm mb-2'>Existing Playlists:</p>
                {result.data.playlists.map((playlist: { playlistId: string; playlistName: string; description?: string }, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAddToPlaylist(playlist)}
                    className='w-full mb-2 p-3 border border-neutral-600 rounded-lg text-white hover:bg-neutral-800/50 transition-colors text-left'
                  >
                    <div className='font-medium'>{playlist.playlistName}</div>
                    {playlist.description && (
                      <div className='text-sm text-neutral-400 truncate'>{playlist.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <span
      className="text-white cursor-pointer hover:text-[#0340aa]/80 border flex justify-center items-center w-6 h-6 rounded-full border-white text-xl"
      onClick={() => setShowModal(true)}
    >
      +
    </span>
  );
}

interface TestComponentsProps {
  questionNumber: string;
  questionTitle: string;
  onClose: () => void;
  difficulty: string;
}

function TestComponents({ questionNumber, questionTitle, onClose, difficulty }: TestComponentsProps) {
  const [seeTest, setSeeTest] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testData, setTestData] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const q2Block = getTestQuestions(questionNumber);

if (q2Block) {
  q2Block.items.forEach((item: any) => {
    console.log('Done');
  });
}



  const currentQuestion = q2Block?.items?.[currentIndex];

  if (!q2Block || !currentQuestion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-xl border border-neutral-500/30 bg-black p-4">
          <p className="text-white text-center">Question not found</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if(!selectedAnswers[`${currentQuestion.index}`]) {
      toast.error('Please select an answer before proceeding!');
      return;
    }
    if (q2Block && currentIndex < q2Block.items.length - 1) {
      setCurrentIndex((prev: any) => prev + 1);
    }
  };

  const handleOptionClick = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    const questionKey = `${currentQuestion.index}`;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionKey]: optionIndex
    }));
    
    setTestData(prev => {
      const existing = prev.find(item => item.questionNumber === currentQuestion.index);
      const newData = {
        questionNumber: currentQuestion.index,
        questionTitle: currentQuestion.question,
        options: currentQuestion.options,
        selectedAnswer: optionIndex,
        correctAnswer: currentQuestion.correctOptionIndex,
        isCorrect: isCorrect,
        difficulty: difficulty || "Medium"
      };
      
      if (existing) {
        return prev.map(item => 
          item.questionNumber === currentQuestion.index ? newData : item
        );
      }
      return [...prev, newData];
    });
  };

  const handleSubmit = async () => {
    try {
      await submitTestData(questionNumber, questionTitle, testData);
      toast.success('Test submitted successfully!');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-neutral-500/30 bg-black p-4">
        <div className=" flex flex-col items-center justify-center gap-3 rounded-lg bg-neutral-500/20 p-4">
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
            alt="Logo"
            width={150}
            height={40}
            className="h-10 rounded-lg border mb-4 border-neutral-500/30"
          />

          <h1 className=" text-xl">Give Test for</h1>
          <h2 className="text-lg font-bold text-[#0340aa] text-center">
            {questionTitle || "User input and output"}
          </h2>

          {typeof questionNumber === "number" && (
            <p className="text-xs text-neutral-300">
              Question set #{questionNumber}
            </p>
          )}

          {!seeTest && (
            <>
              <div className="mt-2 w-full">
                <p className="mb-1 text-lg text-[#0340aa] font-semibold text-md">Test Details:</p>
                <ol className="list-decimal list-inside space-y-1 text-md text-neutral-100">
                  <li>. 10 comprehensive questions</li>
                  <li>. 10 minutes time limit</li>
                  <li>. Mixed question types (MCQ, Coding, Text)</li>
                  <li>. Instant AI-powered feedback</li>
                </ol>
              </div>

              <button
                onClick={() => setSeeTest(true)}
                className="mt-3 w-full rounded-lg border border-neutral-500/30 bg-[#0340aa] px-4 py-2 text-sm text-white hover:bg-[#0340aa]/90"
              >
                Start Test
              </button>
            </>
          )}
          {seeTest && (
            <div className="mt-2 w-full">
              <div className="w-full rounded-xl border border-neutral-500/30 p-3 text-white">
                <h3 className="mb-2 text-lg  font-bold">
                  {currentQuestion.index}. {currentQuestion.question}
                </h3>
                <div className="flex flex-col gap-1">
                  {currentQuestion.options?.map((opt: any, i: any) => {
                    const questionKey = `${currentQuestion.index}`;
                    const isSelected = selectedAnswers[questionKey] === i;
                    return (
                      <button
                        key={i}
                        className={`w-full rounded-md font-bold border px-3 py-2 text-left text-md hover:bg-neutral-700/70 ${
                          isSelected ? 'bg-blue-600 rounded-xl border-blue-500' : 'border-neutral-500/30 rounded-xl'
                        }`}
                        onClick={() => handleOptionClick(i)}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {currentIndex < q2Block.items.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full rounded-lg border border-neutral-500/30 bg-[#0340aa] px-4 py-2 text-sm text-white hover:bg-[#0340aa]/90"
                  >
                    Next Question
                  </button>
                                ) : (
                  <button 
                    onClick={handleSubmit}
                    className="w-full rounded-lg border border-neutral-500/30 bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-600/90"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}


interface DiscussionProps {
  questiontitle: string;
}

function Discussion({ questiontitle }: DiscussionProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success("Message sent!");
      setNewMessage("");
    } else {
      toast.error("Please enter a message");
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'>
      <div className='bg-gradient-to-br from-neutral-900 to-black w-[80vw] max-w-4xl h-[85vh] border border-neutral-600/50 rounded-2xl shadow-2xl relative overflow-hidden'>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0340aa]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className='text-center mb-6'>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-[#0340aa]/20 rounded-lg">
                <IoIosChatboxes className="text-[#0340aa] text-2xl" />
              </div>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                  {questiontitle || "Discussion Forum"}
                </h1>
                <p className="text-[#0340aa] text-lg font-medium">Connect with peers, share insights</p>
              </div>
            </div>
          </div>

          <div className='flex-1 border border-neutral-600/50 rounded-xl p-4 overflow-y-auto bg-neutral-800/30 backdrop-blur-sm mb-4'>
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-[#0340aa]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <IoIosChatboxes className="text-[#0340aa] text-2xl" />
                </div>
                <p className='text-neutral-400 text-lg mb-2'>Discussion Feature Coming Soon!</p>
                <p className='text-neutral-500 text-sm max-w-md mx-auto'>We're building an amazing discussion platform where you can connect with fellow coders, share solutions, and get help with doubts.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 max-w-sm mx-auto">
                <p className='text-blue-400 text-sm'>Expected launch: Next week! Stay tuned 🚀</p>
              </div>
            </div>
          </div>

          <div className='flex gap-3'>
            <div className="flex-1 relative">
              <textarea 
                value={newMessage}
                onChange={(e: any) => setNewMessage(e.target.value)}
                className='w-full h-12 bg-neutral-800/50 border border-neutral-600/50 focus:border-[#0340aa] focus:ring-2 focus:ring-[#0340aa]/20 rounded-xl px-4 py-3 text-white text-sm resize-none placeholder-gray-400 transition-all duration-200'
                placeholder="Share your thoughts or ask questions..."
                rows={2}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className='bg-gradient-to-r from-[#0340aa] to-blue-600 hover:from-[#0340aa]/90 hover:to-blue-600/90 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2'
            >
              <IoIosChatboxes className="text-lg" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function page() {
  const [sheetdata, setsheetdata] = useState(striverA2ZAllSteps);
  const [filteredSheetData, setFilteredSheetData] =
    useState(striverA2ZAllSteps);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<any>(null);
  const [notepadVisible, setNotepadVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    questionNumber: "",
    questionTitle: "",
    noteText: "",
  });
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [shwoplaylist, setshwoplaylist] = useState(false);
  const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showfeedback, setshowfeedback] = useState(false);
  const [showtest, setshowtest] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [showdissions, setshowdissions] = useState(false);
  const [showGFGCard, setShowGFGCard] = useState(true);
const [testQuestion, setTestQuestion] = useState<{
  number: string;
  title: string;
  difficulty: string;
} | null>(null);

  const params = useParams();

  const sheetname = params?.sheetname as string;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGFGCard(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function getsheetdata() {
      try {
        await trackUserVisit();
        toast.success("Welcome back!");

        const responce = await Getsheetdata();
        setResult(responce);

        const activityResponse = await getUserActivity();
        if (activityResponse?.success) {
          setUserActivityData(activityResponse.data);
        }

        const leaderboardResponse = await getLeaderboard();
if (leaderboardResponse?.success) {
  setLeaderboardData(leaderboardResponse.leaderboard); 
}

      } catch (error) {
        console.error("error aa gaya bhai", error);
        toast.error("Failed to load data");
      }
    }
    getsheetdata();
  }, []);

  async function handleAddToPlaylist(playlistId: string, questionNumber: string, difficulty: string) {
    try {
      await AddQuestionToPlaylist(
        playlistId,
        "striversheetdata",
        questionNumber,
        difficulty
      );
      toast.success("Question added to playlist successfully!");
    } catch (error) {
      toast.error("Failed to add question to playlist");
    }
  }

  async function handleCreatePlaylist(name: string, description: string, isPublic: boolean) {
    try {
      await CreatePlaylist(name, description, isPublic);
      toast.success("Playlist created successfully!");
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  }

  async function handelquestionsClick(
    questionsNumber: string,
    difficulty: string
  ) {
    try {
      const isSolved = result?.data?.sheet?.solvedquestions?.find(
        (id: any) => id === questionsNumber
      );
      if (!isSolved) {
        return toast.error("Please complete the test first!");
      }

      const response = await handelquestionClick(questionsNumber, difficulty);

      setResult((prevResult: any) => {
        if (!prevResult?.data?.sheet?.solvedquestions) return prevResult;
        const solvedQuestions = [...prevResult.data.sheet.solvedquestions];
        const questionIndex = solvedQuestions.indexOf(questionsNumber);
        if (questionIndex > -1) {
          solvedQuestions.splice(questionIndex, 1);
        } else {
          solvedQuestions.push(questionsNumber);
        }
        return {
          ...prevResult,
          data: {
            ...prevResult.data,
            sheet: {
              ...prevResult.data.sheet,
              solvedquestions: solvedQuestions,
            },
          },
        };
      });
    } catch (error) {
      toast.error("Cannot save question");
    }
  }

  async function handleNoteClick(questionNumber: string, questionTitle: string) {
    const existingNote = result?.data?.sheet?.notequestions?.find(
      (note: any) => note.Qnumber === questionNumber
    );
    setCurrentNote({
      questionNumber,
      questionTitle,
      noteText: existingNote?.noteText || "",
    });
    setNotepadVisible(true);
  }

  async function handleNoteSave(questionNumber: string, noteText: string) {
    try {
      await handelNotepadClick(questionNumber, noteText);

      setResult((prevResult: any) => {
        if (!prevResult?.data?.sheet?.notequestions) return prevResult;

        const notequestions = [...prevResult.data.sheet.notequestions];
        const existingNoteIndex = notequestions.findIndex(
          (note: any) => note.Qnumber === questionNumber
        );

        if (existingNoteIndex > -1) {
          notequestions[existingNoteIndex] = {
            ...notequestions[existingNoteIndex],
            noteText,
          };
        } else {
          notequestions.push({
            Qnumber: questionNumber,
            noteText,
            _id: Date.now().toString(),
          });
        }

        return {
          ...prevResult,
          data: {
            ...prevResult.data,
            sheet: {
              ...prevResult.data.sheet,
              notequestions: notequestions,
            },
          },
        };
      });

      toast.success("Note saved successfully!");
    } catch (error) {
      toast.error("Failed to save note");
    }
  }

  async function handleBookmarkClick(questionNumber: string) {
    try {
      await handelBookmarkClick(questionNumber);

      setResult((prevResult: any) => {
        if (!prevResult?.data?.sheet?.bookmarkedquestions) return prevResult;

        const bookmarkedQuestions = [
          ...prevResult.data.sheet.bookmarkedquestions,
        ];
        const questionIndex = bookmarkedQuestions.indexOf(questionNumber);

        if (questionIndex > -1) {
          bookmarkedQuestions.splice(questionIndex, 1);
          toast.success("Bookmark removed!");
        } else {
          bookmarkedQuestions.push(questionNumber);
          toast.success("Question bookmarked!");
        }

        return {
          ...prevResult,
          data: {
            ...prevResult.data,
            sheet: {
              ...prevResult.data.sheet,
              bookmarkedquestions: bookmarkedQuestions,
            },
          },
        };
      });
    } catch (error) {
      toast.error("Failed to toggle bookmark");
    }
  }

  function handleTimerClick(questionNumber: string) {
    if (activeTimer === questionNumber) {
      setActiveTimer(null);
      saveTimer(questionNumber, timerSeconds);
      toast.success(`Timer stopped! Time: ${formatTime(timerSeconds)}`);
    } else {
      setActiveTimer(questionNumber);
      setTimerSeconds(0);
      toast.success("Timer started!");
    }
  }

  async function saveTimer(questionNumber: string, seconds: number) {
    try {
      await handelTimerClick(questionNumber, seconds);
      toast.success("Timer saved successfully!");
    } catch (error) {
      toast.error("Failed to save timer");
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds((prev: any) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeTimer) {
        saveTimer(activeTimer, timerSeconds);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeTimer, timerSeconds]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }



  if (sheetname && sheetname !== "striver-a2z-dsa-course") {
    return (
      <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-white text-2xl text-center">
          Sheet data not available yet for {sheetname}
        </h1>
        <p className="text-gray-400">We will come back soon!</p>
        <button
          onClick={() =>
            (window.location.href = "/home/striver-a2z-dsa-course")
          }
          className="bg-[#0340aa] hover:bg-[#0340aa]/80 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Try Striver Sheet
        </button>
      </div>
    );
  }

  useEffect(() => {
    const sheetname = params?.sheetname as string;

    if (sheetname === "striver-a2z-dsa-course") {
      setsheetdata(striverA2ZAllSteps);
      setFilteredSheetData(striverA2ZAllSteps);
    }
  }, [params?.sheetname]);

  useEffect(() => {
    if (!sheetdata.length) return;

    const filtered = sheetdata
      .map((step: any) => ({
        ...step,
        sections: step.sections
          ?.map((section: any) => ({
            ...section,
            problems: section.problems?.filter((problem: any) => {
              const matchesSearch =
                problem.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                section.title.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesDifficulty =
                difficultyFilter === "all" ||
                problem.difficulty === difficultyFilter;
              const matchesCompany =
                companyFilter === "all" ||
                problem.companies?.includes(companyFilter);

              let matchesStatus = true;
              if (statusFilter === "solved") {
                matchesStatus =
                  result?.data?.sheet?.solvedquestions?.includes(
                    String(problem.id)
                  ) || false;
              } else if (statusFilter === "unsolved") {
                matchesStatus = !result?.data?.sheet?.solvedquestions?.includes(
                  String(problem.id)
                );
              }

              return (
                matchesSearch &&
                matchesDifficulty &&
                matchesStatus &&
                matchesCompany
              );
            }),
          }))
          .filter((section: any) => section.problems?.length > 0),
      }))
      .filter((step: any) => step.sections?.length > 0);

    setFilteredSheetData(filtered);
  }, [
    searchQuery,
    difficultyFilter,
    statusFilter,
    companyFilter,
    sheetdata,
    result,
  ]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part: any, index: any) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-blue-500/30 text-blue-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getResultsCount = () => {
    return filteredSheetData.reduce(
      (total: any, step: any) =>
        total +
        step.sections?.reduce(
          (sectionTotal: any, section: any) =>
            sectionTotal + (section.problems?.length || 0),
          0
        ),
      0
    );
  };

  const toggleStep = (stepId: number) => {
    setOpenSteps((prev: any) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const toggleSection = (stepId: number, sectionIndex: number) => {
    const key = `${stepId}-${sectionIndex}`;
    setOpenSections((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const easyCount = result?.data?.sheet?.EasyQ || 0;
  const mediumCount = result?.data?.sheet?.MedQ || 0;
  const hardCount = result?.data?.sheet?.HardQ || 0;

  const data = {
    labels: [
      `Easy (${easyCount})`,
      `Medium (${mediumCount})`,
      `Hard (${hardCount})`,
    ],
    datasets: [
      {
        data: [easyCount, mediumCount, hardCount],
        backgroundColor: ["#9dedba", "#f59e0b", "#ef4444"],
        borderColor: ["#16a34a", "#d97706", "#dc2626"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#ffffff",
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="min-h-screen max-w-screen bg-black overflow-x-hidden">
      <div className="flex flex-row">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>

        <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
          <header className="lg:h-18  sticky top-0   border-b bg-black flex-row justify-between border-neutral-500/30 flex items-center pl-6">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-neutral-500">Sheets</p>
              <MdArrowForwardIos />
              <p className="capitalize text-[##b8b4a9]">
                {params?.sheetname
                  ? decodeURIComponent(Array.isArray(params.sheetname) ? params.sheetname[0] : params.sheetname).replace(/-/g, " ")
                  : "Unknown"}{" "}
                sheet
              </p>
            </div>

            <div className="flex flex-row items-center gap-2 pr-2">
              {activeTimer && (
                <button
                  onClick={() => handleTimerClick(activeTimer)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 border border-1 border-neutral-500/50 font-bold rounded-xl"
                >
                  Stop Timer ({formatTime(timerSeconds)})
                </button>
              )}
               
            
              <button
                className="bg-[#0340aa]/80 items-center gap-3 flex flex-row hover:bg-[#0340aa] px-4 py-2 border border-1 border-[#0340aa] font-bold rounded-xl"
                onClick={() => setshowfeedback(!showfeedback)}
                title='Give your valuable feedback'
              >
               Give Feedback    <VscFeedback className='text-xl font-bold'/>
              </button>
              

            </div>
          </header>
          {showfeedback && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
              <Feedback />
            </div>
          )}

        {showtest && (
  <TestComponents
    questionNumber={testQuestion?.number || ''}
    questionTitle={testQuestion?.title || ''}
    difficulty={testQuestion?.difficulty || ''}
    onClose={() => setshowtest(false)}
  />
)}
{showdissions && (
  <Discussion questiontitle="General Discussion" />
)}


          {showGFGCard && (
            <div className="fixed top-20 right-4 z-50 animate-pulse">
              <GeeksforGeeksPOTD />
            </div>
          )}

          <div className="flex flex-row max-w-screen-xl mx-auto ">
            <div className="flex-1 p-7 lg:m-2 w-3/4 bg-black border border-1 border-neutral-500/20 rounded-lg flex flex-col gap-4 overflow-hidden">
              <h1 className="text-white text-3xl">
            Striver A2Z DSA Course{" "}
              </h1>

              <p className="text-neutral-500/80 ">
                This course is made for people who want to learn DSA from A to Z
                for free in a well-organized and structured manner. Complete
                collection of 455 problems across 18 steps
              </p>

              <NotepadModal
                isVisible={notepadVisible}
                questionNumber={currentNote.questionNumber}
                questionTitle={currentNote.questionTitle}
                existingNote={currentNote.noteText}
                onClose={() => setNotepadVisible(false)}
                onSave={handleNoteSave}
              />

              <div className=" bg-[#0340aa]/30 p-5 text-lg border border-1 border-[#0340aa] rounded-xl">
                <p>
                  <b>Complete Learning Platform:</b> Each problem includes
                  practice links, detailed articles, Add to playlist , Test , Dissusiona, video solutions, and
                  company tags. Start solving problems to track your progress
                  and master data structures and algorithms step by step.
                </p>
              </div>
              <h1 className="text-xl">Overview & Progress</h1>

              <div className="flex flex-row gap-2  border  border-neutral-500/20 rounded-lg w-full">
                <div className=" p-3 flex flex-row border-r border-neutral-500/30 w-1/2  ">
                  <div className="h-53">
                    <Pie data={data} options={options} />
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Easy:</span>
                      <span className="text-white">{easyCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-400">Medium:</span>
                      <span className="text-white">{mediumCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Hard:</span>
                      <span className="text-white">{hardCount}</span>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 p-2 rounded-lg">
                  <div className="w-full">
                    <input type="text" placeholder="Connect with Your Leetcode" className="w-full  px-3 py-1 mb-3 bg-black border border-neutral-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500/80 " title="Connect with your Leetcode" />
                   
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 px-4 pr-4 py-1 bg-black border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />

                </div>

                <select
                  value={difficultyFilter}
                  onChange={(e: any) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 bg-black border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-black border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="unsolved">Unsolved</option>
                </select>

                <select
                  value={companyFilter}
                  onChange={(e: any) => setCompanyFilter(e.target.value)}
                  className="px-3 py-2 bg-black border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Apple">Apple</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Uber">Uber</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Adobe">Adobe</option>
                  <option value="Salesforce">Salesforce</option>
                </select>

                <button className="bg-[#0340aa]/80 hover:bg-[#0340aa] px-4 py-1 border border-1 border-[#0340aa] rounded-xl">
                  Pick Randomly
                </button>
              </div>

              {(searchQuery ||
                difficultyFilter !== "all" ||
                statusFilter !== "all" ||
                companyFilter !== "all") && (
                <p className="text-gray-400 text-sm mb-4">
                  You Have  {getResultsCount()} Problems 
                </p>
              )}

              <div className="space-y-2">
                {filteredSheetData.map((step: any) => (
                  <div
                    key={step.id}
                    className="border border-neutral-500/20 rounded-lg"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50"
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex items-center gap-3">
                        {openSteps[step.id] ? (
                          <MdKeyboardArrowDown />
                        ) : (
                          <MdKeyboardArrowRight />
                        )}
                        <h3 className="text-white font-bold">
                          Step {step.id}: {step.title}
                        </h3>
                        <span className="text-neutral-400 text-sm">
                          {step.progress}
                        </span>
                      </div>
                    </div>

                    {openSteps[step.id] && (
                      <div className=" p-4">
                        {step.sections?.map((section: any, sectionIndex: any) => {
                          const sectionKey = `${step.id}-${sectionIndex}`;
                          return (
                            <div
                              key={sectionIndex}
                              className="mb-4 border border-neutral-600/30 rounded-lg"
                            >
                              <div
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-500/90 rounded-t-lg"
                                onClick={() =>
                                  toggleSection(step.id, sectionIndex)
                                }
                              >
                                {openSections[sectionKey] ? (
                                  <MdKeyboardArrowDown />
                                ) : (
                                  <MdKeyboardArrowRight />
                                )}
                                <h4 className="text-white font-semibold ">
                                  {section.title}
                                  
                                </h4>
                              </div>

                              {openSections[sectionKey] && (
                                <div className="border-t border-neutral-500/30 p-3">
                                  <div className="grid grid-cols-13 gap-2 text-neutral-400 text-sm font-medium mb-3 px-2">
                                    <div className="col-span-1 text-center">
                                      Status
                                    </div>
                                    <div className="col-span-2">Problem</div>
                                    <div className="col-span-1 text-center">
                                      Practice
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Solution
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Note
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Revision
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Playlist
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Timer
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Articles
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Chat
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Test
                                    </div>
                                    <div className="col-span-1 text-center">
                                      Difficulty
                                    </div>
                                  </div>
                                  {section.problems?.map((problem: any, index: any) => (
                                    <div
                                      key={problem.id}
                                      className="grid grid-cols-13 gap-2 items-center py-2 px-2 border-b border-neutral-500/20 last:border-b-0"
                                    >
                                      <div className="col-span-1 flex justify-center">
                                        {result?.data?.sheet?.solvedquestions?.find(
                                          (id: any) => id.questionNumber === String(problem.id)
                                        ) ? (
                                          <GrCheckboxSelected
                                            onClick={() =>
                                              handelquestionsClick(
                                                String(problem.id),
                                                problem.difficulty
                                              )
                                            }
                                            className="text-green-400 cursor-pointer"
                                          />
                                        ) : (
                                          <RiCheckboxBlankLine
                                            onClick={() =>
                                              handelquestionsClick(
                                                String(problem.id),
                                                problem.difficulty
                                              )
                                            }
                                            className="text-gray-400 cursor-pointer"
                                          />
                                        )}
                                      </div>
                                      <div className="col-span-2 text-white font-medium">
                                        {highlightText(
                                          problem.title,
                                          searchQuery
                                        )}
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <a
                                          href={problem.practice}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <SiLeetcode className="text-yellow-500 hover:text-yellow-500/60 text-xl cursor-pointer" />
                                        </a>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <a
                                          href={problem.video}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <BiLogoYoutube className="text-red-500 hover:text-[#0340aa]/80 text-2xl cursor-pointer" />
                                        </a>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <CiStickyNote
                                          className="text-neutral-500 cursor-pointer hover:text-[#0340aa]/80 text-xl"
                                          onClick={() =>
                                            handleNoteClick(
                                              String(problem.id),
                                              problem.title
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        {result?.data?.sheet?.bookmarkedquestions?.find(
                                          (id: any) => id === String(problem.id)
                                        ) ? (
                                          <BsStarFill
                                            onClick={() =>
                                              handleBookmarkClick(
                                                String(problem.id)
                                              )
                                            }
                                            className="text-yellow-500 cursor-pointer hover:text-yellow-400"
                                          />
                                        ) : (
                                          <HiOutlineStar
                                            onClick={() =>
                                              handleBookmarkClick(
                                                String(problem.id)
                                              )
                                            }
                                            className="text-yellow-500 cursor-pointer hover:text-yellow-400"
                                          />
                                        )}
                                      </div>
                                      <div className="col-span-1 flex justify-center items-center">
                                        <PlaylistComponent
                                          result={result}
                                          questionNumber={String(problem.id)}
                                          onCreatePlaylist={
                                            handleCreatePlaylist
                                          }
                                          onAddToPlaylist={handleAddToPlaylist}
                                          difficulty={problem.difficulty}
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-center flex-col items-center">
                                        <PiTimer
                                          className={`text-xl cursor-pointer ${
                                            activeTimer === String(problem.id)
                                              ? "text-red-500"
                                              : "text-white "
                                          }`}
                                          onClick={() =>
                                            handleTimerClick(String(problem.id))
                                          }
                                        />
                                        {(activeTimer === String(problem.id) ||
                                          result?.data?.sheet?.timers?.find(
                                            (t: any) =>
                                              t.Qnumber === String(problem.id)
                                          )) && (
                                          <span className="text-xs text-gray-400 mt-1">
                                            {activeTimer === String(problem.id)
                                              ? formatTime(timerSeconds)
                                              : formatTime(
                                                  result.data.sheet.timers.find(
                                                    (t: any) =>
                                                      t.Qnumber ===
                                                      String(problem.id)
                                                  ).time
                                                )}
                                          </span>
                                        )}
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <a
                                          href={problem.gfgArticle}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <GrArticle className="text-green-500 hover:text-[#0340aa]/80 text-xl cursor-pointer" />
                                        </a>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <IoIosChatboxes className=" text-xl cursor-pointer" onClick={() => setshowdissions(!showdissions)}/>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <MdQuiz
                                          className=" text-xl cursor-pointer"
                                          onClick={() => {
                                            setTestQuestion({
                                              number: String(problem.id),
                                              title: problem.title,
                                              difficulty: problem.difficulty,
                                            });
                                            setshowtest(!showtest);
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <span
                                          className={`text-xs px-2 py-1 rounded ${
                                            problem.difficulty === "Easy"
                                              ? "bg-neutral-500 text-green-400"
                                              : problem.difficulty === "Medium"
                                              ? "bg-yellow-500/20 text-yellow-400"
                                              : "bg-red-500/20 text-red-400"
                                          }`}
                                        >
                                          {problem.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:w-1/4 mr-2 sticky top-20 h-fit">
              <div className=" p-3  font-semibold lg:h-80 bg-black border border-1 border-neutral-500/20 rounded-lg ">
                <div className="flex flex-col text-lg">
                  <div className='flex items-center gap-2 mb-3'>
                      <FaFire className='text-xl  text-[#0340aa] font-bold text-'/>   
                  <h1 className=" text-xl text-white items-center">
             Visit Streak Calendar
                    <span className="text-neutral-500 mb-10"> {userActivityData?.length || 0}</span>
                  </h1>
                  </div>
                  <div className="flex flex-row justify-between mt-3">
                    <MdKeyboardArrowLeft /> Jan 2025
                    <MdKeyboardArrowRight />
                  </div>

                  <div className="flex flex-row justify-between mt-3">
                    <p>MU</p>
                    <p>TU</p>
                    <p>WE</p>
                    <p>TH</p>
                    <p>FR</p>
                    <p>SA</p>
                    <p>SU</p>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-3">
                    {Array.from({ length: 1 }, (_: any, i: any) => (
                      <div key={`empty-${i}`} className="h-8"></div>
                    ))}

                    {Array.from({ length: 31 }, (_: any, i: any) => {
                      const date = i + 1;
                      const isToday = date === new Date().getDate();
                      const activityForDate = userActivityData.find((activity: any) => {
                        const activityDate = new Date(activity.date);
                        return (
                          activityDate.getDate() === date &&
                          activityDate.getMonth() === new Date().getMonth() &&
                          activityDate.getFullYear() === new Date().getFullYear()
                        );
                      });
                      
                      const getActivityColor = (level: number) => {
                        switch(level) {
                          case 1: return "bg-green-200";
                          case 2: return "bg-green-400";
                          case 3: return "bg-green-600";
                          case 4: return "bg-green-800";
                          default: return "";
                        }
                      };
                      
                      return (
                        <div
                          key={date}
                          className={`h-8 flex items-center justify-center text-sm rounded cursor-pointer border rounded-full border-neutral-500/30 hover:bg-[#0340aa]/30 ${
                            isToday
                              ? "bg-[#0340aa] text-white font-bold"
                              : activityForDate
                              ? `${getActivityColor(activityForDate.level)} text-white font-bold`
                              : "text-neutral-300"
                          }`}
                          title={activityForDate ? `${activityForDate.count} visits on ${activityForDate.date}` : `No activity on ${date}`}
                        >
                          {activityForDate ? (
                            <IoCodeSlash className="text-green-400" />
                          ) : (
                            date
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className="p-3 mt-2 mr-1 font-semibold bg-black border border-1 border-neutral-500/20 rounded-lg overflow-y-auto max-h-96"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex flex-row justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-white text-lg">
                    <GiPodiumWinner className='text-[#0340aa] font-bold text-xl'/>
                    <span>Leaderboard</span>
                  </div>
                  <CiCircleInfo className="text-neutral-400 cursor-pointer hover:text-white" />
                </div>

                <div className="space-y-2">
                  {leaderboardData.length > 0 ? leaderboardData.map((user: any) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-2 bg-neutral-800/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 ${
                            user.rank === 1 ? 'bg-yellow-500' :
                            user.rank === 2 ? 'bg-gray-400' :
                            user.rank === 3 ? 'bg-orange-600' :
                            'bg-neutral-600'
                          } rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {user.rank}
                        </div>
                        <span className="text-white text-sm">{user.name}</span>
                      </div>
                      <span className="text-[#0340aa] font-semibold text-sm">
                        {user.points}
                      </span>
                    </div>
                  )) : [
                    {
                      name: "Arjun Sharma",
                      points: 1250,
                      rank: 1,
                    },
                    {
                      name: "Priya Patel",
                      points: 1180,
                      rank: 2,
                    },
                    {
                      name: "Rohit Kumar",
                      points: 1050,
                      rank: 3,
                    },
                  ].map((user: any) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-2 bg-neutral-800/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 ${
                            user.rank === 1 ? 'bg-yellow-500' :
                            user.rank === 2 ? 'bg-gray-400' :
                            user.rank === 3 ? 'bg-orange-600' :
                            'bg-neutral-600'
                          } rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {user.rank}
                        </div>
                        <span className="text-white text-sm">{user.name}</span>
                      </div>
                      <span className="text-[#0340aa] font-semibold text-sm">
                        {user.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-3 m-2 font-semibold bg-black border border-1 border-neutral-500/20 rounded-lg "
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <Image
                  src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/promotion.png?updatedAt=1767107547225"
                  width={300}
                  height={200}
                  alt="promotion"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
