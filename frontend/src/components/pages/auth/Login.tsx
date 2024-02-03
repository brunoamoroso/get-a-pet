import { useState, useContext } from "react";
import Input from "../../form/Input";
import styles from '../../form/Form.module.css';

// Context
import { Context } from "../../../context/UserContext";
import { Link } from "react-router-dom";

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  
  function handleChange(){

  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form>
        <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail" handleOnChange={handleChange}/>
        <Input text="Senha"  type="password" name="password" placeholder="Digite a sua senha" handleOnChange={handleChange}/>
        <input type="submit" value="Entrar" />
      </form>
      <p>Não tem conta? <Link to="/register">Clique aqui.</Link></p>
    </section>
  );
}
