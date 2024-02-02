import { ReactNode, createContext } from 'react';
import useAuth from '../hooks/useAuth';


interface IUserContext{
  register: any;
  authenticated: boolean;
}

interface IUserProvider {
    value: any;
    children: ReactNode;
}

const Context = createContext<IUserContext | null>(null);

function UserProvider ({children}: IUserProvider) {
    const {authenticated, register} = useAuth();
  return (
    <Context.Provider value={{authenticated, register}}>
        {children}
    </Context.Provider>
  );
}

export {Context, UserProvider};
