import { ReactNode, createContext } from 'react';
import useAuth from '../hooks/useAuth';


interface IUserContext{
  register: any;
}

interface IUserProvider {
    value: any;
    children: ReactNode;
}

const Context = createContext<IUserContext | null>(null);

function UserProvider ({children}: IUserProvider) {
    const {register} = useAuth();
  return (
    <Context.Provider value={{register}}>
        {children}
    </Context.Provider>
  );
}

export {Context, UserProvider};
