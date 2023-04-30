import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { letteringStyle, buttonStyles, resultStyles, listStyles, buttonStyles2 } from './styles'

function SearchResumes() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [noResults, setNoResults] = useState(false)

    const handleSearch = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:5000/search-resumes?keyword=${searchTerm}`)
            setSearchResults(response.data.resumes)
            setLoading(false)
            setNoResults(response.data.resumes.length === 0)
        } catch (error) {
            console.error(`Fetch error: ${error}`)
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input style={buttonStyles} type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
                <button style={buttonStyles2} type="submit">Search</button>
            </form>
            {loading && <p style={letteringStyle}>Loading...</p>}
            {searchResults === undefined && <p style={letteringStyle}>No Matching resumes found</p>}
            {!loading && searchResults && searchResults.length === 0}
            {!loading && searchResults && searchResults.length > 0 && (
                <ul style={listStyles}>
                    {searchResults.map(resume => (
                        <li key={resume.resume_id}>
                            <button style={resultStyles} onClick={() => navigate(`/resumes/${resume.resume_id}`)}>
                                {resume.filename}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchResumes