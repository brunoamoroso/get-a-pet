import { useState, useContext, ChangeEvent, FormEvent } from "react";
import Input from "../../form/Input";
import styles from "../../form/Form.module.css";

// Context
import { Context } from "../../../context/UserContext";
import { Link } from "react-router-dom";

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const [user, setUser] = useState({});
  const userContext = useContext(Context);
  let login = (user: Object) => {};

  if (userContext) {
    login = userContext.login;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(user);
  }

  return (
    <section>
      <div className="row justify-content-center">
        <div className={`${styles.form_container} col-6`}>
          <div className={`${styles.header} row mb-4 pb-3`}>
            <div className="col-12">
              <h1>Login</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSubmit}>
                <Input
                  text="E-mail"
                  type="email"
                  name="email"
                  placeholder="Digite o seu e-mail"
                  handleOnChange={handleChange}
                />
                <Input
                  text="Senha"
                  type="password"
                  name="password"
                  placeholder="Digite a sua senha"
                  handleOnChange={handleChange}
                />
                <input
                  className="btn btn-primary btn-lg mt-3"
                  type="submit"
                  value="Entrar"
                />
              </form>
              <p className="mt-3">
                Não tem conta? <Link to="/register">Clique aqui.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
