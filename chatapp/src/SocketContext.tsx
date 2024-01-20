import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IUser } from './AuthContext';

export interface IMessage {
  content: string;
  sender: IUser;
  timestamp: string;
}

interface SocketContextProps {
  children: ReactNode;
}

const SocketContext = createContext({
  socket: null as WebSocket | null,
  sendMessage: (message: IMessage) => {},
});

export const SocketProvider = ({ children }: SocketContextProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const sendMessage = (message: IMessage) => {
    console.log('sending message: ', message);
    if (message.content.trim() === '' || !socket) {
      return;
    }
    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8000'));
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onopen = () => {
      console.log('Websocket connection established');
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage);
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
