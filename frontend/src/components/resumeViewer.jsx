import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FileViewer from 'react-file-viewer'
import CommentsAndRatings from './commentsAndRatings'
import axios from 'axios'

function ViewResume({ user }) {
    const { resumeId } = useParams()
    const [fileUrl, setFileUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fileType, setFileType] = useState('')
    const [comments, setComments] = useState([])
    const [ratings, setRatings] = useState([])
    const navigate = useNavigate()

    const home = () => {
        navigate('/')
    }

    const isAuthenticated = user && localStorage.getItem("access_token")

    useEffect(() => {
        axios
            .get(`http://localhost:5000/download-resume/${resumeId}`)
            .then((response) => {
                const file = response.data;
                const binaryString = window.atob(file.url.split(',')[1]);
                const bytes = new Uint8Array(binaryString.length)
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i)
                }
                const blob = new Blob([bytes], { type: 'application/octet-stream' })
                const url = URL.createObjectURL(blob)
                setFileUrl(url)
                setLoading(false)
                const extension = file.filename.split('.').pop().toLowerCase()
                switch (extension) {
                    case 'pdf':
                        setFileType('pdf')
                        break;
                    case 'doc':
                    case 'docx':
                        setFileType('docx')
                        break;
                    case 'txt':
                        setFileType('txt')
                        break;
                    default:
                        setFileType('')
                }
            })
            .catch((error) => {
                console.error(`Fetch error: ${error}`)
            })
    }, [resumeId])

    useEffect(() => {
        axios
            .get(`http://localhost:5000/comments-and-ratings/${resumeId}`)
            .then((response) => {
                setComments(response.data.comments)
                setRatings(response.data.ratings)
            })
            .catch((error) => {
                console.error(`Fetch error: ${error}`)
            })
    }, [resumeId])

    const CustomErrorComponent = ({ error }) => {
        const message =
            error && error.message ? error.message : 'Failed to load file'
        return <div>{message}</div>
    };

    return (
        <>
            {isAuthenticated ? (
                <div>
                    {loading && <p>Loading...</p>}
                    {!loading && fileType && (
                        <FileViewer
                            fileType={fileType}
                            filePath={fileUrl}
                            errorComponent={CustomErrorComponent}
                        />
                    )}
                    {!loading && !fileType && <p>Unsupported file type</p>}
                    <CommentsAndRatings resumeId={resumeId} />
                    <div>
                        {comments.map((comment, index) => (
                            <span key={index}>
                                {comment} - {ratings[index]} stars
                            </span>
                        ))}
                    </div>
                    <button onClick={home}>Back</button>
                </div>
            ) : (
                <div>
                    {loading && <p>Loading...</p>}
                    {!loading && fileType && (
                        <FileViewer
                            fileType={fileType}
                            filePath={fileUrl}
                            errorComponent={CustomErrorComponent}
                        />
                    )}
                    {!loading && !fileType && <p>Unsupported file type</p>}
                    <div>
                        {comments.map((comment, index) => (
                            <span key={index}>
                                {comment} - {ratings[index]} stars
                            </span>
                        ))}
                    </div>
                    <button onClick={home}>Back</button>
                </div>
            )}
        </>
    )
}

export default ViewResume
