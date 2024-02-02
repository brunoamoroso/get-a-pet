import styles from "./Message.module.css";
import { useEffect, useState } from "react";
import bus from '../../utils/bus';

export interface IMessageProps {}

export default function Message(props: IMessageProps) {
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState(''); 
  const [type, setType] = useState("");

  useEffect(() => {
    bus.addListener('flash', ({message, type}: {message: string, type: string}) => {
        setVisibility(true);
        setMessage(message);
        setType(type);

        setTimeout(() => {
            setVisibility(false);
        }, 3000);
    })
  }, []);

  return (
    visibility ? (
      <div className={`${styles.message} ${styles[type]}`}>{message}</div>
    ) : null
  );
}
