import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import styles from './AddPet.module.css';
import PetForm, { IPetData } from "../../form/PetForm";
import useFlashMessage from "../../../hooks/useFlashMessage";

export interface IEditPetsProps {
}

export default function EditPets (props: IEditPetsProps) {
    const [pet, setPet] = useState<IPetData>({});
    const [token] = useState(localStorage.getItem('token') || "");
    const {id} = useParams();
    const {setFlashMessage} = useFlashMessage();

    useEffect(() => {
        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        }).then(response => {
            setPet(response.data.pet);
        }).catch(err => {
            console.log(err);
        })
    }, [token, id]);

    async function updatePet(pet: IPetData){
        let msgType  = 'success';

        const formData = new FormData();

        (Object.keys(pet) as (keyof typeof pet)[]).forEach((key) => {
            const value = pet[key];
            if(value !== undefined){
                if(Array.isArray(value)){
                    for (let i = 0; i < value.length; i++) {
                        formData.append("images", value[i]);
                    }
                }else{
                    formData.append(key, value);
                }
            }
        });

        const data = await api.patch(`pets/${pet._id}`, formData, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data",
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            msgType = 'error';
            return err.response.data;
        })

        setFlashMessage(data.message, msgType);
    }

    const formTitle = `Editando o Pet: ${pet.name}`;
    const formDesc = "Depois da edição os dados serão atualizados no sistema."
  return (
    <section>
        <div className={styles.addPet_header}>
            <h1>Editando o Pet: {pet.name}</h1>
            <p>Depois da edição os dados serão atualizados no sistema</p>
        </div>
        {
            pet.name && (
                <PetForm title={formTitle} desc={formDesc} btnText="Editar" handleSubmit={updatePet} petData={pet}/>
            )
        }
    </section>
  );
}
