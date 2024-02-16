import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoundedImage from "../../layout/RoundedImage";
import styles from './Dashboard.module.css';

import useFlashMessage from "../../../hooks/useFlashMessage";
import api from "../../../utils/api";

export interface IMyPets {}

export default function MyPets(props: IMyPets) {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/pets/mypets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets);
      });
  }, [token]);

  async function removePet(id: string){
    let msgType = 'success';

    const data = await api.delete(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then(response => {
      const updatedPets = pets.filter((pet: any) => {
        return pet._id !== id
      });
      setPets(updatedPets);
      return response.data;
    }).catch(err => {
      msgType = 'error';
      return err.response.data;
    })

    setFlashMessage(data.message, msgType);
  }

  async function concludeAdoption(id: string){
    let msgType = 'success';

    const data = await api.patch(`/pets/conclude/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then(response => {
      return response.data;
    }).catch(err => {
      msgType = 'error';
      return err.response.data;
    });

    setFlashMessage(data.message, msgType);
  }

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>Meus Pets</h1>
        <Link to={"/pets/add"}>
          <button className="btn btn-primary btn-lg">Cadastrar Pet</button>
        </Link>
      </div>
      <div className={styles.container}>
        {pets.length > 0 &&
          pets.map((pet: any) => (
            <div className={styles.petlist_row} key={pet._id}>
              <RoundedImage
                src={`${process.env.REACT_APP_API}/imgs/pets/${pet.images[0]}`}
                alt={pet.name}
                width={"px75"}
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.avaiable ? (
                  <>
                    {pet.adopter && (
                      <button className={`btn btn-outline-success`} onClick={() => { concludeAdoption(pet._id) }}>Concluir Adoção</button>
                    )}
                    <Link to={`/pets/edit/${pet._id}`}><button className="btn btn-outline-primary">Editar</button></Link>
                    <button className="btn btn-outline-primary" onClick={() => { removePet(pet._id)}}>Excluir</button>
                  </>
                ) : (
                  <p>Pet já adotado</p>
                )}
              </div>
            </div>
          ))}

        {pets.length === 0 && <p>Não há pets cadastrados</p>}
      </div>
    </section>
  );
}
