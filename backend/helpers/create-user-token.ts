import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const createUserToken = async (user: any, req: Request, res: Response) => {

    //create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    },
    "nossosecret");

    //return token
    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user._id,
    })
    
}

export default createUserToken;