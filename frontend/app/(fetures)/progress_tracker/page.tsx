"use client"
import React, { useState, useEffect } from 'react'
import Sidebar from '../../shared/components/Sidebar'
import { MdArrowForwardIos } from "react-icons/md"
import Card from './components/Card'
import { IoStatsChartOutline, IoInformationCircleOutline } from "react-icons/io5";
import SheetDisplaycomponents from "./components/SheetDisplaycomponents"
import { progressTrackerService ,  getWeekAreaData} from "./services/weeklytestdata"
import { getUserNotesAndBookmarks, getAllPlaylists, getPlaylistById } from "../home/services/getsheetdata"
import { striverA2ZAllSteps } from '../../shared/data/striverA2ZAllSteps';
import { SiLeetcode } from "react-icons/si";
import { toast } from 'react-hot-toast';

function page() {
  const [processtype, setprocesstype] = useState("weeklytest")
  const [weeklytestdata, setweeklytestdata] = useState<any>(null)
  const [spacerepetitiondata, setspacerepetitiondata] = useState<any>(null)
  const [showsheetwt, setshowsheetwt] = useState(false)
  const [showsheetsr, setshowsheetsr] = useState(false)
  const [userNotesData, setUserNotesData] = useState<any>(null)
  const [userBookmarksData, setUserBookmarksData] = useState<any>(null)
  const [userPlaylists, setUserPlaylists] = useState<any[]>([])
  const [weekares, setweekares] = useState<any>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        let weeklyData = null;
        let spaceRepetitionData = null;
        let userNotesBookmarks = null;
        let playlistsData = null;
        let Weekares = null;

        try {
          weeklyData = await progressTrackerService.getLatest('weeklytest');
        } catch (error: any) {
          console.log('Weekly test data not available:', error.message);
        }

        try {
          spaceRepetitionData = await progressTrackerService.getLatest('spacerepetition');
        } catch (error: any) {
          console.log('Space repetition data not available:', error.message);
        }

        try {
          userNotesBookmarks = await getUserNotesAndBookmarks();
        } catch (error: any) {
          console.log('User notes and bookmarks not available:', error.message);
        }

        try {
          playlistsData = await getAllPlaylists();
        } catch (error: any) {
          console.log('Playlists data not available:', error.message);
        }

        try {
          Weekares = await getWeekAreaData();
        } catch (error: any) {
          console.log('Week areas data not available:', error.message);
        }

        setweekares(Weekares);
        setweeklytestdata(weeklyData);
        setspacerepetitiondata(spaceRepetitionData);
        
        if (userNotesBookmarks?.success) {
          console.log('User notes and bookmarks data:', userNotesBookmarks);
          
          const notesData = {
            data: {
              WeeklytestName: "Your Notes",
              testQuestions: userNotesBookmarks.notequestions.map((note: any) => note.Qnumber),
              notequestions: userNotesBookmarks.notequestions,
              solvedquestions: userNotesBookmarks.solvedquestions,
              bookmarkedquestions: userNotesBookmarks.bookmarkedquestions,
              timers: userNotesBookmarks.timers
            }
          };
          
          const bookmarksData = {
            data: {
              WeeklytestName: "Your Bookmarks",
              testQuestions: userNotesBookmarks.bookmarkedquestions,
              notequestions: userNotesBookmarks.notequestions,
              solvedquestions: userNotesBookmarks.solvedquestions,
              bookmarkedquestions: userNotesBookmarks.bookmarkedquestions,
              timers: userNotesBookmarks.timers
            }
          };
          
          
          setUserNotesData(notesData);
          setUserBookmarksData(bookmarksData);
        } else {
          console.log('Failed to fetch user notes and bookmarks:', userNotesBookmarks);
        }
        
        if (playlistsData.success) {
          setUserPlaylists(playlistsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load progress data!');
      }
    };
    fetchData();
  }, []);


  const columns = [
  { Header: 'Question No.', accessor: 'questionNumber' },
  { Header: 'Difficulty', accessor: 'difficulty' },
  { Header: 'Topic', accessor: 'topic' },
  { Header: 'LeetCode Link', accessor: 'leetcodeLink' }
];


  return (
    <div className='min-h-screen w-full bg-black overflow-x-hidden'>
      <div className='flex flex-col lg:flex-row w-full'>
        <div className=' lg:block lg:sticky lg:top-0 lg:h-screen'>
          <Sidebar/>
        </div>

        <div className='flex-1 w-full lg:ml-0'> 
          <header className='sticky top-0 z-30 bg-black border-b border-neutral-500/30 px-4 lg:px-6 py-4'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0'>
              <div className='flex items-center gap-2'>
                <p className='text-neutral-500'>Dashboard</p> 
                <MdArrowForwardIos className='text-sm'/> 
                <p className='text-white'>Progress Tracker</p>
              </div>

              <div className='flex flex-row items-center gap-2 px-4 py-2 border border-neutral-500/30 rounded-2xl bg-[#0340aa] hover:bg-[#0340aa]/80 transition-colors cursor-pointer w-full lg:w-auto justify-center'>
                <button className='text-md font-semibold text-white' onClick={()=> toast.success("Solve more question to see data ")}>Visualise Your Progress</button>
                <IoStatsChartOutline className='text-white text-md'/>
              </div>
            </div>
          </header>

          <div className='p-4 lg:p-6 relative min-h-screen'>
            {(showsheetwt || showsheetsr) ? (
              <>
                {showsheetwt && (
                  <div className='absolute top-0 left-0 right-0 bottom-0 z-50 bg-black overflow-y-auto p-6'>
                    <div className='h-full'>
                      <SheetDisplaycomponents fetchdata={weeklytestdata} operationtype={'weeklytest'} />
                    </div>
                  </div>
                )}

                {showsheetsr && (
                  <div className='absolute top-0 left-0 right-0 bottom-0 z-50 bg-black overflow-y-auto p-6'>
                    <div className='h-full'>
                      <SheetDisplaycomponents fetchdata={spacerepetitiondata} operationtype={'spacerepetition'} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
            <section className='mb-12'>
              <h1 className='text-3xl font-bold text-white mb-6'>Weekly Tests</h1>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card date="30 Jan 2026" numberOfQuestions={15} onClick={() => setshowsheetwt(true)}/>
              </div>
            </section>

            <section className='mb-12'>
              <div className='flex items-center gap-2 mb-6'>
                <h1 className='text-3xl font-bold text-white'>Space Repetition</h1>
                <IoInformationCircleOutline className='text-blue-400 text-2xl cursor-pointer hover:text-blue-300 transition-colors' title='Spaced repetition helps you review problems at optimal intervals for better retention'/>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card date="30 Jan 2026" numberOfQuestions={15} onClick={() => setshowsheetsr(true)}/>
              </div>
            </section>



<section className='mb-12'>
  <div className='flex items-center justify-between mb-8'>
    <div className='flex items-center gap-3'>
      <div className='p-2 bg-[#0340aa]/20 rounded-lg'>
      </div>
      <div>
        <h1 className='text-3xl font-bold text-white'>Weak Areas</h1>
        <p className='text-neutral-400 text-sm mt-1'>Topics that need more practice</p>
      </div>
    </div>
    <div className='flex items-center gap-2 px-4 py-2 bg-black rounded-lg border border-neutral-500/20'>
      <span className='text-md text-neutral-400'>Total:</span>
      <span className='text-md font-bold text-[#0340aa]'>{weekares?.data?.length || 0}</span>
    </div>
  </div>

  <div className="overflow-x-auto border border-neutral-500/20">
    <table className="min-w-full">
      <thead className="bg-neutral-800">
        <tr>
          {columns.map((col: any, index: any) => (
            <th 
              key={col.accessor} 
              className="px-6 py-3 text-left test-md font-medium text-neutral-300 uppercase tracking-wider border-r border-neutral-500/20 last:border-r-0"
            >
              <div className='flex items-center gap-2'>
                {col.Header}
                {index === 0 && <span className='text-[#0340aa]'></span>}
                {index === 1 && <span className='text-[#0340aa]'></span>}
                {index === 2 && <span className='text-[#0340aa]'></span>}
                {index === 3 &&  <span className='text-[#0340aa]'></span>}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody className="bg-black">
        {weekares?.data && weekares.data.length > 0 ? (
          weekares.data.map((row: any, index: any) => (
            <tr key={row.questionNumber || index} className="border-b border-neutral-500/20 hover:bg-neutral-900/50 transition-colors">
              <td className="px-6 py-4 border-r border-neutral-500/20">
                <div className='flex items-center gap-3'>
                  <span className="text-sm font-medium text-white">
                    {row.questionNumber}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 border-r border-neutral-500/20">
                <span className={`px-2 py-1 rounded test-md font-medium ${
                  row.difficulty === 'Easy' 
                    ? 'bg-green-500/20 text-green-300' :
                  row.difficulty === 'Medium' 
                    ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                }`}>
                  {row.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 border-r border-neutral-500/20">
                <span className="text-sm text-neutral-200">
                  {row.topic}
                </span>
              </td>
              <td className="px-6 py-4">
                {row.practice ? (
                  <a 
                    href={row.practice}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#0340aa] hover:text-[#0340aa]/80 transition-colors"
                  >
                    <SiLeetcode className='text-lg text-yellow-500' />
                    Practice
                  </a>
                ) : (
                  <span className="text-neutral-500 text-sm">No link</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-6 py-16 text-center">
              <div className='flex flex-col items-center gap-4'>
                <div className='w-16 h-16 bg-[#0340aa]/20 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>🎉</span>
                </div>
                <div>
                  <p className='text-lg font-semibold text-neutral-300 mb-2'>Great job! No weak areas found</p>
                  <p className='text-sm text-neutral-500'>Keep solving more questions to maintain your progress</p>
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>



                <section className='mb-12'>
                  <div className='flex items-center justify-between gap-2 mb-6'>
                                      <h1 className='text-3xl font-bold text-white mb-6'>Other Platform Contests</h1>
                                      <select 
                                        className='bg-black px-5 py-2 border border-neutral-500/30 rounded-xl text-white'
                                        value={selectedPlatform}
                                        onChange={(e: any) => setSelectedPlatform(e.target.value)}
                                      >
                                        <option value="all">All Platforms</option>
                                        <option value="codeforces">CodeForces</option>
                                        <option value="codechef">Codechef</option>
                                        <option value="leetcode">Leetcode</option>
                                      </select>

                    </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[
                      { date: "30 Jan 2026", numberOfQuestions: 15, platform: "leetcode", platformUrl: "https://leetcode.com/contest/weekly-contest-425" },
                      { date: "06 Feb 2026", numberOfQuestions: 20, platform: "codeforces", platformUrl: "https://codeforces.com/contest/2051" },
                      { date: "13 Feb 2026", numberOfQuestions: 25, platform: "codechef", platformUrl: "https://www.codechef.com/contests/START168" }
                    ]
                    .filter((contest: any) => selectedPlatform === 'all' || contest.platform === selectedPlatform)
                    .map((contest: any, index: any) => (
                      <Card 
                        key={index}
                        date={contest.date}
                        numberOfQuestions={contest.numberOfQuestions}
                        platform={contest.platform}
                        platformUrl={contest.platformUrl}
                      />
                    ))}
                  </div>
                </section>

                <section className='mb-12'>
                  <h1 className='text-3xl font-bold text-white mb-6'>Notes</h1>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card 
                      date="Your Notes" 
                      numberOfQuestions={userNotesData?.data?.testQuestions?.length || 0} 
                      onClick={() => {
                        if (userNotesData?.data?.testQuestions?.length > 0) {
                          setweeklytestdata(userNotesData);
                          setshowsheetwt(true);
                          toast.success('Notes loaded successfully!');
                        } else {
                          toast.error('No notes found!');
                        }
                      }}
                    />
                  </div>
                </section>

                <section className='mb-12'>
                  <h1 className='text-3xl font-bold text-white mb-6'>BookMarks</h1>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card 
                      date="Your Bookmarks" 
                      numberOfQuestions={userBookmarksData?.data?.testQuestions?.length || 0}
                      onClick={() => {
                        console.log('Bookmarks card clicked, data:', userBookmarksData);
                        if (userBookmarksData?.data?.testQuestions?.length > 0) {
                          setweeklytestdata(userBookmarksData);
                          setshowsheetwt(true);
                          toast.success('Bookmarks loaded successfully!');
                        } else {
                          toast.error('No bookmarks found!');
                        }
                      }}
                    />
                  </div>
                </section>

                <section className='mb-12'>
                  <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-3xl font-bold text-white'>Playlist</h1>
                    <button className='flex items-center gap-2 px-4 py-2 bg-[#0340aa] hover:bg-[#0340aa]/80 text-white font-semibold rounded-xl border border-neutral-500/30 transition-colors cursor-pointer'>
                      <span className='text-xl'>+</span>
                      Add New Playlist
                    </button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {userPlaylists.map((playlist: any, index: any) => {
                      const createdDate = new Date(playlist.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                      
                      return (
                        <Card 
                          key={playlist.playlistId}
                          date={createdDate}
                          numberOfQuestions={playlist.questions?.length || 0}
                          type="playlist" 
                          playlistName={playlist.playlistName}
                          onClick={async () => {
                            try {
                              const playlistData = await getPlaylistById(playlist.playlistId);
                              if (playlistData.success) {
                                const formattedData = {
                                  data: {
                                    WeeklytestName: playlist.playlistName,
                                    testQuestions: playlistData.data.questions.map((q: any) => q.questionNumber),
                                    solvedquestions: [],
                                    notequestions: [],
                                    bookmarkedquestions: [],
                                    timers: []
                                  }
                                };
                                setweeklytestdata(formattedData);
                                setshowsheetwt(true);
                                toast.success(`Playlist "${playlist.playlistName}" loaded successfully!`);
                              } else {
                                toast.error('Failed to load playlist!');
                              }
                            } catch (error) {
                              console.error('Error opening playlist:', error);
                              toast.error('Error loading playlist!');
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
