import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import setAuthToken from './setAuthToken'
import { buttonStyles, buttonStylesCR } from './styles';

function CommentsAndRatings({ resumeId }) {
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const navigate = useNavigate()

    const handleCommentChange = (event) => {
        setComment(event.target.value)
    };

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value))
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        setAuthToken(localStorage.getItem('access_token'))

        axios.post('http://localhost:5000/comments-and-ratings', {
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
            navigate('/')
    }

    return (
        <div>
            <form style={buttonStylesCR} onSubmit={handleSubmit}>
                <label>
                    Comment:
                    <input type="text" style={buttonStyles} value={comment} onChange={handleCommentChange} />
                </label>
                <br></br>
                <label>
                    Rating:
                    <select style={buttonStyles} value={rating} onChange={handleRatingChange}>
                        <option value="0">Select a rating</option>
                        {[...Array(5)].map((_, index) => (
                            <option key={index} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </label>
                <button style={buttonStyles} type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CommentsAndRatings;
