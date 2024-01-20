import Cookies from 'js-cookie';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface IUser {
  username: string;
}

export interface ILoginRes {
  success: boolean;
  message?: string;
}

const AuthContext = createContext({
  user: null as IUser | null,
  login: (username: string, password: string): Promise<ILoginRes> =>
    Promise.resolve({ success: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<ILoginRes> => {
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        return { success: false, message: message };
      }
      const { token, user } = await res.json();
      Cookies.set('jwtCookie', token, { expires: 7 });
      setUser({ ...user });
      return { success: true };
    } catch (error) {
      console.error(error);
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
      fetch('/get-authenticated-user', {
        headers: {
          Authorization: jwtCookie,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            console.error('Failed to fetch authenticated user');
            return;
          }
          const { user } = await res.json();
          setUser({ ...user });
        })
        .catch((error) => {
          console.error('Error when fetching authenticated user: ', error);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
