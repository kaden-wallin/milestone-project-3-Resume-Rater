import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileViewer from 'react-file-viewer';
import CommentsAndRatings from './commentsAndRatings';
import axios from 'axios';
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
} from '../styles';

// This is where the comments/ratings and resumes are loaded. 
function ViewResume({ user }) {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(true);
    const [fileType, setFileType] = useState('');
    const [commentsAndRatings, setCommentsAndRatings] = useState([]);
    const navigate = useNavigate();

    const color = { color: 'rgb(47, 115, 182)' }
    const isMobile = IsMobile();

    const home = () => {
        navigate('/')
    };

    // These are the media query variables and function to set it
    const isAuthenticated = user && localStorage.getItem('access_token')

    const styles = isMobile ? containerStyles2 : containerStyles2M
    const button = isMobile ? buttonStyles : buttonStylesM
    const button2 = isMobile ? buttonStyles2 : buttonStyles2M
    const h1Top = isMobile ? h1StyleTop : h1StyleTopM
    const h1Bottom = isMobile ? h1StyleBottom : h1StyleBottomM

    useEffect(() => {
        axios.get(`https://rottenresumes.pythonanywhere.com/api/download-resume/${resumeId}`)
            .then((resumeResponse) => {
                const html = resumeResponse.data
                const parser = new DOMParser();
                const file = parser.parseFromString(html, 'text/html');
                const iframe = file.querySelector('iframe');
                iframe.src = iframe.dataset.src;
                setFileType('resume');
            })
            .catch((error) => {
                console.error(error)
            });

        axios.get(`https://rottenresumes.pythonanywhere.com/api/comments-and-ratings/${resumeId}`)
            .then((commentsResponse) => {
                const { comments, ratings, usernames } = commentsResponse.data
                const commentsAndRatings = comments.map((comment, index) => ({
                    comment,
                    rating: ratings[index],
                    username: usernames[index],
                }))
                setCommentsAndRatings(commentsAndRatings)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [resumeId]);

    // This is certainly not the most effective way I could have implemented this conditional statment but it was like 2 or 3am and I didn't want to change it because I was proud it worked while I coded it that tired
    return (
        <div style={styles}>
            {isAuthenticated ? (
                <div>
                    {loading && <p style={letteringStyle}>Loading...</p>}
                    {!loading && (
                        <div>
                            <iframe title='Resume' width='100%' height='600px' src='' />
                        </div>
                    )};
                    <div>
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
                        )};
                    </div>
                </div>
            ) : (
                <div>
                    {loading && <p style={letteringStyle}>Loading...</p>}
                    {!loading && (
                        <div>
                            <iframe title='Resume' width='100%' height='600px' src='' />
                        </div>
                    )};
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
                    )};
                </div>
            )};
        </div>
    );
};

export default ViewResume;
