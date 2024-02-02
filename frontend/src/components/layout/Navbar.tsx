import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext } from "react";

import Logo from "../../assets/img/logo.png";

// Context
import { Context } from "../../context/UserContext";

export default function Navbar() {
  const userContext = useContext(Context);
  let authenticated;

  if (userContext) {
    authenticated = userContext.authenticated;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get a Pet" />
        <h2>Get a Pet</h2>
      </div>
      <ul>
        <li>
          <Link to={"/"}>Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <p>logado</p>
          </>
        ) : (
          <>
            <li>
              <Link to={"/login"}>Entrar</Link>
            </li>
            <li>
              <Link to={"/register"}>Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
