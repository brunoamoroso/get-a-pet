import { useState, useContext, ChangeEvent, FormEvent } from "react";
import Input from "../../form/Input";
import styles from '../../form/Form.module.css';

// Context
import { Context } from "../../../context/UserContext";
import { Link } from "react-router-dom";

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const [user,setUser] = useState({});
  const userContext = useContext(Context);
  let login = (user: Object) => {};

  if(userContext){
    login = userContext.login;
  }
  
  function handleChange(e: ChangeEvent<HTMLInputElement>){
    setUser({...user, [e.target.name]:  e.target.value});
  }
  
  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail" handleOnChange={handleChange}/>
        <Input text="Senha"  type="password" name="password" placeholder="Digite a sua senha" handleOnChange={handleChange}/>
        <input type="submit" value="Entrar" />
      </form>
      <p>Não tem conta? <Link to="/register">Clique aqui.</Link></p>
    </section>
  );
}
