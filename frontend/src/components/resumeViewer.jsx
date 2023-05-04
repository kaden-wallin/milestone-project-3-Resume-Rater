import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FileViewer from 'react-file-viewer'
import CommentsAndRatings from './commentsAndRatings'
import axios from 'axios'
import IsMobile, { 
    spaceStyles, 
    containerStyles2M, 
    containerStyles2, 
    buttonStyles,
    buttonStyles2,
    buttonStylesM,
    buttonStyles2M,
    h1StyleTop,
    h1StyleTopM,
    h1StyleBottom,
    h1StyleBottomM,
    letteringStyle,
} from '../styles'

function ViewResume({ user }) {
    const { resumeId } = useParams()
    const [fileUrl, setFileUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fileType, setFileType] = useState('')
    const [commentsAndRatings, setCommentsAndRatings] = useState([])
    const navigate = useNavigate()

    const color = {color: 'rgb(47, 115, 182)'}
    const isMobile = IsMobile()

    const home = () => {
        navigate('/')
    }

    const isAuthenticated = user && localStorage.getItem("access_token")

    const styles = isMobile ? containerStyles2 : containerStyles2M
    const button = isMobile ? buttonStyles : buttonStylesM
    const button2 = isMobile ? buttonStyles2 : buttonStyles2M
    const h1Top = isMobile ? h1StyleTop : h1StyleTopM
    const h1Bottom = isMobile ? h1StyleBottom : h1StyleBottomM

    useEffect(() => {
        axios
            .get(`https://rottenresumes.pythonanywhere.com/api/download-resume/${resumeId}`)
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
            .get(`https://rottenresumes.pythonanywhere.com/api/comments-and-ratings/${resumeId}`)
            .then((response) => {
                const { comments, ratings, usernames } = response.data;
                const commentsAndRatings = comments.map((comment, index) => ({
                    comment,
                    rating: ratings[index],
                    username: usernames[index],
                }));
                setCommentsAndRatings(commentsAndRatings);
            })
            .catch((error) => {
                console.error(`Fetch error: ${error}`);
            });
    }, [resumeId])

    const CustomErrorComponent = ({ error }) => {
        const message = error && error.message ? error.message : 'Failed to load file'
        return <div>{message}</div>
    };

    return (
        <div style={styles}>
            {isAuthenticated ? (
                <div>
                    {loading && <p style={letteringStyle}>Loading...</p>}
                    {!loading && fileType && (
                        <div>
                            <FileViewer
                                fileType={fileType}
                                filePath={fileUrl}
                                errorComponent={CustomErrorComponent}
                            />
                        </div>
                    )}
                    {!loading && !fileType && <p>Unsupported file type</p>}
                    <CommentsAndRatings resumeId={resumeId} />
                    {commentsAndRatings.length === 0 ? (
                        <div>
                            <p style={letteringStyle}>No comments or ratings to display</p>
                            <button style={button2} onClick={home}>Back</button>
                        </div>
                    ) : (
                        <div style={spaceStyles}>
                            <h1 style={h1Top}>Comments</h1>
                            <h1 style={h1Bottom}>and Ratings</h1>
                            {commentsAndRatings.map(({ comment, rating, username }, index) => (
                                <span key={index} style={button}>
                                    {comment} <span style={color}>-</span> {rating} star(s) says <span style={color}>{username}</span>
                                </span>
                            ))}
                            <button style={button2} onClick={home}>Back</button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {loading && <p style={letteringStyle}>Loading...</p>}
                    {!loading && fileType && (
                        <div>
                            <FileViewer
                                fileType={fileType}
                                filePath={fileUrl}
                                errorComponent={CustomErrorComponent}
                            />
                        </div>
                    )}
                    {!loading && !fileType && <p>Unsupported file type</p>}
                    {commentsAndRatings.length === 0 ? (
                        <div>
                            <p style={letteringStyle}>No comments or ratings to display</p>
                            <button style={button2} onClick={home}>Back</button>
                        </div>
                    ) : (
                        <div style={spaceStyles}>
                            <h1 style={h1Top}>Comments</h1>
                            <h1 style={h1Bottom}>and Ratings</h1>
                            {commentsAndRatings.map(({ comment, rating, username }, index) => (
                                <span key={index} style={button}>
                                    {comment} <span style={color}>-</span> {rating} star(s) says <span style={color}>{username}</span>
                                </span>
                            ))}
                            <button style={button2} onClick={home}>Back</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ViewResume
