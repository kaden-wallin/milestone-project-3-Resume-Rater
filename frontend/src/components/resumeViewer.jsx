import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import  DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import axios from 'axios'

function ViewResume() {
  const { resumeId } = useParams()
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(true)

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
    </div>
  )
}

export default ViewResume