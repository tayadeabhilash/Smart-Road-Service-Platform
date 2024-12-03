import { useState } from 'react';

function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    return JSON.parse(tokenString);
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    setToken: saveToken,
    removeToken,
    token
  };
}

export default useToken;