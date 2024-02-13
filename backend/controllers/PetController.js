"use strict";
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
const Pet_1 = __importDefault(require("../models/Pet"));
const mongoose_1 = __importDefault(require("mongoose"));
//helpers
const get_token_1 = __importDefault(require("../helpers/get-token"));
const get_user_by_token_1 = __importDefault(require("../helpers/get-user-by-token"));
class PetController {
    //create a pet
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, age, weight, color, avaiable = true } = req.body;
            //images upload
            const images = req.files;
            //validation
            if (!name) {
                return res.status(422).json({ message: "O nome é obrigatório" });
            }
            if (!age) {
                return res.status(422).json({ message: "A idade é obrigatória" });
            }
            if (!weight) {
                return res.status(422).json({ message: "O peso é obrigatório" });
            }
            if (!color) {
                return res.status(422).json({ message: "A cor é obrigatória" });
            }
            if (!images) {
                return res.status(422).json({ message: "As imagens são obrigatórias" });
            }
            //get pet owner
            const token = (0, get_token_1.default)(req);
            const user = (yield (0, get_user_by_token_1.default)(token));
            //create a pet
            const pet = new Pet_1.default({
                name,
                age,
                weight,
                color,
                avaiable,
                images: [],
                user: {
                    _id: user._id,
                    name: user.name,
                    image: user === null || user === void 0 ? void 0 : user.image,
                    phone: user.phone,
                },
            });
            if (images.length === 0) {
                res.status(422).json({ message: "A imagem é obrigatória" });
            }
            images.map((image) => {
                pet.images.push(image.filename);
            });
            try {
                const newPet = yield pet.save();
                return res
                    .status(201)
                    .json({ message: "Pet cadastrado com sucesso!", newPet });
            }
            catch (err) {
                return res.status(500).json({ message: err });
            }
            // return res.status(200).json({message: "deu certo"});
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pets = yield Pet_1.default.find().sort("-createdAt");
            return res.status(200).json({ pets: pets });
        });
    }
    static getAllUserPets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //get user from token
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            const pets = yield Pet_1.default.find({ "user._id": user._id }).sort("-createdAt");
            return res.status(200).json({ pets });
        });
    }
    static getAllUserAdoptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //get user from token
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            const pets = yield Pet_1.default.find({ "adopter._id": user._id }).sort("-createdAt");
            return res.status(200).json({ pets });
        });
    }
    static getPetById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(422).json({ message: "ID Inválido!" });
            }
            const pet = yield Pet_1.default.findOne({ _id: id });
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado" });
            }
            return res.status(200).json({ pet: pet });
        });
    }
    static removePetById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(422).json({ message: "ID Inválido!" });
            }
            const pet = yield Pet_1.default.findOne({ _id: id });
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado" });
            }
            //check if logged in uyser registered the pet
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            if (pet.user._id.toString() !== user._id.toString()) {
                return res.status(422).json({
                    messsage: "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
                });
            }
            yield Pet_1.default.findByIdAndRemove(id);
            return res.status(200).json({ message: "Pet removido com sucesso!" });
        });
    }
    static updatePet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { name, age, weight, color, avaiable } = req.body;
            //images upload
            const images = req.files;
            const updatedData = {
                name: "",
                age: 0,
                weight: 0,
                color: "",
                avaiable: true,
            };
            const pet = yield Pet_1.default.findOne({ _id: id });
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado" });
            }
            //check if logged in uyser registered the pet
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            if (pet.user._id.toString() !== user._id.toString()) {
                return res.status(422).json({
                    messsage: "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
                });
            }
            //validation
            if (!name) {
                return res.status(422).json({ message: "O nome é obrigatório" });
            }
            updatedData.name = name;
            if (!age) {
                return res.status(422).json({ message: "A idade é obrigatória" });
            }
            updatedData.age = age;
            if (!weight) {
                return res.status(422).json({ message: "O peso é obrigatório" });
            }
            updatedData.weight = weight;
            if (!color) {
                return res.status(422).json({ message: "A cor é obrigatória" });
            }
            updatedData.color = color;
            if (images.length > 0) {
                updatedData.images = [];
                images.map((image) => {
                    var _a;
                    (_a = updatedData.images) === null || _a === void 0 ? void 0 : _a.push(image.filename);
                });
            }
            yield Pet_1.default.findByIdAndUpdate(id, updatedData);
            return res.status(200).json({ message: "Pet atualizado com sucesso!" });
        });
    }
    static schedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            //check if pet exists
            const pet = yield Pet_1.default.findOne({ _id: id });
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado" });
            }
            //check if logged in user registered the pet
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            if (pet.user._id.equals(user._id)) {
                return res.status(422).json({
                    messsage: "Você não pode agendar uma visita com seu próprio pet!",
                });
            }
            //check if user has already scheduled a visit
            if (pet.adopter) {
                if (pet.adopter._id.equals(user._id)) {
                    return res
                        .status(422)
                        .json({ message: "Você já agendou uma visita para este Pet!" });
                }
            }
            //add user to pet
            pet.adopter = {
                _id: user._id,
                name: user.name,
                image: user === null || user === void 0 ? void 0 : user.image,
            };
            yield Pet_1.default.findByIdAndUpdate(id, pet);
            return res
                .status(200)
                .json({
                message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
            });
        });
    }
    static concludeAdoption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            //check if pet exists
            const pet = yield Pet_1.default.findOne({ _id: id });
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado" });
            }
            //check if logged in user registered the pet
            const token = (0, get_token_1.default)(req);
            const user = yield (0, get_user_by_token_1.default)(token);
            if (pet.user._id.toString() !== user._id.toString()) {
                return res.status(422).json({
                    messsage: "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
                });
            }
            pet.avaiable = false;
            yield Pet_1.default.findByIdAndUpdate(id, pet);
            return res.status(200).json({ message: "Parabéns o ciclo de adoção foi finalizado com sucesso!" });
        });
    }
}
exports.default = PetController;
