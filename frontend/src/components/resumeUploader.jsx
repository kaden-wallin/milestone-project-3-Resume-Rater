import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import setAuthToken from './setAuthToken'

const ResumeUploader = ({ user }) => {
  const [file, setFile] = useState(null)
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
        'http://localhost:5000/upload-resume',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      console.log(response.data)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const home = () => {
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Upload a Resume</h1>
      <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>
              Drag and drop your resume file here or click to select a file (only pdf, doc, and docx types supported)
            </p>
            {file && <p>Selected file: {file.name}</p>}
          </div>
        )}
      </Dropzone>
      <button type="submit" disabled={!file}>
        Upload Resume
      </button>
      <button onClick={home}>Back</button>
    </form>
  )
}

export default ResumeUploader