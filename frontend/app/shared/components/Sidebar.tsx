"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MdArrowForwardIos } from "react-icons/md"
import { IoIosArrowDown } from "react-icons/io"
import { LuFileSpreadsheet } from "react-icons/lu"
import { GiProgression } from "react-icons/gi"
import { GiArrowScope } from "react-icons/gi"
import { IoIosChatboxes } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { PiStudent } from "react-icons/pi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md"
import { IoLogOut } from "react-icons/io5"
import { authUtils } from '@/lib/auth'


function Sidebar() {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const [showsidebar, setshowsidebar] = useState(true)
  
  const menuItems = [
    { icon: GiProgression, label: "Progress Tracker", route: "/progress_tracker" },
    { icon: GiArrowScope, label: "Contents", route: "/challenges" },
    { icon: IoIosChatboxes, label: "Community", route: "/Community" },
    { icon: PiStudent, label: "Find Learning Partner", route: "/learing_partner" },
    { icon: CgProfile, label: "Profile", route: "/profile" }
  ]

  const sheets = [
    { name: "Striver Sheet", route: "/home/striver-a2z-dsa-course" },
    { name: "Apna College Sheet", route: "/home/apnaCollegeSheet" }, 
    { name: "Love Babbar Sheet", route: "/home/loveBabbarSheet" }
  ]

  return (
    <>
      <button
        onClick={() => setshowsidebar(!showsidebar)}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 bg-[#0340aa] rounded-lg text-white"
      >
        {showsidebar ? (
          <MdKeyboardDoubleArrowLeft className="text-2xl" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {showsidebar && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setshowsidebar(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-[95]
        w-72 bg-black text-white border-r border-neutral-500/30 h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${showsidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="border-b border-neutral-500/30 p-4 flex items-center justify-between">
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
          alt="Logo"
          width={150}
          height={40}
          className="h-10 rounded-lg"
        /> 
        <MdKeyboardDoubleArrowLeft  onClick={() => setshowsidebar(!showsidebar)} className="text-2xl lg:hidden cursor-pointer hover:text-gray-300" />
      </div>

     
      <nav className="p-4 space-y-2">
        <div>
          <div 
            className="flex items-center justify-between w-full cursor-pointer hover:bg-[#0340aa]/30 p-3 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2">
              <LuFileSpreadsheet className="text-lg" />
              <span>Sheets</span>
            </div>
            {open ? <IoIosArrowDown /> : <MdArrowForwardIos />}
          </div>
          
          {open && (
            <div className="ml-6 mt-2 border-l border-neutral-500/30 pl-4 space-y-1">
              {sheets.map((sheet: any, index: any) => (
                <div 
                  key={index} 
                  onClick={() => router.push(sheet.route)}
                  className="hover:bg-[#0340aa]/30 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  {sheet.name}
                </div>
              ))}
            </div>
          )}
        </div>

       
        {menuItems.map((item: any, index: any) => {
          const IconComponent = item.icon
          return (
            <div 
              key={index} 
              onClick={() => router.push(item.route)}
              className="flex items-center gap-2 hover:bg-[#0340aa]/30 p-3 rounded-lg cursor-pointer transition-colors"
            >
              <IconComponent className="text-lg" />
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      <div className="mt-auto p-4">
        <div 
          onClick={() => authUtils.logout()}
          className="flex items-center gap-2 hover:bg-red-600/30 p-3 rounded-lg cursor-pointer transition-colors text-red-400 hover:text-red-300"
        >
          <IoLogOut className="text-lg" />
          <span>Logout</span>
        </div>
      </div>

      <div className="p-3 text-center text-neutral-300 mt-[-15]">
        <h3 className="font-bold mb-2">View more products</h3>
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/QR%20Code.png?updatedAt=1767374458636"
          alt="QR Code"
          width={160}
          height={160}
          className="mx-auto border border-neutral-500/40 p-2 rounded-lg"
        />
      </div>
      </div>
    </>
  )
}

export default Sidebar
