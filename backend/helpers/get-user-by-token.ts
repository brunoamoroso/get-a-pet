import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

//get user by jwt
const getUserByToken = async (token: string) => {

    if(!token){
        console.log("Acesso negado");
        return;
    }

  const decoded = jwt.verify(token, "nossosecret") as JwtPayload;
  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

export default getUserByToken;
