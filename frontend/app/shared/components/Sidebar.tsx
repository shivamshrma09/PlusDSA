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


function Sidebar() {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  
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
    <div className="w-72 bg-black text-white border-r border-neutral-500/30 h-screen flex flex-col">
      <div className="border-b border-neutral-500/30 p-4 flex items-center justify-between">
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
          alt="Logo"
          width={150}
          height={40}
          className="h-10 rounded-lg"
        /> 
        <MdKeyboardDoubleArrowLeft className="text-2xl cursor-pointer hover:text-gray-300" />
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
  )
}

export default Sidebar
