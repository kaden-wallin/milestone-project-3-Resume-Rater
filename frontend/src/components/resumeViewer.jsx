import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import  DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import axios from 'axios'

function ViewResume() {
  const { resumeId } = useParams()
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const home = () => {
    navigate('/')
}

  useEffect(() => {
    axios
      .get(`http://localhost:5000/download-resume/${resumeId}`)
      .then(response => {
        setFileUrl(response.data.url)
        setLoading(false)
      })
      .catch(error => {
        console.error(`Fetch error: ${error}`)
      })
  }, [resumeId])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <DocViewer
          documents={[{ uri: fileUrl, fileName: 'Resume.pdf' }]}
          pluginRenderers={DocViewerRenderers}
        />
      )}
      <button onClick={home}>Back</button>
    </div>
  )
}

export default ViewResume