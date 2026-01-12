"use client";
import React, { useState } from "react";

function NotepadModal({ isVisible, questionNumber, questionTitle, existingNote, onClose, onSave }) {
  const [noteText, setNoteText] = useState(existingNote || '');
  
  if (!isVisible) return null;
  
  const handleSave = () => {
    onSave(questionNumber, noteText);
    onClose();
  };
  
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-neutral-700 h-[600px] w-[1200px] max-w-[90vw] max-h-[90vh] rounded-lg p-6'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h3 className='text-white font-bold text-lg'>Save Notes</h3>
            <p className='text-neutral-300 text-sm'>Add quick notes for "{questionTitle}"</p>
          </div>
          <button onClick={onClose} className='text-white hover:text-red-400 text-xl'>✕</button>
        </div>
        <textarea 
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className='w-full h-96 bg-black border border-neutral-500/50 focus:border-[#0340aa] rounded-xl p-4 text-white resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#0340aa] scrollbar-track-neutral-800' 
          placeholder='Write your notes here...'
        />
        <div className='flex gap-3 mt-4'>
          <button onClick={handleSave} className='bg-[#0340aa] hover:bg-[#0340aa]/80 px-6 py-3 rounded-lg text-white font-semibold'>Save Note</button>
          <button onClick={onClose} className='bg-neutral-600 hover:bg-neutral-500 px-6 py-3 rounded-lg text-white font-semibold'>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default NotepadModal;