// api
import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

interface IAuth{
  register: (user: Object) => Promise<void>;
}

export default function useAuth(): IAuth {

  const {setFlashMessage} = useFlashMessage();

  async function register(user: Object) {

    let msgText = 'Cadastro realizado com sucesso!';
    let msgType = 'success';

    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });

      console.log(data);
    } catch (err: any) {
      msgText = err.response.data.message;
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType);
  }

  return { register };
}
