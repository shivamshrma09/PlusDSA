import React from 'react'
import Image from 'next/image'
import { CiCalendarDate } from "react-icons/ci"
import { LiaQuestionSolid } from "react-icons/lia"
import { FaPlay } from "react-icons/fa"
import { MdFeaturedPlayList } from "react-icons/md"
import { SiLeetcode, SiCodechef, SiCodeforces, SiHackerrank } from "react-icons/si"

interface CardProps {
  date: string
  numberOfQuestions: number
  title?: string
  imageUrl?: string
  type?: 'test' | 'playlist'
  playlistName?: string
  platform?: 'leetcode' | 'codechef' | 'codeforces' | 'hackerrank' | 'custom'
  platformUrl?: string
  onClick?: () => void
}

function Card({ 
  date, 
  numberOfQuestions, 
  title = "Weekly Test", 
  imageUrl = "https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png",
  type = 'test',
  playlistName,
  platform = 'custom',
  platformUrl,
  onClick
}: CardProps) {
  const getPlatformIcon = () => {
    switch(platform) {
      case 'leetcode':
        return <SiLeetcode className='text-orange-500 text-lg'/>
      case 'codechef':
        return <SiCodechef className='text-brown-500 text-lg'/>
      case 'codeforces':
        return <SiCodeforces className='text-blue-500 text-lg'/>
      case 'hackerrank':
        return <SiHackerrank className='text-green-500 text-lg'/>
      default:
        return null
    }
  }

  const getPlatformName = () => {
    switch(platform) {
      case 'leetcode': return 'LeetCode'
      case 'codechef': return 'CodeChef'
      case 'codeforces': return 'Codeforces'
      case 'hackerrank': return 'HackerRank'
      default: return 'Custom'
    }
  }

  return (
    <div className='w-full max-w-sm h-auto p-4 border border-neutral-500/20 rounded-xl bg-black hover:border-[#0340aa]/50 transition-all duration-300'>
      {type === 'playlist' && playlistName && (
        <div className='mb-3 flex items-center gap-2'>
          <MdFeaturedPlayList className='text-[#0340aa] text-xl flex-shrink-0'/>
          <h3 className='text-white font-semibold text-base truncate' title={playlistName}>{playlistName}</h3>
        </div>
      )}
      
      <div className='w-full h-28 flex items-center justify-center bg-neutral-900/50 rounded-lg border border-neutral-600/30 relative'>
        {platform !== 'custom' && (
          <div className='absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-md'>
            {getPlatformIcon()}
            <span className='text-xs text-white'>{getPlatformName()}</span>
          </div>
        )}
        
        {type === 'playlist' ? (
          <div className='flex flex-col items-center justify-center text-neutral-400'>
            <MdFeaturedPlayList className='text-3xl text-[#0340aa] mb-1'/>
            <span className='text-xs'>Playlist</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="Test Logo"
            width={200}
            height={80}
            className="rounded-lg object-contain w-full h-full p-2"
          /> 
        )}
      </div>
      
      <div className='mt-3 text-neutral-500 space-y-2'>
        <div className='flex flex-row items-center gap-2'>
          <CiCalendarDate className='text-blue-400 flex-shrink-0'/>
          <h2 className='text-xs truncate'><b className='text-[#0340aa]'>Date:</b> {date}</h2>
        </div>

        <div className='flex flex-row items-center gap-2'>
          <LiaQuestionSolid className='text-green-400 flex-shrink-0'/>
          <h2 className='text-xs truncate'><b className='text-[#0340aa]'>Questions:</b> {numberOfQuestions}</h2>
        </div>

        <div className='flex flex-row items-center gap-2 mt-3 border rounded-lg py-2 px-3 justify-center border-neutral-500 hover:bg-[#0340aa] hover:text-white hover:border-[#0340aa] transition-all duration-300 cursor-pointer group' 
             onClick={() => {
               if (platformUrl) {
                 window.open(platformUrl, '_blank')
               } else if (onClick) {
                 onClick()
               }
             }}>
          <FaPlay className='group-hover:text-white text-[#0340aa] transition-colors text-sm'/>
          <button className='text-[#0340aa] group-hover:text-white font-medium transition-colors text-xs'>
            {platformUrl ? `Open on ${getPlatformName()}` : (type === 'playlist' ? 'Open Playlist' : 'Start Test')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
