import Cookies from 'js-cookie';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useError } from './ErrorContext';

interface AuthProviderProps {
  children: ReactNode;
}

export interface IUser {
  _id: string;
  username: string;
  upvotedChatIds: Set<string>;
  downvotedChatIds: Set<string>;
}

export interface ILoginRes {
  success: boolean;
  message?: string;
}

const AuthContext = createContext({
  user: null as IUser | null,
  setUser: (user: IUser | null) => {},
  login: (username: string, password: string): Promise<ILoginRes> =>
    Promise.resolve({ success: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { showError } = useError();
  const [user, setUser] = useState<IUser | null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<ILoginRes> => {
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_WEBSERVER_IP}:${process.env.REACT_APP_WEBSERVER_PORT}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        showError(message);
        return { success: false, message: message };
      }
      const { token, user } = await res.json();
      Cookies.set('jwtCookie', token, { expires: 7 });
      setUser({
        ...user,
        upvotedChatIds: new Set(user.upvotedChatIds),
        downvotedChatIds: new Set(user.downvotedChatIds),
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      showError('Could not log in. Please try again later');
      return { success: false };
    }
  };

  const logout = () => {
    Cookies.remove('jwtCookie');
    setUser(null);
  };

  useEffect(() => {
    const jwtCookie = Cookies.get('jwtCookie');
    if (jwtCookie) {
      fetch(
        `http://${process.env.REACT_APP_WEBSERVER_IP}:${process.env.REACT_APP_WEBSERVER_PORT}/user/get-authenticated-user`,
        {
          headers: {
            Authorization: jwtCookie,
          },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            console.error('Failed to fetch authenticated user');
            return;
          }
          const { user } = await res.json();
          setUser({
            ...user,
            upvotedChatIds: new Set(user.upvotedChatIds),
            downvotedChatIds: new Set(user.downvotedChatIds),
          });
        })
        .catch((error) => {
          console.error('Error when fetching authenticated user: ', error);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
