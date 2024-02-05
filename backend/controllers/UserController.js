"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const User_2 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//helpers
const create_user_token_1 = __importDefault(require("../helpers/create-user-token"));
const get_token_1 = __importDefault(require("../helpers/get-token"));
const get_user_by_token_1 = __importDefault(require("../helpers/get-user-by-token"));
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, password, confirmpassword } = req.body;
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
                    message: "Você está tentando enviar o tipo errado para o nome, precisa ser uma string",
                });
            }
            if (typeof email != "string") {
                res.status(422).json({
                    message: "Você está tentando enviar o tipo errado para o email, precisa ser uma string",
                });
            }
            if (typeof phone != "string") {
                res.status(422).json({
                    message: "Você está tentando enviar o tipo errado para o telefone, precisa ser uma string",
                });
            }
            if (typeof password != "string") {
                res.status(422).json({
                    message: "Você está tentando enviar o tipo errado para a sennha, precisa ser uma string",
                });
            }
            if (typeof confirmpassword != "string") {
                res.status(422).json({
                    message: "Você está tentando enviar o tipo errado para a confirmação de senha, precisa ser uma string",
                });
            }
            //check if user exists
            const userExists = yield User_1.default.findOne({ email: email });
            if (userExists) {
                res.status(422).json({ message: "O email já está em uso" });
                return;
            }
            //create a password
            const salt = yield bcrypt.genSalt(12);
            const passwordHash = yield bcrypt.hash(password, salt);
            //create a user
            const user = new User_2.default({
                name: name,
                email: email,
                phone: phone,
                password: passwordHash,
            });
            try {
                const newUser = yield user.save();
                yield (0, create_user_token_1.default)(newUser, req, res);
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const user = yield User_1.default.findOne({ email: email });
            if (!user) {
                res
                    .status(422)
                    .json({ message: "Não há usuário cadastrado com esse email!" });
                return;
            }
            //check if password match with dbpassword
            const checkPassword = yield bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(422).json({ message: "Senha inválida" });
            }
            yield (0, create_user_token_1.default)(user, req, res);
        });
    }
    static checkUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentUser;
            console.log(req.headers.authorization);
            if (req.headers.authorization) {
                const token = (0, get_token_1.default)(req);
                const decoded = jsonwebtoken_1.default.verify(token, "nossosecret");
                currentUser = yield User_2.default.findById(decoded.id);
                currentUser.password = "";
            }
            else {
                currentUser = {};
            }
            return res.status(200).send(currentUser);
        });
    }
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield User_2.default.findById(id).select("-password");
            if (!user) {
                return res.status(422).json({
                    message: "Usuário não encontrado",
                });
            }
            return res.status(200).json({ user });
        });
    }
    static editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, password, confirmpassword } = req.body;
            //check if user exists
            const token = yield (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            if (req.file) {
                user.image = req.file.filename;
            }
            if (!name) {
                return res.status(422).json({ message: "O nome é obrigatório" });
            }
            user.name = name;
            if (!email) {
                return res.status(422).json({ message: "O email é obrigatório" });
            }
            const userExists = yield User_1.default.findOne({ email: email });
            //check if user exists
            if (!user) {
                return res.status(422).json({ message: "Usuário não encontrado" });
            }
            //check if email has already taken
            if (user.email !== email && userExists) {
                return res.status(422).json({
                    message: "O email já está em uso por outro usuário, utilize um outro email.",
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
            }
            else if (password === confirmpassword && password != null) {
                //create a password
                const salt = yield bcrypt.genSalt(12);
                const passwordHash = yield bcrypt.hash(password, salt);
                user.password = passwordHash;
            }
            try {
                //returns user updated date
                const updatedUser = yield User_2.default.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                res.status(200).json({ message: "Usuário atualizado com sucesso!" });
            }
            catch (error) {
                return res.status(500).json({ message: error });
            }
        });
    }
}
exports.default = UserController;
