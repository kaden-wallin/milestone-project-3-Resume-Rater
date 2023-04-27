import React, { useState } from 'react'
import axios from 'axios'

function ResumeSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:5000/search', { params: { term: searchTerm }})
      setSearchResults(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleResumeClick = async (resumeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/resumes/${resumeId}`)
      const resumeBlob = new Blob([response.data], { type: 'application/pdf' })
      const resumeUrl = URL.createObjectURL(resumeBlob)
      window.open(resumeUrl)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Search resumes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchResults.map((result) => (
          <li key={result.resume_id} onClick={() => handleResumeClick(result.resume_id)}>
            {result.resume}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ResumeSearch

