import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileViewer from 'react-file-viewer';
import axios from 'axios';

function ViewResume() {
    const { resumeId } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileType, setFileType] = useState('');
    const navigate = useNavigate();

    const home = () => {
        navigate('/');
    };

    useEffect(() => {
        axios
            .get(`http://localhost:5000/download-resume/${resumeId}`)
            .then((response) => {
                const file = response.data;
                const binaryString = window.atob(file.url.split(',')[1]);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
                setLoading(false);
                const extension = file.filename.split('.').pop().toLowerCase();
                switch (extension) {
                    case 'pdf':
                        setFileType('pdf');
                        break;
                    case 'doc':
                    case 'docx':
                        setFileType('docx');
                        break;
                    case 'txt':
                        setFileType('txt');
                        break;
                    default:
                        setFileType('');
                }
            })
            .catch((error) => {
                console.error(`Fetch error: ${error}`);
            });
    }, [resumeId]);

    const CustomErrorComponent = ({ error }) => {
        const message =
            error && error.message ? error.message : 'Failed to load file';
        return <div>{message}</div>;
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {!loading && fileType && (
                <FileViewer
                    fileType={fileType}
                    filePath={fileUrl}
                    errorComponent={CustomErrorComponent}
                />
            )}
            {!loading && !fileType && <p>Unsupported file type</p>}
            <button onClick={home}>Back</button>
        </div>
    );
}

export default ViewResume;
