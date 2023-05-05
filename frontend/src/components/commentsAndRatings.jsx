import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import setAuthToken from './setAuthToken'
import IsMobile,
{
    buttonStyles,
    buttonStylesM,
    letteringStyle,
    placeHolderStyles,
    placeHolderStylesM
} from '../styles';

// This function lets authenticated users comment and rate a resume
function CommentsAndRatings({ resumeId }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    const handleCommentChange = (event) => {
        setComment(event.target.value)
    };

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value))
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        setAuthToken(localStorage.getItem('access_token'))

        axios.post('https://rottenresumes.pythonanywhere.com/api/comments-and-ratings', {
            comment: comment,
            rating: rating,
            resumeId: resumeId
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit comment and rating')
                }
                setComment('')
                setRating(0)
            })
            .catch(error => {
                console.error(error)
            })
        navigate(`/resumes/${resumeId}`)
    };

// These are the media query variables and function to set it
    const isMobile = IsMobile();

    const button = isMobile ? buttonStyles : buttonStylesM
    const placeHolder = isMobile ? placeHolderStyles : placeHolderStylesM

// Not sure the way I set up rating was all that efficent but I am pretty proud of how more DRY it was than what I first had
    return (
        <div style={{ textAlign: 'center' }}>
            <form style={letteringStyle} onSubmit={handleSubmit}>
                <label>
                    Comment:
                    <input type='text' style={placeHolder} value={comment} onChange={handleCommentChange} />
                </label>
                <br></br>
                <label>
                    Rating:
                    <select style={button} value={rating} onChange={handleRatingChange}>
                        <option value='0'>Select a rating</option>
                        {[...Array(5)].map((_, index) => (
                            <option key={index} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </label>
                <button style={button} type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default CommentsAndRatings;
