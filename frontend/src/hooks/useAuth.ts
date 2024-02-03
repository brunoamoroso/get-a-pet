// api
import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

interface IAuth{
  register: (user: Object) => Promise<void>;
  authenticated: boolean;
  logout(): any; 
}

export default function useAuth(): IAuth {

  const {setFlashMessage} = useFlashMessage();
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []); 

  async function register(user: Object) {

    let msgText = 'Cadastro realizado com sucesso!';
    let msgType = 'success';

    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (err: any) {
      msgText = err.response.data.message;
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data: any) {
    setAuthenticated(true);
    localStorage.setItem('token', JSON.stringify(data.token));
    navigate('/');
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!';
    const msgType = 'success';

    setAuthenticated(false);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = null;
    navigate('/');
    setFlashMessage(msgText, msgType);
  }

  return { register, authenticated, logout };
}
