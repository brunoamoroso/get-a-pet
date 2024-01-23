import {useState, FunctionComponent, ChangeEvent, FormEvent, useContext} from "react";

import Input from "../../form/Input";
import styles from "../../form/Form.module.css";
import { Link } from "react-router-dom";

// Contexts
import { Context } from "../../../context/UserContext";

interface IRegisterProps {}

const Register: FunctionComponent<IRegisterProps> = (props) => {
  const [user, setUser] = useState({});
  const userContext = useContext(Context);

  if(!userContext){
    return <div>Usuário sem Contexto</div>
  };

  const {register} = userContext;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setUser({...user, [e.target.name]: e.target.value});
    return;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    //send user to the database
    register(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form action="" onSubmit={handleSubmit}>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
        />
        <Input
          text="Email"
          type="email"
          name="email"
          placeholder="Digite o seu email"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de Senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          type="submit"
          name="submitBtn"
          value="Cadastrar"
        />
        <p>
          Já tem conta? <Link to={"/login"}>Entrar</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
