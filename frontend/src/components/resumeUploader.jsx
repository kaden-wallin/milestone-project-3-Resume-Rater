import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import setAuthToken from './setAuthToken';
import IsMobile, {
	uploadStyle,
	buttonStyles,
	buttonStylesM,
	buttonStyles2,
	buttonStyles2M,
	letteringStyle,
	containerStyles,
	h1StyleTop,
	h1StyleBottom,
	h1StyleTopM,
	h1StyleBottomM,
	errorStyle
} from '../styles';

// This is where the resume file is sent to the backend
const ResumeUploader = () => {
	const [file, setFile] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const navigate = useNavigate();

	const handleFileDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0])
	};

	const handleSubmit = async (event) => {
		event.preventDefault()

		setAuthToken(localStorage.getItem('access_token'))

		if (!file) {
			return
		};

		const formData = new FormData()
		formData.append('resume', file)

		try {
			const response = await axios.post(
				'https://rottenresumes.pythonanywhere.com/api/upload-resume',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			)
			console.log(response.data)
			navigate('/')
		} catch (error) {
			setErrorMessage('Invalid file type')
		};
	};

	const home = () => {
		navigate('/')
	};

// These are the media query variables and function to set it
	const isMobile = IsMobile()

	const h1Top = isMobile ? h1StyleTop : h1StyleTopM
	const h1Bottom = isMobile ? h1StyleBottom : h1StyleBottomM
	const button = isMobile ? buttonStyles : buttonStylesM
	const button2 = isMobile ? buttonStyles2 : buttonStyles2M

	return (
		<form style={containerStyles} onSubmit={handleSubmit}>
			<h1 style={h1Top}>Upload </h1>
			<h1 style={h1Bottom}>a Resume</h1>
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
			<button style={button} type='submit' disabled={!file}>
				Upload Resume
			</button>
			<button style={button2} onClick={home}>Back</button>
		</form>
	);
};

export default ResumeUploader;
