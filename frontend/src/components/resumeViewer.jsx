import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResumesTable() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/resumes/<int:resume_id>`)
      .then(response => setResumes(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Filename</th>
          <th>Uploaded By</th>
        </tr>
      </thead>
      <tbody>
        {resumes.map(resume => (
          <tr key={resume.resume_id}>
            <td>{resume.resume_id}</td>
            <td>{resume.filename}</td>
            <td>{resume.user.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResumesTable;