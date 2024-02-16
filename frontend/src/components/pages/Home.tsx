import api from "../../utils/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Home.module.css";

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/pets").then((response) => {
      setPets(response.data.pets);
    });
  }, []);

  return (
    <section>
      <div className={styles.petHome_header}>
        <h1>Adote um Pet</h1>
        <p>Veja os detalhes de cada um e conheça o tutor deles.</p>
      </div>

      <div className={styles.pet_container}>
        {pets.length > 0 ? (
          pets.map((pet: any) => (
            <div className={styles.pet_card}>
              <div
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API}imgs/pets/${pet.images[0]})`,
                }}
                className={styles.pet_card_image}
              ></div>
              <div className={styles.pet_card_body}>
                <div className="row">
                  <div className="col">
                    <h3>{pet.name}</h3>
                  </div>
                </div>
                <div className={styles.pet_card_desc}>
                  <div className="row">
                    <div className="col-12">
                      <p>
                        <span className="bold">Peso:</span> {pet.weight}kg
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        <span className="bold">Cor:</span> {pet.color}
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        <span className="bold">Idade:</span> {pet.age}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.pet_card_bottom} row`}>
                  <div className="col d-flex flex-column justify-content-end text-center">
                    {pet.avaiable ? (
                      <Link style={{width: "100%"}} to={`pets/${pet._id}`}>
                        <button
                          style={{ width: "100%" }}
                          className="btn btn-primary"
                        >
                          Mais Detalhes
                        </button>
                      </Link>
                    ) : (
                      <p className={styles.adopted_text}>Adotado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Não há pets cadastrados</p>
        )}
      </div>
    </section>
  );
}
