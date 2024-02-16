import {
  useState,
  FunctionComponent,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";

import Input from "../../form/Input";
import styles from "../../form/Form.module.css";
import { Link } from "react-router-dom";

// Contexts
import { Context } from "../../../context/UserContext";

interface IRegisterProps {}

const Register: FunctionComponent<IRegisterProps> = (props) => {
  const [user, setUser] = useState({});
  const userContext = useContext(Context);

  if (!userContext) {
    return <div>Usuário sem Contexto</div>;
  }

  const { register } = userContext;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    return;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //send user to the database
    register(user);
  }

  return (
    <section>
      <div className="row justify-content-center mt-4">
        <div className={`${styles.form_container} col-6`}>
          <div className={`${styles.header} row`}>
            <div className="col-12 mb-3">
              <h1>Registrar</h1>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-12">
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
                <input
                  style={{ width: "100%" }}
                  className="btn btn-primary btn-lg mt-4"
                  type="submit"
                  name="siubmitBtn"
                  value="Cadastrar"
                />
                <p className="mt-3">
                  Já tem conta? <Link to={"/login"}>Entrar</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
