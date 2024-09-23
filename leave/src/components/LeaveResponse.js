import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function LeaveResponse() {
  const [message, setMessage] = useState('');
  const location = useLocation();


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const response = queryParams.get('response');
    const userName = queryParams.get('name');

    if (response && userName) {
      if (response === 'accepted') {
        setMessage(`Leave request accepted by ${userName}.`);
      } else if (response === 'declined') {
        setMessage(`Leave request declined by ${userName}.`);
      }
    } else {
      setMessage('Invalid response or missing information.');
    }
  }, [location.search]);

  return (
    <div>
      <center>
      <h2>Leave Request Response</h2>
      <p>{message}</p>
      </center>
    </div>
  );
}

export default LeaveResponse;


