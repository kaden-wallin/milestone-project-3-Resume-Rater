import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getData = async () => {
  const response = await axios.get('/api/data');
  return response.data;
};

const App = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getData().then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Hello, {data.name}!</h1>
      <p>You are {data.age} years old.</p>
    </div>
  );
};

export default App;
