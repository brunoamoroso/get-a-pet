// api
import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IAuth{
  register: (user: Object) => Promise<void>;
}

export default function useAuth(): IAuth {
  async function register(user: Object) {
    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return { register };
}
