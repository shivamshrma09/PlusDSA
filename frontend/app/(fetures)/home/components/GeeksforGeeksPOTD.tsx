import React from 'react'
import Image from 'next/image'

function GeeksforGeeksPOTD() {
  return (
    <div className='w-48 h-32 bg-gradient-to-br bg-black border-neutral-500/20 rounded-xl flex flex-col gap-2 p-3 shadow-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300'>
      <div className='flex items-center justify-center h-16'>
        <Image 
          src='https://media.geeksforgeeks.org/gfg-gg-logo.svg'
          width={120}
          height={40}
          alt='GeeksforGeeks'
          className='object-contain'
        />
      </div>
      
      <div className='text-center'>
        <h1 className='text-white text-sm font-semibold mb-1'>Solve GFG POTD</h1>
        <a href='https://www.geeksforgeeks.org/problem-of-the-day' target='_blank' rel='noopener noreferrer'>
          <button className='bg-green-600 hover:bg-green-700 px-4 py-1 rounded-lg text-white text-xs font-medium transition-colors duration-200'>
            Solve Now
          </button>
        </a>
      </div>
    </div>
  )
}

export default GeeksforGeeksPOTD