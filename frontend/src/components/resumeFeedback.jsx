import React, { useState } from 'react'
import axios from 'axios'

function ResumeSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:5000/search', { params: { term: searchTerm }})
      setSearchResults(response.data)
      setSelectedResume(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleResumeClick = async (resumeId) => {
    try {
      const resumeResponse = await axios.get(`http://localhost:5000/resumes/${resumeId}`)
      const commentsResponse = await axios.get(`http://localhost:5000/resumes/${resumeId}/comments`)
      const comments = commentsResponse.data.comments
      const ratingsResponse = await axios.get(`http://localhost:5000/resumes/${resumeId}/ratings`)
      const ratings = ratingsResponse.data.ratings
      const resumeBlob = new Blob([resumeResponse.data], { type: 'application/pdf' })
      const resumeUrl = URL.createObjectURL(resumeBlob)
      setSearchResults([])
      setSelectedResume({ id: resumeId, url: resumeUrl, comments: comments, ratings: ratings })
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
      {selectedResume &&
        <div>
          <object data={selectedResume.url} type="application/pdf" width="100%" height="800px">
            <p>Resume failed to load</p>
          </object>
          <ResumeFeedback resumeId={selectedResume.id} comments={selectedResume.comments} ratings={selectedResume.ratings} />
        </div>
      }
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

function ResumeFeedback({ resumeId }) {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState('')

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleRatingChange = (e) => {
    setRating(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/resumes/${resumeId}/feedback`, { comment, rating })
      setComment('')
      setRating('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter comment" value={comment} onChange={handleCommentChange} />
        <input type="number" placeholder="Enter rating" value={rating} onChange={handleRatingChange} />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  )
}

export default ResumeSearch
