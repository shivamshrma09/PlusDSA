import React from 'react'
import Image from 'next/image';

interface SocialbuttonProps {
  onClick?: () => void;
}

function Socialbutton({ onClick }: SocialbuttonProps) {
  return (
    <div 
      className='border border-1 items-center py-2 flex flex-row gap-2 px-4 rounded-xl bg-black text-base text-lg text-gray-600 cursor-pointer hover:bg-gray-900 transition-colors'
      onClick={onClick}
    >
      <div>
        <Image
          width={20}
          height={20}
          alt='google logo'
          src='https://ik.imagekit.io/qwzhnpeqg/PlusDSA/download-removebg-preview%20(1).png'
        />
      </div>
      <div className='pt-1'>
        Sign in with Google
      </div>
    </div>
  )
}

export default Socialbutton