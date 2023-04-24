import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getData = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

const App = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        console.log(result)
        setData(result);
      } catch (error) {
        setError('Error retrieving data');
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Hello, {data.username}!</h1>
      <p>Is this your email? {data.email}</p>
    </div>
  );
};

export default App;
