import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext } from "react";

import Logo from "../../assets/img/logo.png";

// Context
import { Context } from "../../context/UserContext";

export default function Navbar() {
  const userContext = useContext(Context);
  let authenticated;
  let logout;

  if (userContext) {
    authenticated = userContext.authenticated;
    logout = userContext.logout;
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
          <li>
              <Link to={"/user/profile"}>Perfil</Link>
            </li>
            <li onClick={logout}>Sair</li>
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
