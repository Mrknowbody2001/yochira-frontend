import React from 'react'
import {  useNavigate } from 'react-router-dom'

const SOReceiveNoteList = () => {
    const Navigate = useNavigate();
  return (
    <div>
    <div>SOReceiveNoteList</div>
    <button
          onClick={() => Navigate("/dashboard?tab=ApprovedSOList")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
        </div>
  )
}

export default SOReceiveNoteList