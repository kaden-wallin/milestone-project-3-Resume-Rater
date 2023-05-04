import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import IsMobile, { 
    letteringStyle,  
    resultStyles, 
    listStyles, 
    buttonStyles2,
    buttonStyles2M,
    placeHolderStyles,
    placeHolderStylesM,
    containerStyles 
} from '../styles'

// As stated in the home component this is where the results are actually set to display and them I imported it to home
function SearchResumes() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await axios.get(`https://rottenresumes.pythonanywhere.com/api/search-resumes?keyword=${searchTerm}`)
            setSearchResults(response.data.resumes)
            setLoading(false)
        } catch (error) {
            console.error(`Fetch error: ${error}`)
            setLoading(false)
        }
    }

// These are the media query variables and function to set it
    const isMobile = IsMobile()

    const placeHolder = isMobile ? placeHolderStyles : placeHolderStylesM
    const button = isMobile ? buttonStyles2 : buttonStyles2M

// I needed to add conditional expressions because it took so long to load and then wouldn't give you any indication that your search came up with no results otherwise
    return (
        <div style={containerStyles}>
            <form onSubmit={handleSearch}>
                <input style={placeHolder} placeholder="Find keywords in resumes" type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
                <button style={button} type="submit">Search</button>
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
