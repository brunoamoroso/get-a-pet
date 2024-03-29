import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import formStyles from "../../form/Form.module.css";
import Input from "../../form/Input";
import styles from "./Profile.module.css";
import api from "../../../utils/api";
import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layout/RoundedImage";

interface IUser {
  _id?: string;
  image?: File | "";
  name?: string | "";
  email?: string | "";
  phone?: string | "";
  password?: string | "";
}

export default function Profile() {
  const [user, setUser] = useState<IUser>({});
  const [preview, setPreview] = useState<Blob | null>(null);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      setPreview(e.target.files[0]);
      setUser({ ...user, [e.target.name]: e.target.files[0] });
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let msgType = "success";

    const formData = new FormData();

    (Object.keys(user) as (keyof typeof user)[]).forEach((key) => {
      const value = user[key];
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
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
    <section>
      <div className="row justify-content-center">
        <div className="col-6">
          <div className={`${styles.profile_header} mb-1`}>
            <h1>Perfil</h1>
            {(user.image || preview) && (
              <RoundedImage
                src={
                  preview
                    ? URL.createObjectURL(preview)
                    : `${process.env.REACT_APP_API}imgs/users/${user.image}`
                }
                alt={user.name}
              />
            )}
          </div>
          <form onSubmit={handleSubmit} style={{paddingTop: "24px"}} className={`mt-5 ${formStyles.form_container}`}>
            <Input
              text="Imagem"
              type="file"
              name="image"
              handleOnChange={onFileChange}
            />
            <Input
              text="Email"
              type="email"
              name="email"
              placeholder="Digite o seu email"
              handleOnChange={handleChange}
              value={user.email || ""}
            />
            <Input
              text="Nome"
              type="text"
              name="name"
              placeholder="Digite o seu nome"
              handleOnChange={handleChange}
              value={user.name || ""}
            />
            <Input
              text="Telefone"
              type="text"
              name="phone"
              placeholder="Digite o seu telefone"
              handleOnChange={handleChange}
              value={user.phone || ""}
            />
            <Input
              text="Senha"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              handleOnChange={handleChange}
              value={user.password || ""}
            />
            <Input
              text="Confirmação de Senha"
              type="password"
              name="confirmpassword"
              placeholder="Confirme a sua senha"
              handleOnChange={handleChange}
            />
            <input
              style={{ width: "100%", marginTop: "32px" }}
              className="btn btn-primary btn-lg d-flex"
              type="submit"
              value="Editar"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
