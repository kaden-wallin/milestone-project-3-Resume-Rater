import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from './setAuthToken'

const Resumes = () => {
  const [resumes, setResumes] = useState([]);

  setAuthToken(localStorage.getItem('access_token'))

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/resumes');
        setResumes(res.data.resumes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div>
      <h2>Resumes</h2>
      <ul>
        {resumes.map((resume) => (
          <li key={resume.resume_id}>
            <a href={`/resumes/${resume.resume_id}`}>{resume.filename}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Resumes;