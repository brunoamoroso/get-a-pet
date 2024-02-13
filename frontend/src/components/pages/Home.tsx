import api from "../../utils/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from './Home.module.css';
import { IPetData } from "../form/PetForm";

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get('/pets').then(response => {
      setPets(response.data.pets);
    })
  }, []);

  return (
    <section>
        <div  className={styles.petHome_header}>
          <h1>Adote um Pet</h1>
          <p>Veja os detalhes de cada um e conheça o tutor deles.</p>
        </div>

        <div className={styles.pet_container}>
          {pets.length > 0 ? (
            pets.map((pet: any) => (
              <div className={styles.pet_card}>
               <div style={{backgroundImage: `url(${process.env.REACT_APP_API}imgs/pets/${pet.images[0]})`}} className={styles.pet_card_image}></div>
                <h3>{pet.name}</h3>
                <p><span className="bold">Peso:</span> {pet.weight}kg</p>
                {pet.avaiable ? (
                    <Link to={`pets/${pet._id}`}>Mais Detalhes</Link>
                ) : (
                  <p className={styles.adopted_text}>Adotado</p>
                )}
              </div>
            ))
          ) : (
            <p>Não há pets cadastrados</p>
          )}
        </div>
    </section>
  );
}