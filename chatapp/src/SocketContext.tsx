import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IUser } from './AuthContext';
import Cookies from 'js-cookie';

export interface IMessage {
  content: string;
  sender: IUser;
  timestamp?: string;
}

interface SocketContextProps {
  children: ReactNode;
}

interface IChatDBRes {
  content: string;
  sender: string;
  senderUsername: string;
}

const SocketContext = createContext({
  socket: null as WebSocket | null,
  sendMessage: (message: IMessage) => {},
  messages: [] as IMessage[],
});

export const SocketProvider = ({ children }: SocketContextProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const sendMessage = async (message: IMessage) => {
    const jwtCookie = Cookies.get('jwtCookie');
    if (!jwtCookie) {
      console.log('Please sign in again');
      return;
    }
    if (message.content.trim() === '' || !socket) {
      return;
    }
    socket.send(JSON.stringify(message));
    const res = await fetch('/message/create-chat-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtCookie,
      },
      body: JSON.stringify({
        content: message.content,
        senderUsername: message.sender.username,
      }),
    });
    if (!res.ok) {
      const { message } = await res.json();
      console.log(message);
    }
  };

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8000'));
    fetch('/message/all-chat-messages').then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      }
      setMessages(
        data.messages.map((message: IChatDBRes) => {
          const { content, sender, senderUsername } = message;
          console.log(content, sender, senderUsername);
          return {
            content,
            sender: {
              _id: sender,
              username: senderUsername,
            },
          };
        })
      );
    });
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
      setMessages((curMessages) => [...curMessages, receivedMessage]);
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
