import styles from "./PetDetails.module.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../utils/api";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { IPetData } from "../../form/PetForm";

export default function PetDetails() {
  const [pet, setPet] = useState<IPetData>({});
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    api.get(`/pets/${id}`).then((response) => {
      setPet(response.data.pet);
    });
  }, [id]);

  async function schedule() {
    let msgType = "success";

    const data = await api
      .patch(`/pets/schedule/${pet._id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
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
  }

  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>{pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conheçe-lo</p>
          </div>

          <div className={styles.pet_images}>
            {pet.images &&
              pet.images.map((image, index) => (
                <img
                  src={`${process.env.REACT_APP_API}/imgs/pets/${image}`}
                  alt={pet.name}
                  key={index}
                />
              ))}
          </div>

          <p>
            <span className="bold">Peso:</span>
            {pet.weight}kg
          </p>

          <p>
            <span className="bold">Idade:</span>
            {pet.age} anos
          </p>
          {token ? (
            <button onClick={schedule}>Solicitar uma visita</button>
          ) : (
            <p>
              Você precisa <Link to={"/register"}>criar uma conta</Link> para
              solicitar a visita
            </p>
          )}
        </section>
      )}
    </>
  );
}
