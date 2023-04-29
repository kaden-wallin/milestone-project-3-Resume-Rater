import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function SearchResumes() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:5000/search-resumes?keyword=${searchTerm}`)
            setSearchResults(response.data.resumes)
            setLoading(false)
        } catch (error) {
            console.error(`Fetch error: ${error}`)
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
                <button type="submit">Search</button>
            </form>
            {loading && <p>Loading...</p>}
            {!loading && searchResults.length === 0 && <p>No matching resumes found</p>}
            {!loading && searchResults.length > 0 && (
                <ul>
                    {searchResults.map(resume => (
                        <li key={resume.resume_id}>
                            <button onClick={() => navigate(`/resumes/${resume.resume_id}`)}>
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