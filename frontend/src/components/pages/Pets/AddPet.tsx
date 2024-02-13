import { useState } from "react";
import styles from "./AddPet.module.css";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessage";
import PetForm, { IPetData } from "../../form/PetForm";

export interface IAddPet {}

export default function AddPet(props: IAddPet) {
  const [pet, setPet] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function registerPet(pet: IPetData) {
    let msgType = "success";

    const formData = new FormData();

    (Object.keys(pet) as (keyof typeof pet)[]).forEach((key) => {
      const value = pet[key];
      if (value !== undefined) {
        //if key is images (the only array)
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            formData.append("images", value[i]);
          }
        } else {
          formData.append(key, value);
        }
      }
    });

    const data = await api
      .post("pets/create", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);

    if(msgType !== 'error'){
      navigate("/pets/mypets");
    }
  }

  return (
    <section className={styles.addPet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção.</p>
        <PetForm handleSubmit={registerPet} btnText="Cadastrar" />
      </div>
    </section>
  );
}
