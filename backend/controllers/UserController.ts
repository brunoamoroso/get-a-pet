import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import UserModel from "../models/User";
import User from "../models/User";
import jwt from "jsonwebtoken";

//helpers
import createUserToken from "../helpers/create-user-token";
import getToken from "../helpers/get-token";
import getUserByToken from "../helpers/get-user-by-token";

interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
}

interface JwtPayload {
  id: string;
}

export default class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, phone, password, confirmpassword }: IUser = req.body;

    let image = "";

    if (!name) {
      return res.status(422).json({ message: "O nome é obrigatório" });
    }

    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório" });
    }

    if (!phone) {
      return res.status(422).json({ message: "O telefone é obrigatório" });
    }

    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória" });
    }

    if (!confirmpassword) {
      return res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória" });
    }

    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ message: "A senha e a confirmação de senha não são iguais!" });
    }
    //type guard
    if (typeof name != "string") {
      res.status(422).json({
        message:
          "Você está tentando enviar o tipo errado para o nome, precisa ser uma string",
      });
    }

    if (typeof email != "string") {
      res.status(422).json({
        message:
          "Você está tentando enviar o tipo errado para o email, precisa ser uma string",
      });
    }

    if (typeof phone != "string") {
      res.status(422).json({
        message:
          "Você está tentando enviar o tipo errado para o telefone, precisa ser uma string",
      });
    }

    if (typeof password != "string") {
      res.status(422).json({
        message:
          "Você está tentando enviar o tipo errado para a sennha, precisa ser uma string",
      });
    }

    if (typeof confirmpassword != "string") {
      res.status(422).json({
        message:
          "Você está tentando enviar o tipo errado para a confirmação de senha, precisa ser uma string",
      });
    }

    //check if user exists
    const userExists = await UserModel.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "O email já está em uso" });
      return;
    }

    //create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a user
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    //check if user exists
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      res
        .status(422)
        .json({ message: "Não há usuário cadastrado com esse email!" });
      return;
    }

    //check if password match with dbpassword
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }
    

    await createUserToken(user, req, res);
  }

  static async checkUser(req: Request, res: Response) {
    let currentUser;

    console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret") as JwtPayload;

      currentUser = await User.findById(decoded.id);
      currentUser!.password = "";
    } else {
      currentUser = {};
    }

    return res.status(200).send(currentUser);
  }

  static async getUserById(req: Request, res: Response) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(422).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({ user });
  }

  static async editUser(req: Request, res: Response) {
    const { name, email, phone, password, confirmpassword } = req.body;

    //check if user exists
    const token = await getToken(req);
    const user = await getUserByToken(token);

    if (req.file) {
      user!.image = req.file.filename;
    }

    if (!name) {
      return res.status(422).json({ message: "O nome é obrigatório" });
    }

    user!.name = name;

    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório" });
    }

    const userExists = await UserModel.findOne({ email: email });

    //check if user exists
    if (!user) {
      return res.status(422).json({ message: "Usuário não encontrado" });
    }

    //check if email has already taken
    if (user.email !== email && userExists) {
      return res.status(422).json({
        message:
          "O email já está em uso por outro usuário, utilize um outro email.",
      });
    }

    user.email = email;

    if (!phone) {
      return res.status(422).json({ message: "O telefone é obrigatório" });
    }
    user.phone = phone;

    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória" });
    }

    if (!confirmpassword) {
      return res.status(422).json({ message: "A confirmação de senha é obrigatória" });
    }

    if (password !== confirmpassword) {
      return res.status(422).json({ message: "A senha e a confirmação de senha não são iguais!" });
    } else if (password === confirmpassword && password != null) {
      //create a password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    try {
      //returns user updated date
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
