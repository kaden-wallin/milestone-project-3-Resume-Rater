import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dropzone from 'react-dropzone'

const ResumeUploader = ({ user })  => {
    const [file, setFile] = useState(null)
    const navigate = useNavigate()

    const handleFileDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('resume', file)

        try {
            const response = await axios.post("http://localhost:5000/upload-resume", formData, {
                headers: { 'Content-Type': 'mulipart/form-data' }
            })
            console.log(response.data)
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Dropzone onDrop={handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag and drop a your resume file here or click to select a file</p>
                    </div>
                )}
            </Dropzone>
            <button type='submit' disabled={!file}>Upload Resume</button>
        </form>
    )
}

export default ResumeUploader