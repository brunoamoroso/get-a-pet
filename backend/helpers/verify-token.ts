import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import getToken from "./get-token";

interface reqUser extends Request{
    user?: string | JwtPayload;
}

//middeware to validate token
const verifyToken = (req: reqUser, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try{
    const verified = jwt.verify(token, 'nossosecret');
    req.user = verified;
    next();
  }catch(e){
    return res.status(400).json({ message: "Token Inválido!" });
  }
};

export default verifyToken;
