"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import {
  MdArrowForwardIos,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { GrCheckboxSelected } from "react-icons/gr";
import { SiLeetcode } from "react-icons/si";
import { BiLogoYoutube, BiTargetLock } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { GrArticle } from "react-icons/gr";
import { IoIosChatboxes } from "react-icons/io";
import { MdQuiz } from "react-icons/md";
import { progressTrackerService } from "../services/weeklytestdata";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IoCodeSlash } from "react-icons/io5";
import { CiStickyNote } from "react-icons/ci";
import { HiOutlineStar } from "react-icons/hi";
import { PiTimer } from "react-icons/pi";
import { FaPlusCircle } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { dsaProblemsData } from "../../../shared/data/problems";
import { CreatePlaylist , Getsheetdata , AddQuestionToPlaylist} from '../../home/services/getsheetdata';



function PlaylistComponent({ result, questionNumber, onCreatePlaylist, onAddToPlaylist, difficulty }: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const handleCreateClick = () => {
    setShowForm(true);
    setShowDropdown(false);
  };
  
  
  const handleSavePlaylist = () => {
    onCreatePlaylist(playlistName, description, isPublic);
    setShowForm(false);
    setPlaylistName('');
    setDescription('');
    setIsPublic(false);
  };
  
  const handlePlaylistClick = (playlist: any) => {
    onAddToPlaylist(playlist.playlistId, questionNumber, difficulty);
    setShowDropdown(false);
  };
  
  return (
    <div className='relative'>
      <span 
        className="text-white cursor-pointer hover:text-[#0340aa]/80 border flex justify-center items-center w-6 h-6 rounded-full border-white text-xl"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        +
      </span>
      
      {showDropdown && !showForm && (
        <div className='absolute top-8 left-0 z-50 bg-black border border-neutral-500/30 rounded-lg p-2 w-80'>
          <div 
            className='w-full h-8 border border-neutral-500/30 rounded-lg flex items-center px-2 cursor-pointer hover:bg-neutral-800/50 mb-1'
            onClick={handleCreateClick}
          >
            <FaPlusCircle className='mr-2 text-[#0340aa] text-sm'/>
            <span className='text-xs text-white'>Create Playlist</span>
          </div>
          
          <div className='max-h-32 overflow-y-auto scrollbar-none'>
            {result?.data?.playlists?.map((playlist: any, index: any) => (
              <div 
                key={index} 
                className='w-full h-6 border border-neutral-500/30 rounded-lg flex items-center px-2 cursor-pointer hover:bg-neutral-800/50 mb-1'
                onClick={() => handlePlaylistClick(playlist)}
              >
                <span className='text-xs text-white truncate'>{playlist.playlistName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showForm && (
        <div className='absolute top-8 left-0 z-50 bg-black border border-neutral-500/30 rounded-lg p-2 w-80'>
          <div className='flex justify-between items-center mb-2'>
            <div className='flex items-center gap-2'>
            <span className='text-white text-sm'>Create Playlist</span>
            <MdFeaturedPlayList/>
            </div>
            <button onClick={() => setShowForm(false)} className='text-white hover:text-red-400'><RxCross2 size={14}/></button>
          </div>
          
          <input 
            value={playlistName}
            onChange={(e: any) => setPlaylistName(e.target.value)}
            className='w-full mb-2 p-1 text-xs bg-neutral-900 border border-neutral-600 rounded text-white' 
            placeholder='Playlist Name'
          />
          
          <input 
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            className='w-full mb-2 p-2 text-xs bg-neutral-900 border border-neutral-600 rounded text-white' 
            placeholder='Description'
          />
          
          <select 
            value={isPublic ? 'true' : 'false'}
            onChange={(e: any) => setIsPublic(e.target.value === 'true')}
            className='w-full mb-2 p-2 text-xs bg-black border border-neutral-600 rounded text-white'
          >
            <option value='false' className='text-white'>Private</option>
            <option value='true' className='text-white'>Public</option>
          </select>
          
          <button onClick={handleSavePlaylist} className='w-full bg-[#0340aa] hover:bg-[#0340aa]/90 p-1 text-lg  rounded-xl text-white'>Create</button>
        </div>
      )}
    </div>
  )
}





























ChartJS.register(ArcElement, Tooltip, Legend);

function sheetDisplaycomponents({fetchdata , operationtype}: any) {
  const [sheetdata, setsheetdata] = useState<any[]>([]);
  const [openSteps, setOpenSteps] = useState<any>({});
  const [openSections, setOpenSections] = useState({ '1-0': true });
  const [result, setResult] = useState(fetchdata);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTimer, setActiveTimer] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const params = useParams();
  const sheetname = params?.sheetname as string;

  useEffect(() => {
    if (fetchdata?.data?.testQuestions) {
      const testQuestions = fetchdata.data.testQuestions;
      const mockSheet = [{
        id: 1,
        title: fetchdata.data.WeeklytestName || fetchdata.data.SpaceRepetitionName || "Test",
        sections: [{
          title: "Test Questions",
          problems: testQuestions.map((qId: any) => {
            const problemData = dsaProblemsData.find((p: any) => p && p.id === parseInt(qId));
            return {
              id: qId,
              title: problemData?.title || `Problem ${qId}`,
              difficulty: problemData?.difficulty || "Medium",
              practice: problemData?.link || `https://leetcode.com/problems/problem-${qId}`,
              video: problemData?.video || `https://youtube.com/watch?v=video-${qId}`,
              gfgArticle: problemData?.gfgArticle || `https://geeksforgeeks.org/article-${qId}`
            };
          })
        }]
      }];
      setsheetdata(mockSheet);
      setOpenSections({ '1-0': true });
    }
    setIsClient(true);
  }, [fetchdata]);

  useEffect(() => {
    async function getsheetdata() {
      try {
        const responce = await Getsheetdata();
        setResult(responce);
        setUserActivityData([]);
      } catch (error) {
        console.error("error aa gaya bhai", error);
      }
    }
    getsheetdata(); 
  }, []);

  async function handleQuestionsClick(questionsNumber: string, difficulty: string) {
    try {
      const testName = fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName;
   const savquestion =    await progressTrackerService.addQuestion(operationtype, testName, questionsNumber, difficulty);
   if(savquestion.success){
    alert("save ho gaya")
   }
      const updatedData = { ...fetchdata };
      if (!updatedData.data.solvedquestions.includes(questionsNumber)) {
        updatedData.data.solvedquestions.push(questionsNumber);
      }
      setResult(updatedData);
    } catch (error) {
      alert("Cannot save question");
    }
  }

  const handleNoteClick = async (questionNumber: string, questionTitle: string) => {
    const existingNote = fetchdata?.data?.notequestions?.find((note: any) => note.Qnumber === questionNumber);
    setCurrentQuestion({ id: questionNumber, title: questionTitle });
    setNoteText(existingNote?.noteText || '');
    setShowNoteModal(true);
  };

  const saveNote = async () => {
    if (noteText.trim()) {
      try {
        const testName = fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName;
        await progressTrackerService.addNote(operationtype, testName, currentQuestion.id, noteText);
        setShowNoteModal(false);
        setNoteText('');
        setCurrentQuestion(null);
      } catch (error) {
        alert("Cannot save note");
      }
    }
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNoteText('');
    setCurrentQuestion(null);
  };

  const handleCreatePlaylist = async (name: string, description: string, isPublic: boolean) => {
    try {
      const response = await CreatePlaylist(name, description, isPublic);
      if (response.success) {
        alert('Playlist created successfully!');
        const updatedData = await Getsheetdata();
        setResult(updatedData);
      } else {
        alert('Failed to create playlist: ' + response.message);
      }
    } catch (error) {
      alert('Failed to create playlist');
    }
  };

  const handleAddToPlaylist = async (playlistId: string, questionNumber: string, difficulty: string) => {
    try {
      const testName = fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName || 'test';
      const response = await AddQuestionToPlaylist(playlistId, testName, questionNumber, difficulty);
      if (response.success) {
        alert('Question added to playlist successfully!');
      } else {
        alert('Failed to add question to playlist: ' + response.message);
      }
    } catch (error) {
      alert('Failed to add question to playlist');
    }
  };

  const handleBookmarkClick = async (questionNumber: string) => {
    try {
      const testName = fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName;
      await progressTrackerService.addBookmark(operationtype, testName, questionNumber);
      const updatedData = { ...fetchdata };
      if (!updatedData.data.bookmarkedquestions.includes(questionNumber)) {
        updatedData.data.bookmarkedquestions.push(questionNumber);
      }
      setResult(updatedData);
    } catch (error) {
      alert("Cannot save bookmark");
    }
  };

  const handleTimerClick = (questionNumber: string) => {
    if (activeTimer === questionNumber) {
      setActiveTimer(null);
      saveTimer(questionNumber, timerSeconds);
      setTimerSeconds(0);
    } else {
      setActiveTimer(questionNumber);
      setTimerSeconds(0);
    }
  };

  const saveTimer = async (questionNumber: string, time: number) => {
    try {
      const testName = fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName;
      await progressTrackerService.addTimer(operationtype, testName, questionNumber, time);
    } catch (error) {
      alert("Cannot save timer");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (sheetname && sheetname !== "striver-a2z-dsa-course") {
    return (
      <div className="bg-black w-full  flex flex-col items-center justify-center gap-4">
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

  const easyCount = fetchdata?.data?.EasyQ || 0;
  const mediumCount = fetchdata?.data?.MedQ || 0;
  const hardCount = fetchdata?.data?.HardQ || 0;

  const data = {
    labels: [`Easy (${easyCount})`, `Medium (${mediumCount})`, `Hard (${hardCount})`],
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
    <div className="h-full w-full bg-black overflow-y-auto">
      <div className="flex flex-row">
        <div className="flex flex-col bg-black w-full">
          <header className="lg:h-18 border-b bg-black flex-row justify-between border-neutral-500/30 flex items-center pl-2 sticky top-0 z-10">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-neutral-500">{operationtype === 'weeklytest' ? 'Weekly Test' : 'Space Repetition'}</p>

              <p className="capitalize">
                {fetchdata?.data?.WeeklytestName || fetchdata?.data?.SpaceRepetitionName || 'Test'}
              </p>
            </div>

            <div className="flex flex-row items-center gap-2 pr-2">
              <button className="bg-[#0340aa]/80 hover:bg-[#0340aa] px-4 py-2 border border-1 border-neutral-500/50 font-bold rounded-xl">
                Give Feedback
              </button>
            </div>
          </header>

          <div className="flex flex-row">
            <div className="flex-1 p-2 lg:m-2 w-full bg-black rounded-lg flex flex-col gap-4">
              <h1 className="text-xl">Overview & Progress</h1>

              <div className="space-y-2">
                {sheetdata.map((step: any) => (
                  <div className="p-4" key={step.id}>
                    {step.sections?.map((section: any, sectionIndex: any) => {
                      const sectionKey = `${step.id}-${sectionIndex}`;
                      return (
                        <div
                          key={sectionIndex}
                          className="mb-4 border border-neutral-600/30 rounded-lg"
                        >
                          <div
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-700/30 rounded-t-lg"
                            onClick={() => toggleSection(step.id, sectionIndex)}
                          >
                            {(openSections as any)[sectionKey] ? (
                              <MdKeyboardArrowDown />
                            ) : (
                              <MdKeyboardArrowRight />
                            )}
                            <h4 className="text-white font-bold text-lg">
                              {section.title}
                            </h4>
                          </div>

                          {(openSections as any)[sectionKey] && (
                            <div className="border-t border-neutral-600/30 p-3">
                              <div className="grid grid-cols-13 gap-2 text-neutral-400 text-sm font-medium mb-3 px-2">
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-2">Problem</div>
                                <div className="col-span-1 text-center">Practice</div>
                                <div className="col-span-1 text-center">Solution</div>
                                <div className="col-span-1 text-center">Note</div>
                                <div className="col-span-1 text-center">Revision</div>
                                <div className="col-span-1 text-center">Playlist</div>
                                <div className="col-span-1 text-center">Timer</div>
                                <div className="col-span-1 text-center">Articles</div>
                                <div className="col-span-1 text-center">Chat</div>
                                <div className="col-span-2 text-center">Difficulty</div>
                              </div>
                              {section.problems?.map((problem: any, index: any) => (
                                <div
                                  key={problem.id}
                                  className="grid grid-cols-13 gap-2 items-center py-2 px-2 border-b border-neutral-500/20 last:border-b-0"
                                >
                                  <div className="col-span-1 flex justify-center">
                                    {fetchdata?.data?.solvedquestions?.find((id: any) => id === String(problem.id)) ? (
                                      <GrCheckboxSelected 
                                        onClick={() => handleQuestionsClick(String(problem.id), problem.difficulty )}  
                                        className="text-green-400 cursor-pointer" 
                                      />
                                    ) : (
                                      <RiCheckboxBlankLine 
                                        onClick={() => handleQuestionsClick(String(problem.id), problem.difficulty) } 
                                        className="text-gray-400 cursor-pointer" 
                                      />
                                    )}
                                  </div>
                                  <div className="col-span-2 text-white font-medium">
                                    {problem.title}
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <a href={problem.practice} target="_blank" rel="noopener noreferrer">
                                      <SiLeetcode className="text-yellow-500  text-xl cursor-pointer" />
                                    </a>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <a href={problem.video} target="_blank" rel="noopener noreferrer">
                                      <BiLogoYoutube className="text-red-500 hover:text-[#0340aa]/80 text-2xl cursor-pointer" />
                                    </a>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <CiStickyNote className="text-neutral-500 cursor-pointer hover:text-[#0340aa]/80 text-xl" onClick={() => handleNoteClick(String(problem.id), problem.title)}/>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    {fetchdata?.data?.bookmarkedquestions?.find((id: any) => id === String(problem.id)) ? (
                                      <BsStarFill 
                                        onClick={() => handleBookmarkClick(String(problem.id))}  
                                        className="text-yellow-500 cursor-pointer hover:text-yellow-400" 
                                      />
                                    ) : (
                                      <HiOutlineStar 
                                        onClick={() => handleBookmarkClick(String(problem.id))} 
                                        className="text-yellow-500 cursor-pointer hover:text-yellow-400" 
                                      />
                                    )}
                                  </div>
                                  <div className="col-span-1 flex justify-center items-center">
                                    <PlaylistComponent 
                                      result={result} 
                                      questionNumber={String(problem.id)} 
                                      onCreatePlaylist={handleCreatePlaylist}
                                      onAddToPlaylist={handleAddToPlaylist}
                                      difficulty={problem.difficulty}
                                    />
                                  </div>
                                  <div className="col-span-1 flex justify-center flex-col items-center">
                                    <PiTimer 
                                      className={`text-xl cursor-pointer ${
                                        activeTimer === String(problem.id) 
                                          ? 'text-red-500' 
                                          : 'text-orange-500 hover:text-[#0340aa]/80'
                                      }`}
                                      onClick={() => handleTimerClick(String(problem.id))}
                                    />
                                    {(activeTimer === String(problem.id) || fetchdata?.data?.timers?.find((t: any) => t.Qnumber === String(problem.id))) && (
                                      <span className="text-xs text-gray-400 mt-1">
                                        {activeTimer === String(problem.id) 
                                          ? formatTime(timerSeconds)
                                          : formatTime(fetchdata.data.timers.find((t: any) => t.Qnumber === String(problem.id))?.time || 0)
                                        }
                                      </span>
                                    )}
                                {}
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <a href={problem.gfgArticle} target="_blank" rel="noopener noreferrer">
                                      <GrArticle className="text-green-500 hover:text-[#0340aa]/80 text-xl cursor-pointer" />
                                    </a>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <IoIosChatboxes className="text-[#0340aa]/40 hover:text-[#0340aa]/80 text-xl cursor-pointer" />
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        problem.difficulty === "Easy"
                                          ? "bg-green-500/20 text-green-400"
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNoteModal && (
        <div className='fixed inset-0 z-50 bg-black/50 flex justify-center items-center'>
          <div className='bg-black border border-neutral-500/30 rounded-lg max-w-md w-full mx-4'>
            <div className='flex justify-between items-center p-4 border-b border-neutral-500/30'>
              <h3 className='text-white text-lg font-semibold'>
                Add note for {currentQuestion?.title}
              </h3>
              <button 
                onClick={() => setShowNoteModal(false)}
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
                  onClick={() => setShowNoteModal(false)}
                  className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className='px-4 py-2 bg-[#0340aa] hover:bg-[#0340aa]/80 text-white rounded-lg transition-colors'
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default sheetDisplaycomponents;