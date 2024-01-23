import { Request, Response } from "express";
import Pet from "../models/Pet";
import mongoose from "mongoose";

//helpers
import getToken from "../helpers/get-token";
import getUserByToken from "../helpers/get-user-by-token";

interface IPet {
  name: string;
  age: number;
  weight: number;
  color: string;
  avaiable: boolean;
  images?: object[];
}

export default class PetController {
  //create a pet
  static async create(req: Request, res: Response) {
    const { name, age, weight, color, avaiable = true }: IPet = req.body;

    //images upload
    const images = req.files as [];

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
    const token = getToken(req);
    const user = (await getUserByToken(token)) as any;

    //create a pet
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      avaiable,
      images: [],
      user: {
        _id: user!._id,
        name: user!.name,
        image: user?.image,
        phone: user!.phone,
      },
    });

    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória" });
    }

    images.map((image: any) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      return res
        .status(201)
        .json({ message: "Pet cadastrado com sucesso!", newPet });
    } catch (err) {
      return res.status(500).json({ message: err });
    }

    // return res.status(200).json({message: "deu certo"});
  }

  static async getAll(req: Request, res: Response) {
    const pets = await Pet.find().sort("-createdAt");

    return res.status(200).json({ pets: pets });
  }

  static async getAllUserPets(req: Request, res: Response) {
    //get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user!._id }).sort("-createdAt");
    return res.status(200).json({ pets });
  }

  static async getAllUserAdoptions(req: Request, res: Response) {
    //get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user!._id }).sort(
      "-createdAt"
    );
    return res.status(200).json({ pets });
  }

  static async getPetById(req: Request, res: Response) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: "ID Inválido!" });
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    return res.status(200).json({ pet: pet });
  }

  static async removePetById(req: Request, res: Response) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: "ID Inválido!" });
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    //check if logged in uyser registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user!._id.toString()) {
      return res.status(422).json({
        messsage:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
    }

    await Pet.findByIdAndRemove(id);

    return res.status(200).json({ message: "Pet removido com sucesso!" });
  }

  static async updatePet(req: Request, res: Response) {
    const id = req.params.id;

    const { name, age, weight, color, avaiable }: IPet = req.body;

    //images upload
    const images = req.files as [];

    const updatedData: IPet = {
      name: "",
      age: 0,
      weight: 0,
      color: "",
      avaiable: true,
    };

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    //check if logged in uyser registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user!._id.toString()) {
      return res.status(422).json({
        messsage:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
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

    if (!images) {
      return res.status(422).json({ message: "As imagens são obrigatórias" });
    } else {
      updatedData.images = [];
      images.map((image: any) => {
        updatedData.images?.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updatedData);

    return res.status(200).json({ message: "Pet atualizado com sucesso!" });
  }

  static async schedule(req: Request, res: Response) {
    const id = req.params.id;

    //check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user!._id)) {
      return res.status(422).json({
        messsage: "Você não pode agendar uma visita com seu próprio pet!",
      });
    }

    //check if user has already scheduled a visit
    if (pet.adopter) {
      if (pet.adopter._id.equals(user!._id)) {
        return res
          .status(422)
          .json({ message: "Você já agendou uma visita para este Pet!" });
      }
    }

    //add user to pet
    pet.adopter = {
      _id: user!._id,
      name: user!.name,
      image: user?.image,
    };

    await Pet.findByIdAndUpdate(id, pet);

    return res
      .status(200)
      .json({
        message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
      });
  }

  static async concludeAdoption(req: Request, res: Response) {
    const id = req.params.id;

    //check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user!._id.toString()) {
      return res.status(422).json({
        messsage:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
    }

    pet.avaiable = false;

    await Pet.findByIdAndUpdate(id, pet);

    return res.status(200).json({message: "Parabéns o ciclo de adoção foi finalizado com sucesso!"});
  }
}
