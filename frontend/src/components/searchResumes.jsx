import React, { useEffect, useState } from 'react'
import axios from 'axios'

function SearchResumes() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = (event) => {
        event.preventDefault()
        setLoading(true)
        axios
            .get(`http://localhost:5000/search-resumes?keyword=${searchTerm}`)
            .then(response => {
                setSearchResults(response.data.resumes)
                setLoading(false)
            })
            .catch(error => {
                console.error(`Fetch error: ${error}`)
                setLoading(false)
            })
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
                        <li key={resume.resume_id}>{resume.filename} ({resume.user.username})</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchResumes
