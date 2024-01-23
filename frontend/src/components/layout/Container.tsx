import * as React from 'react';
import styles from "./Container.module.css";

interface IContainerProps {
    children: React.ReactNode;
}

const Container: React.FunctionComponent<IContainerProps> = ({children}) => {
  return (
    <main className={styles.container}>
        {children}
    </main>
  );
};

export default Container;
