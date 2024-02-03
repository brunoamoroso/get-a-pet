import { ReactNode, createContext } from 'react';
import useAuth from '../hooks/useAuth';


interface IUserContext{
  register: (user: Object) => Promise<void>;
  authenticated: boolean;
  logout(): any;
  login: (user: Object) => Promise<void>;
}

interface IUserProvider {
    value: any;
    children: ReactNode;
}

const Context = createContext<IUserContext | null>(null);

function UserProvider ({children}: IUserProvider) {
    const {authenticated, register, logout, login} = useAuth();
  return (
    <Context.Provider value={{authenticated, register, logout, login}}>
        {children}
    </Context.Provider>
  );
}

export {Context, UserProvider};
