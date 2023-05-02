import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import setAuthToken from './setAuthToken'
import { 
	uploadStyle, 
	buttonStyles, 
	letteringStyle, 
	containerStyles, 
	titleStyleTop, 
	titleStyleBottom, 
	errorStyle 
} from '../styles'

const ResumeUploader = ({ user }) => {
	const [file, setFile] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	const navigate = useNavigate()

	const handleFileDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0])
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		setAuthToken(localStorage.getItem('access_token'))

		if (!file) {
			return
		}

		const formData = new FormData()
		formData.append('resume', file)

		try {
			const response = await axios.post(
				'rottenresumes.pythonanywhere.com/api/upload-resume',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			)
			console.log(response.data)
			navigate('/')
		} catch (error) {
			setErrorMessage('Invalid file type')
		}
	}

	const home = () => {
		navigate('/')
	}

	return (
		<form style={containerStyles} onSubmit={handleSubmit}>
			<h1 style={titleStyleTop}>Upload </h1>
			<h1 style={titleStyleBottom}>a Resume</h1>
			<Dropzone onDrop={handleFileDrop}>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<p style={uploadStyle}>
							Drag and drop your resume file here or click to select a file (only pdf, doc, and docx types supported)
						</p>
						{errorMessage && <p style={errorStyle}>{errorMessage}</p>}
						{file && <p style={letteringStyle} >Selected file: {file.name}</p>}
					</div>
				)}
			</Dropzone>
			<button style={buttonStyles} type="submit" disabled={!file}>
				Upload Resume
			</button>
			<button style={buttonStyles} onClick={home}>Back</button>
		</form>
	)
}

export default ResumeUploader