import * as React from "react";
import styles from "./Footer.module.css";

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = (props) => {
  return (
    <footer className={styles.footer}>
      <p>
        <span className="bold">Get a Pet</span> &copy; 2023
      </p>
    </footer>
  );
};

export default Footer;
