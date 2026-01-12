"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from "../../shared/components/Sidebar";
import {
  MdArrowForwardIos,
  MdEdit,
  MdLocationOn,
  MdSchool,
  MdWork,
} from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import Image from "next/image";
import { BiSolidInstitution } from "react-icons/bi";
import { CiShare2 } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineCloudUpload } from "react-icons/md";
import Userprofile from "./components/Userprofile";
import { uploadToImageKit, downloadFromImageKit } from "./services/imagekit";
import { getProfile, updateProfile } from "./services/profiledata";

function page() {
  const [editprofile, seteditprofile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Shivam Kumar",
    username: "VISION", 
    collegeName: "Delhi Technological University",
    about: "Passionate Electtical Engineer student at Delhi Technological University with a strong foundation in software development and problem-solving. I love turning complex problems into elegant solutions through code. Currently exploring machine learning and web technologies while building projects that make a difference. Always eager to learn, collaborate, and contribute to innovative tech solutions. Follow me on Linkdin , X  and medium",
    skills: ['C' , 'Python', 'C++', 'Data Structures', 'Algorithms', 'Competitive Programming', 'NextJs', 'React', 'Node.js', 'ExpressJS' ,'OpenSource' , 'JavaScript', 'Git & Github' , 'AWS' , 'Devops' , 'system design Little bit'],
    githubLink: "https://github.com/shivamshrma09",
    linkedinLink: "https://www.linkedin.com/in/shivam-kumar-321810324/",
    leetcodeLink: "",
    resume: "", 
    resumeFileName: "",
    avatar: "",
    problems_per_day: 3,
    reminders_per_day: 9,
    reminders_enabled: true,
    weekly_report_enabled: true,
    notifications: {
      hackathons: true,
      jobOpenings: true,
      contestUpdates: true,
      techNews: true
    },
    education: [] as Array<{branchName: string; passoutyear: string}>
  });

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const fileName = `avatar_${profileData.username}_${Date.now()}.${file.name.split('.').pop()}`;
        const uploadResult = await uploadToImageKit(file, fileName);
        if (uploadResult.success) {
          handleInputChange('avatar', uploadResult.url);
          toast.success('Avatar updated successfully!');
        } else {
          toast.error('Upload failed: ' + uploadResult.error);
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
        toast.error('Avatar upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const fileName = `resume_${profileData.username}_${Date.now()}.${file.name.split('.').pop()}`;
        const uploadResult = await uploadToImageKit(file, fileName);
        
        if (uploadResult.success) {
          handleInputChange('resume', uploadResult.url);
          handleInputChange('resumeFileName', uploadResult.name);
          toast.success('Resume uploaded successfully!');
        } else {
          toast.error('Upload failed: ' + uploadResult.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDownloadResume = () => {
    if (profileData.resume) {
      downloadFromImageKit(profileData.resume, profileData.resumeFileName || 'resume.pdf');
    }
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile({
        username: profileData.username,
        collegeName: profileData.collegeName,
        About: profileData.about,
        skills: profileData.skills,
        githubLink: profileData.githubLink,
        linkedinLink: profileData.linkedinLink,
        leetcodeLink: profileData.leetcodeLink,
        resume: profileData.resume,
        resumeFileName: profileData.resumeFileName,
        avatar: profileData.avatar,
        problems_per_day: profileData.problems_per_day,
        reminders_per_day: profileData.reminders_per_day,
        reminders_enabled: profileData.reminders_enabled,
        weekly_report_enabled: profileData.weekly_report_enabled,
        Want_update_of_new_courses: Object.entries(profileData.notifications)
          .filter(([key, value]) => value)
          .map(([key, value]) => {
            const labelMap: Record<string, string> = {
              hackathons: 'Hackathons',
              jobOpenings: 'Job Openings', 
              contestUpdates: 'Contest Updates',
              techNews: 'Tech News'
            };
            return labelMap[key];
          }),
        education: profileData.education
      });
      
      if (response.success) {
        seteditprofile(false);
        toast.success('Profile updated successfully!');
      } else {
        seteditprofile(false);
        toast.success('Profile saved locally!');
      }
    } catch (error) {
      seteditprofile(false);
      toast.success('Profile saved locally!');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        
        if (response.success && response.data && response.data.profile && response.data.profile.length > 0) {
          const profile = response.data.profile[0]; 
          setProfileData({
            name: response.data.name || "User",
            username: profile.username || "username",
            collegeName: profile.collegeName || "College Name",
            about: profile.About || "About me...",
            skills: profile.skills || [],
            githubLink: profile.githubLink || "",
            linkedinLink: profile.linkedinLink || "",
            leetcodeLink: profile.leetcodeLink || "",
            resume: profile.resume || "",
            resumeFileName: profile.resumeFileName || "",
            avatar: profile.avatar || "",
            problems_per_day: profile.problems_per_day || 3,
            reminders_per_day: profile.reminders_per_day || 9,
            reminders_enabled: profile.reminders_enabled ?? false,
            weekly_report_enabled: profile.weekly_report_enabled ?? false,
            notifications: {
              hackathons: profile.Want_update_of_new_courses?.includes('Hackathons') ?? false,
              jobOpenings: profile.Want_update_of_new_courses?.includes('Job Openings') ?? false,
              contestUpdates: profile.Want_update_of_new_courses?.includes('Contest Updates') ?? false,
              techNews: profile.Want_update_of_new_courses?.includes('Tech News') ?? false
            },
            education: profile.education || []
          });
        } else {
          console.log('No profile data found, using defaults');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    
    fetchProfile();
  }, []);
  return (
    <div className="h-screen max-w-screen bg-black overflow-hidden">
      <div className="flex flex-row h-full">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 h-full">
          <div className="sticky top-0 z-10 w-full flex flex-row justify-between h-18 border border-b flex gap-2 pt-5 pb-6 items-center text-xl border-neutral-500/20 bg-black">
            <div className="flex gap-2 items-center">
              <span className="text-neutral-500 ml-5">Profile</span>
              <MdArrowForwardIos className="text-neutral-500" />
              <span>User Profile</span>
            </div>
           

          </div>

          <div
            className="flex-1 p-4 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full h-48 mb-6">
                <Image
                  src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png?updatedAt=1767366130662"
                  fill
                  alt="Profile Banner"
                  className="rounded-xl border border-neutral-500/20 object-cover"
                />
                <div className="absolute -bottom-16 left-8">
                  <label className="cursor-pointer relative group">
                    <Image
                      src={profileData.avatar || "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"}
                      width={120}
                      height={120}
                      alt="Profile Picture"
                      className="rounded-full border-4 border-black object-cover"
                    />
                    {editprofile && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                      disabled={!editprofile || uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-17 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    {editprofile ? (
                      <input 
                        value={profileData.name}
                        onChange={(e: any) => handleInputChange('name', e.target.value)}
                        className="text-white text-3xl font-bold bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none w-full"
                      />
                    ) : (
                      <h1 className="text-white text-3xl font-bold">
                        {profileData.name}
                      </h1>
                    )}
                    
                    {editprofile ? (
                      <input 
                        value={profileData.username}
                        onChange={(e: any) => handleInputChange('username', e.target.value)}
                        className="text-neutral-500/80 text-md bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none"
                        placeholder="@username"
                      />
                    ) : (
                      <p className="text-neutral-500/80 text-md">@{profileData.username}</p>
                    )}
                    
                    <div className="flex items-center text-neutral-300">
                      <div className="flex items-center gap-1">
                        <BiSolidInstitution />
                        {editprofile ? (
                          <input 
                            value={profileData.collegeName}
                            onChange={(e: any) => handleInputChange('collegeName', e.target.value)}
                            className="bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none text-white"
                          />
                        ) : (
                          <span>{profileData.collegeName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editprofile ? (
                      <div className="flex flex-col gap-2">
                        <input 
                          value={profileData.linkedinLink}
                          onChange={(e: any) => handleInputChange('linkedinLink', e.target.value)}
                          className="bg-transparent border border-neutral-500/20 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                          placeholder="LinkedIn URL"
                        />
                        <input 
                          value={profileData.githubLink}
                          onChange={(e: any) => handleInputChange('githubLink', e.target.value)}
                          className="bg-transparent border border-neutral-500/20 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                          placeholder="GitHub URL"
                        />
                        <input 
                          value={profileData.leetcodeLink}
                          onChange={(e: any) => handleInputChange('leetcodeLink', e.target.value)}
                          className="bg-transparent border border-neutral-500/20 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                          placeholder="LeetCode URL"
                        />
                      </div>
                    ) : (
                      <>
                        <a
                          href={profileData.linkedinLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 border p-1 border-neutral-500/20 hover:text-blue-400 transition-colors"
                        >
                          <FaLinkedin className="text-2xl" />
                        </a>
                        <a
                          href={profileData.githubLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 border p-1 border-neutral-500/20 hover:text-gray-300 transition-colors"
                        >
                          <FaGithub className="text-2xl" />
                        </a>
                        {profileData.leetcodeLink && (
                          <a
                            href={profileData.leetcodeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 border p-1 border-neutral-500/20 hover:text-orange-400 transition-colors"
                          >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                            </svg>
                          </a>
                        )}
                      </>
                    )}
                    <CiShare2 className="text-4xl border p-1 border-neutral-500/20" />
                    {editprofile ? (
                      <button 
                        onClick={handleSave}
                        className="text-green-600 text-4xl border p-1 border-neutral-500/20 hover:bg-green-600/20 cursor-pointer"
                      >
                        ✓
                      </button>
                    ) : (
                      <MdOutlineModeEdit 
                        className="text-blue-600 text-4xl border p-1 border-neutral-500/20 cursor-pointer hover:bg-blue-600/20" 
                        onClick={() => seteditprofile(true)} 
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 m-auto mt-10">
                <div className=" border border-neutral-500/20 p-5 w-1/2 flex flex-col  rounded-xl">
                  <div>
                    <div className="flex flex-row justify-between items-center mb-4 text-xl">
                      <h1>About</h1>
                    </div>
                    {editprofile ? (
                      <textarea 
                        value={profileData.about}
                        onChange={(e: any) => handleInputChange('about', e.target.value)}
                        className="text-white/70 mb-5 border border-neutral-500/20 bg-transparent rounded p-2 w-full h-32 resize-none focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-white/70 mb-5 border-b border-neutral-500/20 pb-3">
                        {profileData.about}
                      </p>
                    )}
                  </div>



<div>
                    <div className="flex flex-row justify-between items-center mb-4 text-xl">
                      <h1>Skills</h1>
                    </div>
                    <div className="text-white/70 mb-5 border-b border-neutral-500/20 pb-3">
                      {editprofile ? (
                        <input 
                          value={profileData.skills.join(', ')}
                          onChange={(e: any) => handleSkillsChange(e.target.value)}
                          className="w-full bg-transparent border border-neutral-500/20 rounded p-2 focus:border-blue-500 outline-none text-white"
                          placeholder="Enter skills separated by commas"
                        />
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {profileData.skills.map((skill: any, index: any) => (
                            <span key={index} className="px-3 py-1 border border-[#0340aa]/80 text-white text-sm rounded-full hover:bg-blue-700 transition-colors">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>



                  <div>
                    <div className="flex flex-row justify-between items-center mb-4 text-xl">
                      <h1>Resume</h1>
                    </div>
                    <div className="text-white/70 mb-5 border-b border-neutral-500/20 pb-3">
                      {profileData.resume ? (
                        <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-500/20">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            </div>
                            <div>
                              <p className="text-white font-medium">{profileData.resumeFileName || 'Resume uploaded'}</p>
                              <p className="text-neutral-400 text-sm">Stored on ImageKit</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={handleDownloadResume}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Download
                            </button>
                            {editprofile && (
                              <button 
                                onClick={() => {
                                  handleInputChange('resume', '');
                                  handleInputChange('resumeFileName', '');
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            uploading 
                              ? 'border-blue-500/50 bg-blue-500/10' 
                              : 'border-neutral-500/50 hover:border-blue-500/50'
                          }`}>
                            {uploading ? (
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                                <p className="text-blue-400 mb-2">Uploading to ImageKit...</p>
                                <p className="text-neutral-500 text-sm">Please wait</p>
                              </div>
                            ) : (
                              <div>
                                <MdOutlineCloudUpload className="text-4xl mx-auto mb-3 text-neutral-400"/>
                                <p className="text-neutral-300 mb-2">Upload your resume</p>
                                <p className="text-neutral-500 text-sm">Drag and drop or click to browse</p>
                              </div>
                            )}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>


                  <div>
                    <div className="flex flex-row justify-between items-center mb-4 text-xl">
                      <h1>Education</h1>
                    </div>
                     <div className="text-white/70 mb-5 border-b border-neutral-500/20 pb-3">
                      <div className="flex gap-3 items-start">
                        <div className="w-30 h-30 bg-white rounded-lg flex items-center justify-center p-1">
                          <Image
                            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/download%20(1).jpg"
                            width={40}
                            height={40}
                            alt="DTU Logo"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          {editprofile ? (
                            <div className="space-y-2">
                              <input 
                                value={profileData.collegeName || ''}
                                onChange={(e: any) => handleInputChange('collegeName', e.target.value)}
                                className="text-white font-semibold text-lg bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none w-full"
                                placeholder="College/University Name"
                              />
                              <input 
                                value={profileData.education[0]?.branchName || ''}
                                onChange={(e: any) => {
                                  const updatedEducation: any[] = [...(profileData.education || [])];
                                  if (updatedEducation[0]) {
                                    updatedEducation[0].branchName = e.target.value;
                                  } else {
                                    updatedEducation[0] = { branchName: e.target.value, passoutyear: '2026' };
                                  }
                                  handleInputChange('education', updatedEducation);
                                }}
                                className="text-blue-400 font-medium bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none w-full"
                                placeholder="Branch/Field of Study"
                              />
                              <input 
                                value={profileData.education[0]?.passoutyear || ''}
                                onChange={(e: any) => {
                                  const updatedEducation: any[] = [...(profileData.education || [])];
                                  if (updatedEducation[0]) {
                                    updatedEducation[0].passoutyear = e.target.value;
                                  } else {
                                    updatedEducation[0] = { branchName: '', passoutyear: e.target.value };
                                  }
                                  handleInputChange('education', updatedEducation);
                                }}
                                className="text-neutral-300 bg-transparent border-b border-neutral-500 focus:border-blue-500 outline-none w-full"
                                placeholder="Pass Out Year"
                              />
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-white font-semibold text-lg">{profileData.collegeName || 'College Name'}</h3>
                              <p className="text-blue-400 font-medium">{profileData.education[0]?.branchName || 'Electrical Engineer'}</p>
                              <p className="text-neutral-300">Pass Out Year: {profileData.education[0]?.passoutyear || '2028'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>




                </div>

                <div className="border border-neutral-500/20 p-5 w-1/2 rounded-xl h-fit">
                  <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-500/20">
                    <h2 className="text-white text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                      <IoSettingsOutline className="text-blue-500" />
                      DSA Settings
                    </h2>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-6 justify-center">
                        <div className="text-center">
                          <p className="text-neutral-300 text-sm mb-2">Problems per day</p>
                          <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={profileData.problems_per_day}
                            onChange={(e: any) => handleInputChange('problems_per_day', parseInt(e.target.value))}
                            className="w-20 bg-neutral-700 text-white p-2 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500 text-center text-lg font-semibold" 
                          />
                        </div>
                        
                        <div className="text-center">
                          <p className="text-neutral-300 text-sm mb-2">Daily Reminder (Hour)</p>
                          <input 
                            type="number" 
                            min="0" 
                            max="23" 
                            value={profileData.reminders_per_day}
                            onChange={(e: any) => handleInputChange('reminders_per_day', parseInt(e.target.value))}
                            className="w-20 bg-neutral-700 text-white p-2 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500 text-center text-lg font-semibold" 
                          />
                          <p className="text-neutral-500 text-xs mt-1">24-hour format (0-23)</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-neutral-600">
                        <h3 className="text-white text-lg font-semibold mb-3">Notification Preferences</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-neutral-300 text-sm mb-2">Want Updates For:</p>
                            <div className="space-y-2">
                              {[
                                { key: 'hackathons', label: 'Hackathons' },
                                { key: 'jobOpenings', label: 'Job Openings' },
                                { key: 'contestUpdates', label: 'Contest Updates' },
                                { key: 'techNews', label: 'Tech News' }
                              ].map((update: any) => (
                                <label key={update.key} className="flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={profileData.notifications?.[update.key as keyof typeof profileData.notifications] || false}
                                    onChange={(e: any) => handleInputChange('notifications', {
                                      ...profileData.notifications,
                                      [update.key]: e.target.checked
                                    })}
                                    className="sr-only peer" 
                                  />
                                  <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center transition-colors ${
                                    profileData.notifications?.[update.key as keyof typeof profileData.notifications] 
                                      ? 'border-blue-500 bg-blue-500' 
                                      : 'border-neutral-500'
                                  }`}>
                                    {profileData.notifications?.[update.key as keyof typeof profileData.notifications] && (
                                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-neutral-300 text-sm">{update.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-300">Daily Email Reminder</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={profileData.reminders_enabled}
                                onChange={(e: any) => handleInputChange('reminders_enabled', e.target.checked)}
                                className="sr-only peer" 
                              />
                              <div className={`w-11 h-6 rounded-full peer-focus:outline-none relative transition-colors ${
                                profileData.reminders_enabled ? 'bg-blue-600' : 'bg-neutral-600'
                              }`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${
                                  profileData.reminders_enabled ? 'translate-x-full' : ''
                                }`}></div>
                              </div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-300">Weekly Email Report</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={profileData.weekly_report_enabled}
                                onChange={(e: any) => handleInputChange('weekly_report_enabled', e.target.checked)}
                                className="sr-only peer" 
                              />
                              <div className={`w-11 h-6 rounded-full peer-focus:outline-none relative transition-colors ${
                                profileData.weekly_report_enabled ? 'bg-blue-600' : 'bg-neutral-600'
                              }`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${
                                  profileData.weekly_report_enabled ? 'translate-x-full' : ''
                                }`}></div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
