"use client";
import React, { useState, useEffect } from 'react'
import {motion} from 'motion/react'
import Image from 'next/image'
import { IoMdArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaUsers, FaBookOpen, FaHeart, FaLinkedin, FaCheckCircle, FaTwitter, FaGithub, FaMedium, FaYoutube } from "react-icons/fa";
import { FaCode, FaTrophy } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { MdModeComment } from "react-icons/md";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { FaLinkedinIn } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";


function page() {
  const features = [
    "Advanced Sheet Features",
    "Test", 
    "Discussions",
    "Progress Tracker",
    "Weekly Test",
    "Daily Report",
    "Weekly Report",
    "Periodic Reminder",
    "Community Support",
    "Time-bounded Practice",
    "Playlist",
    "Contest"
  ];
  
  const stats = [
    { icon: FaCode, number: "455+", label: "Learning Problems" },
    { icon: FaUsers, number: "100+", label: "Community Members" },
    { icon: IoBookSharp, number: "5+", label: "Famous Sheets" },
    { icon: FaTrophy, number: "20+", label: "Contests Won" },
  ];
  
  const feedbacks = [
    {
      name: "Shivam Kumar",
      position: "@Google SDE-3",
      company: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/google.png?updatedAt=1767107537686",
      feedback: "PlusDSA helped me crack Google's interview. The structured approach and mock tests were game-changers!"
    },
    {
      name: "Priya Sharma",
      position: "@Microsoft SDE-2",
      company: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/meta.png?updatedAt=1767107537454",
      feedback: "Amazing platform! The system design problems and expert mentorship made all the difference in my preparation."
    },
    {
      name: "Rahul Gupta",
      position: "@Amazon SDE-1",
      company: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/apple.png?updatedAt=1767107537517",
      feedback: "Best DSA practice platform I've used. Got placed at Amazon with 40% salary hike. Highly recommended!"
    },
    {
      name: "Anita Singh",
      position: "@Uber Senior SDE",
      company: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/uber.png?updatedAt=1767107537497",
      feedback: "The progress tracking and personalized roadmaps helped me stay focused. Cracked Uber in just 3 months!"
    }
  ];
  
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(-1);
  
  const faqs = [
    {
      question: "What makes PlusDSA different from other coding platforms?",
      answer: "PlusDSA offers a comprehensive approach with structured learning paths, real-time mock interviews, progress tracking, and expert mentorship all in one platform."
    },
    {
      question: "How does the mentorship program work?",
      answer: "Our mentors are industry experts from top companies who provide 1-on-1 guidance, conduct mock interviews, and help create personalized learning roadmaps."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Yes! We provide detailed analytics, weekly reports, daily progress tracking, and spaced repetition reminders to keep you on track."
    },
    {
      question: "Are the mock interviews similar to real company interviews?",
      answer: "Absolutely! Our mock interviews simulate real interview environments with time constraints, coding challenges, and behavioral questions used by top tech companies."
    },
    {
      question: "What if I'm a complete beginner?",
      answer: "Perfect! Our structured learning paths start from basics and gradually build up your skills. We have curated problem sets designed specifically for beginners."
    }
  ];
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    
    return () => clearInterval(statInterval);
  }, []);
  return (
    <div className='min-h-screen bg-black  '>
<div className='max-w-7xl mx-auto'>


      
      <motion.div
        initial={{opacity:0 , scale:0.7}}
      animate={{opacity:1 , scale:0.9}}
      transition={{duration:3}}

       className='flex max-w-4xl mx-auto rounded-full items-center justify-center py-1 px-2 shadow-lg' style={{background: 'linear-gradient(135deg, #0340aa, #4f46e5, #0b2a60)', boxShadow: '0 4px 15px rgba(3, 64, 170, 0.4)'}}>
        Get    <b className='p-1 border-white bg-black text-white rounded-full px-2 mx-1'>55% OFF</b>   on year end sale and crack interviews

      </motion.div>
      <motion.div 
      className='max-w-7xl   mx-auto mt-2 px-5 py-2 border border-neutral-500/30 rounded-full flex justify-between items-center' style={{marginBottom: 90}}  
      >
        <div>
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
          alt="Logo"
          width={150}
          height={40}
          className="h-10 rounded-lg cursor-pointer"
        /> 
        </div>

        <div className='flex gap-2'>
       <button 
         className='text-white text-md hover:text-blue-400 cursor-pointer transition-colors' 
         onClick={() => document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth' })}
       >
         Problem
       </button>
       <button 
         className='text-white text-md hover:text-blue-400 cursor-pointer transition-colors' 
         onClick={() => document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' })}
       >
         Progress
       </button>
       <button 
         className='text-white text-md hover:text-blue-400 cursor-pointer transition-colors' 
         onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
       >
         Features
       </button>
       <button 
         className='text-white text-md hover:text-blue-400 cursor-pointer transition-colors' 
         onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
       >
         FAQ
       </button>

        </div>

          <div className='flex gap-3'>
       <button 
         className='text-md text-[#0340aa] cursor-pointer font-semibold'
         onClick={() => window.location.href = '/auth/login'}
       >
         Login
       </button>
       <motion.button 
         whileHover={{scale: 1.05}}
         className='text-white text-md bg-[#0340aa] px-4 py-2 flex gap-2 items-center border-[#042660] rounded-full cursor-pointer font-semibold'
         onClick={() => window.location.href = '/auth/singup'}
       >
         Register 
         <motion.div
           animate={{x: [0, 5, 0]}}
           transition={{repeat: Infinity, duration: 1.5}}
         >
           <IoMdArrowForward/>
         </motion.div>
       </motion.button>

        </div>


        
      </motion.div>


      <div
      className='flex flex-col mx-auto gap-1  mt-90 '
      >
        <div className='text-center px-4  max-w-7xl  mx-auto'>
          <motion.h1 
            className='text-4xl   font-bold text-white '
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.8}}
style={{fontSize: '49px' , marginBottom:'60px' , marginTop:'20px' }}
          >
            Master Data Structure And Algorithm (DSA) <span className='text-[#0340aa]'>10</span>x
            <br />
            using <motion.span
              key={currentFeature}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.5}}
              className="text-[#0340aa]" 
            >
              {features[currentFeature]}
            </motion.span>
          </motion.h1>
          
          <div className='flex flex-row gap-4 justify-center '>
            <Image
              src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/upvote_embed%20(1).svg"
              alt="Logo"
              width={200}
              height={50}
              className="h-12 rounded-lg cursor-pointer"
            /> 

            <Image
              src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/featured.svg"
              alt="Logo"
              width={200}
              height={50}
              className="h-12 rounded-lg cursor-pointer"
            /> 
          </div>
        </div>
       
      </div>


<motion.div 
  className='p-8 mt-20 justify-center mx-auto flex flex-col items-center gap-4 max-w-sm relative'
  animate={{
    borderColor: ['#525252', '#0340aa', '#525252'],
    boxShadow: ['0 0 0px rgba(3, 64, 170, 0)', '0 0 30px rgba(3, 64, 170, 0.4)', '0 0 0px rgba(3, 64, 170, 0)']
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  style={{
    border: '2px solid #525252',
    borderRadius: '50%',
    width: '280px',
    height: '280px',
    background: 'radial-gradient(circle, rgba(3,64,170,0.1) 0%, rgba(0,0,0,0.8) 70%)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 50px rgba(3,64,170,0.1)'
  }}
>
  <svg className='absolute inset-0 w-full h-full opacity-20' viewBox='0 0 280 280'>
    <defs>
      <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
        <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#0340aa' strokeWidth='0.5' opacity='0.3'/>
      </pattern>
    </defs>
    <rect width='100%' height='100%' fill='url(#grid)' />
    <circle cx='140' cy='140' r='100' fill='none' stroke='#0340aa' strokeWidth='1' opacity='0.2'/>
    <circle cx='140' cy='140' r='60' fill='none' stroke='#0340aa' strokeWidth='0.5' opacity='0.3'/>
  </svg>
  
  <motion.div
    key={currentStat}
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.5, y: -20 }}
    transition={{ duration: 0.9}}
    className='text-center relative z-10'
  >
    <div className='text-[#0340aa] text-4xl mb-4 flex justify-center drop-shadow-lg'>
      {React.createElement(stats[currentStat].icon)}
    </div>
    <h3 className='text-4xl font-bold text-white mb-3 drop-shadow-lg'>
      {stats[currentStat].number}
    </h3>
    <p className='text-neutral-300 text-base font-medium'>
      {stats[currentStat].label}
    </p>
  </motion.div>
</motion.div>

{!showSurprise ? (
  <motion.button
    className='mx-auto mt-6 px-6 py-2 border mb-5 rounded-xl text-white bg-[#0340aa] border-[#0340aa] hover:text-[#0340aa] transition-all flex items-center gap-2'
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setShowSurprise(true)}
  >
    Click me
    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <IoIosArrowDown />
    </motion.div>
  </motion.button>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className='mx-auto text-center relative'
  >
    <h1 className='text-2xl mt-6 text-[#0340aa] font-bold '>How We Help</h1>
    
     <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      />

    <motion.div 
      initial={{ height: 0 }}
      animate={{ height: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className='w-px bg-white mx-auto max-w-6xl '
    />
    
    <div className='relative'>
      <div className='flex flex-row'>
      <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      />

       <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      />

       <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      />

       <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      /> <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      /> <motion.div 
        initial={{ width: 0 , height:0}}
        animate={{ width: 1 , height:50}}
        transition={{ delay: 1.3, duration: 1 }}
        className='h-px bg-white mx-auto '
      />
      
      </div>
      <div className='flex justify-between items-start max-w-5xl mx-auto relative'>
        {[
          { 
            title: "Test", 
            items: [] 
          },
          { 
            title: "Discussion", 
            items: ["• Community Help", "• Doubt Solving", "• Peer Learning"] 
          },
          { 
            title: "Contest", 
            items: ["• Live Contests", "• Practice Rounds", "• Leaderboard"] 
          },
          { 
            title: "Community", 
            items: ["• Study Groups", "• Mentorship", "• Networking"] 
          },
          { 
            title: "Progress Tracker", 
            items: ["• Weekly Test",  "• Space Repetition", "• Daily Report", "• Reminder"] 
          },
          { 
            title: "All Sheets", 
            items: ["• Striver A2Z", "• Love Babbar", "• Apna College", "• More 15+"] 
          }
        ].map((branch, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
            className='text-center relative'
          >
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              className='w-px bg-white mx-auto mb-2'
            />
            
            <div className='bg-black rounded-lg p-3 min-w-[120px]'>
              <h3 className='text-white text-xl font-bold mb-4'>{branch.title}</h3>
              {branch.items.map((item, itemIndex) => (
                <motion.p 
                  key={itemIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 + index * 0.2 + itemIndex * 0.1 }}
                  className='text-neutral-400 text-base mb-2'
                >
                  {item}
                </motion.p>
              ))}
              
             
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    
      
    
   
  </motion.div>
)}

<div className='max-w-7xl flex flex-col mt-20' id='features'>
  <div className='flex flex-row justify-between mb-10 py-10 px-10 '>
    <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 leading-tight'>
      <span className='text-[#0340aa]'>Everything You Need To Crack</span>
      <br/>
      Tech Interviews
    </h1>
    <p className='text-gray-400 text-lg leading-relaxed w-80'>
      A single platform that combines structured learning, real practice, and expert guidance so you can master coding, system design, and core CS subjects with confidence.
    </p>
  </div>

  <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 px-10' id='problems'>
    
    <div className='space-y-8'>
      
      <motion.div 
        className='border-t border-b border-r border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>Structured DSA Sheets</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Curated problem sets from Striver A2Z, Love Babbar, and Blind 75 with optimal solving order.
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-12%20003102.png"
            alt="DSA Sheets Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>

      <motion.div 
        className='border-t border-b border-r border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>Contest</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Compete with learning partners and experience real-time interview competition environment with live contests, rankings, and peer challenges.
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-12%20004920.png"
            alt="Timer Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>

      <motion.div 
        className='border-t border-b mb-4 border-r border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>Community</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Join a vibrant community of learners, connect with study partners, participate in group discussions, and get support from peers on your coding journey.
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-03%20191343.png"
            alt="Analytics Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>
    </div>
    
    <div className='space-y-8'>
      
      <motion.div 
        className='border-t border-b border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>New way to Solve Question</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Transform your DSA journey from isolated problem-solving to a complete learning experience. Create custom playlists, practice with time-bound sessions, track progress, compete with peers, earn points, take tests, discuss solutions, and master time management all in one platform.
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-12%20002423.png"
            alt="System Design Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>

      <motion.div 
        className='border-t border-b border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>Progress Tracker</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Our intelligent algorithm analyzes your problem-solving patterns, notes, bookmarks, and test scores to identify weak areas. Using spaced repetition principles, it recommends daily practice questions to break the forgetting curve and optimize your learning retention.
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-12%20003238.png"
            alt="CS Fundamentals Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>

      <motion.div 
        className='border-t border-b border-neutral-500/20 p-8 bg-gradient-to-br from-gray-900/50 to-black/50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h3 className='text-2xl font-semibold text-white mb-4'>Find Learning Partner</h3>
        <p className='text-gray-400 mb-6 leading-relaxed text-lg'>
          Connect with like-minded learners, find study buddies with similar goals, and collaborate on coding challenges together for accelerated growth.And Find with AI 
        </p>
        <div className='w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-03%20191403.png"
            alt="Mentorship Icon"
            width={300}
            height={96}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </motion.div>
    </div>
  </div>




  
  <div className='py-16 mt-10 px-10'>
    <div className='text-center mb-12'>
      <h2 className='text-3xl font-bold text-white mb-5'>Trusted by <span className='text-[#0340aa]'>professionals at</span> top companies</h2>
      <div className='flex flex-wrap justify-center items-center gap-4 mb-16'>
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/google.png?updatedAt=1767107537686"
          alt="Google"
          width={120}
          height={60}
          className="h-30 w-auto  object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/infosys.png?updatedAt=1767107537459"
          alt="Infosys"
          width={120}
          height={60}
          className="h-30 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/apple.png?updatedAt=1767107537517"
          alt="Apple"
          width={120}
          height={60}
          className="h-30 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/uber.png?updatedAt=1767107537497"
          alt="Uber"
          width={120}
          height={60}
          className="h-30 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/meta.png?updatedAt=1767107537454"
          alt="Meta"
          width={120}
          height={60}
          className="h-30 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/tcs.png?updatedAt=1767107537593"
          alt="TCS"
          width={120}
          height={60}
          className="h-30 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
    
    <div className='flex flex-row justify-between mb-10 py-10'>
      <div className='flex-1 mr-8'>
  <div className='flex flex-row justify-between mb-10 py-10 px-10 '>
    <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 leading-tight'>
      <span className='text-[#0340aa]'>See In</span>
      <br/>
      Action
    </h1>
    <p className='text-gray-400 text-lg leading-relaxed w-80'>
      A single platform that combines structured learning, real practice, and expert 
    </p>
  </div>        
        <div className='relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-black border border-neutral-500/20 max-w-2xl mx-auto flex justify-center'>
          <iframe
            width="70%"
            height="300"
            src="https://www.youtube.com/embed/MYYeCneMpKE"
            title="PlusDSA Platform Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-[70%] h-[300px]"
          ></iframe>
        </div>
      </div>
      
     
    </div>
  </div>


  
</div>


  <div className="w-full py-20 px-10">
    <div className="text-center mb-12">
      <h1 className='font-bold text-4xl text-white'>Pricing of your future</h1>
      <p className='text-neutral-500 text-2xl'>Select the best pricing plan that suits your needs</p>
    </div>

    <div className="max-w-6xl mx-auto flex flex-row justify-center items-stretch gap-6">
      <div className='border border-neutral-500/30 rounded-xl p-6 bg-black hover:shadow-lg transition-all duration-300 flex-1 max-w-sm'>
        <h1 className='text-white font-semibold text-xl mb-2'>Basic Plan</h1>
        <p className='text-neutral-500 mb-4'>Perfect for interview preparation beginners.</p>
        <h1 className='text-white text-4xl font-bold mb-5'>$2 </h1>
        <hr className='mb-4'/>
        
        <div className='space-y-3 mb-6'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            5 AI mock interviews
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            2 Mentorship sessions
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            1 challenge access
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Access to all test templates
          </div>
        </div>
        
        <button className='px-5 py-3 w-full rounded-xl font-bold bg-[#0340aa] hover:bg-[#042660] flex items-center justify-center text-xl transition-colors'>
          Get it now <RiArrowRightDoubleLine className='ml-4'/>
        </button>
      </div>

      <div className='border-2 border-[#0340aa]  rounded-xl p-6 bg-black hover:shadow-lg transition-all duration-300 flex-1 max-w-sm relative'>
        <div className='absolute top-3 left-1/2 transform -translate-x-1/2'>
        </div>
        <h1 className='text-white text-xl  text-center  font-semibold bg-[#0340aa] px-3 py-1 rounded-2xl mb-2'>Pro Plan</h1>
        <p className='text-neutral-500 mb-4'>Advanced features with mentorship support.</p>
        <h1 className='text-white text-5xl font-bold mb-5'>$8</h1>
        <hr className='mb-4'/>
        
        <div className='space-y-3 mb-6'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Everything in Basic Plan
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            10 AI mock interviews
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            6 Mentorship sessions
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Resume review
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Access to community
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Offline mock interviews
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            5 challenges access
          </div>
        </div>
        
        <button className='px-5 py-3 w-full rounded-xl font-bold bg-[#0340aa] hover:bg-[#042660] flex items-center justify-center text-xl transition-colors'>
          Get it now <RiArrowRightDoubleLine className='ml-4'/>
        </button>
      </div>

      <div className='border border-neutral-500/30 rounded-xl p-6 bg-black hover:shadow-lg transition-all duration-300 flex-1 max-w-sm'>
        <h1 className='text-white text-xl font-bold mb-2'>Premium Plan</h1>
        <p className='text-neutral-500 mb-4'>Complete solution with unlimited access.</p>
        <h1 className='text-white text-4xl font-bold mb-5'>$6 </h1>
        <hr className='mb-4'/>
        
        <div className='space-y-3 mb-6'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Everything in Pro Plan
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Unlimited AI mock interviews
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            10 Mentorship sessions
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Unlimited challenges access
          </div>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FaCheckCircle className='text-green-500'/>
            Priority support
          </div>
        </div>
        
        <button className='px-5 py-3 w-full rounded-xl font-bold bg-[#0340aa] hover:bg-[#042660] flex items-center justify-center text-xl transition-colors'>
          Get it now <RiArrowRightDoubleLine className='ml-4'/>
        </button>
      </div>
    </div>
  </div>


  <div className="
    w-full mt-20 py-10
    relative 
  " id='progress'
>
    <div className='max-w-7xl mx-auto px-10'>
      <div className='mb-12 text-center'>
        <h1 className='text-3xl font-bold text-white'>Coders that <span className='text-[#0340aa]'>turned around their careers</span></h1>
      </div>

      <div className='flex flex-row overflow-x-auto gap-2'>
        {[
          {
            name: "Shivam Kumar",
            position: "@Google SDE-3",
            feedback: "PlusDSA helped me crack Google's interview. The structured approach and mock tests were game-changers!",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Priya Sharma",
            position: "@Microsoft SDE-2",
            feedback: "Amazing platform! The system design problems and expert mentorship made all the difference.",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Rahul Gupta",
            position: "@Amazon SDE-1",
            feedback: "Best DSA practice platform I've used. Got placed at Amazon with 40% salary hike.",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Anita Singh",
            position: "@Uber Senior SDE",
            feedback: "The progress tracking helped me stay focused. Cracked Uber in 3 months!",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
        ].map((testimonial, index) => (
          <div key={index} className='border w-10% border-neutral-500/20 rounded-lg p-4    '>
            <div className='flex  justify-between mb-3'>
              <div className='flex   gap-2'>
                <Image 
                  src={testimonial.image}
                  width={32}
                  height={32}
                  alt={testimonial.name}
                  className='rounded-full'
                />
                <div>
                  <h3 className='text-white font-semibold text-sm'>{testimonial.name}</h3>
                  <p className='text-gray-400 text-xs'>{testimonial.position}</p>
                </div>
              </div>
              <FaLinkedin className='text-lg text-blue-500'/>
            </div>
            
            <p className='text-gray-300 text-xs leading-relaxed'>{testimonial.feedback}</p>
          </div>
        ))}





      </div>



       <div className='flex flex-row overflow-x-auto gap-2 mt-2'>
        {[
          {
            name: "Shivam Kumar",
            position: "@Google SDE-3",
            feedback: "PlusDSA helped me crack Google's interview. The structured approach and mock tests were game-changers!",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Priya Sharma",
            position: "@Microsoft SDE-2",
            feedback: "Amazing platform! The system design problems and expert mentorship made all the difference.",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Rahul Gupta",
            position: "@Amazon SDE-1",
            feedback: "Best DSA practice platform I've used. Got placed at Amazon with 40% salary hike.",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
          {
            name: "Anita Singh",
            position: "@Uber Senior SDE",
            feedback: "The progress tracking helped me stay focused. Cracked Uber in 3 months!",
            image: "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
          },
        ].map((testimonial, index) => (
          <div key={index} className='border w-10% border-neutral-500/20 rounded-lg p-4    '>
            <div className='flex  justify-between mb-3'>
              <div className='flex   gap-2'>
                <Image 
                  src={testimonial.image}
                  width={32}
                  height={32}
                  alt={testimonial.name}
                  className='rounded-full'
                />
                <div>
                  <h3 className='text-white font-semibold text-sm'>{testimonial.name}</h3>
                  <p className='text-gray-400 text-xs'>{testimonial.position}</p>
                </div>
              </div>
              <FaLinkedin className='text-lg text-blue-500'/>
            </div>
            
            <p className='text-gray-300 text-xs leading-relaxed'>{testimonial.feedback}</p>
          </div>
        ))}





      </div>

    </div>
  </div>

<div className="py-20 mt-20 bg-black" id='faq'>
  <div className="max-w-7xl mx-auto px-10">
    <div className="text-center mb-12">
      <h1 className='text-3xl font-bold text-white mb-4'>
        Frequently Asked <span className='text-[#0340aa]'>Questions</span>
      </h1>
      <p className='text-gray-400 text-lg'>
        Get answers to common questions about PlusDSA
      </p>
    </div>

    <div className="max-w-4xl mx-auto space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-b border-neutral-500/40 rounded-xl "
        >
          <button
            className="flex items-center justify-between w-full p-6 text-left"
            onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
          >
            <span className="text-white  font-semibold text-lg">
              {faq.question}
            </span>
            <div className={`transform transition-transform duration-300 ${
              openFAQ === index ? 'rotate-180' : ''
            }`}>
              <IoIosArrowDown className="w-5 h-5 text-gray-400" />
            </div>
          </button>
          {openFAQ === index && (
            <div className="px-6 pb-6">
              <p className="text-neutral-500 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>

    <p className="text-center text-gray-400 mt-12">
      Didn't find what you're looking for?
      <a
        href="#"
        className="text-[#0340aa] hover:text-[#042660] font-medium ml-1 hover:underline transition-colors"
      >
           Contact Support
      </a>
    </p>
  </div>
</div>

<footer className="border-t mt-4 mb-3 border-gray-700">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex justify-between items-start">
      <div>
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
          alt="PlusDSA Logo"
          width={150}
          height={50}
          className="object-contain mb-4"
        />
        <p className="text-gray-400 text-sm max-w-xs">
          Master DSA and crack your dream job with structured learning and expert guidance.
        </p>
      </div>

      <div className="flex justify-between gap-4">
        <div className='flex flex-col gap-1'>
            <h1 className='font-bold  text-xl mb-3 text-[#0340aa]'>Our Products</h1>
            <h1 className='font-bold hover:text-[#0340aa] curser-pointer'>Mockround.AI</h1>
                        <h1 className='font-bold hover:text-[#0340aa] curser-pointer'>PlusDSA</h1>
                        <h1 className='font-bold hover:text-[#0340aa] curser-pointer'>ClassRoom Mitra</h1>

        
        </div>

        <div>
            <h1 className='font-bold mb-5 text-[#0340aa]'>Social Links</h1>
          <div className="flex items-center gap-1">
            {[
              { href: "https://x.com/Vsion09", icon: RiTwitterXLine },
              { href: "https://www.linkedin.com/in/shivam-kumar-321810324/", icon: FaLinkedin },
              { href: "https://github.com/shivamshrma09", icon: FaGithub },
              { href: "https://medium.com/@vsion09", icon: FaMedium },
              { href: "https://www.youtube.com/@shivamsharmadev", icon: FaYoutube },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0340aa] transition-colors duration-300 hover:scale-110 transform"
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="  border-t border-gray-700 text-center">
      <p className="text-gray-400 text-sm">
        © 2026 PlusDSA. All rights reserved.
      </p>
    </div>
  </div>
</footer>

</div>
</div>


  )
}

export default page
