import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import { IUser, useAuth } from './AuthContext';

export interface IMessage {
  content: string;
  senderId: string;
  senderUsername: string;
  votes: number;
  _id?: string;
}

interface SocketContextProps {
  children: ReactNode;
}

const SocketContext = createContext({
  socket: null as WebSocket | null,
  sendMessage: (message: IMessage) => {},
  messages: [] as IMessage[],
  handleVote: (
    incValue: number,
    isUnvote: boolean,
    messageId: string | undefined
  ) => {},
});

export const SocketProvider = ({ children }: SocketContextProps) => {
  const { user, setUser } = useAuth();
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
    const res = await fetch(
      `${
        process.env.REACT_APP_WEBSERVER_URL || 'http://127.0.0.1:52176'
      }/message/create-chat-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtCookie,
        },
        body: JSON.stringify({
          content: message.content,
          senderUsername: message.senderUsername,
        }),
      }
    );
    if (!res.ok) {
      const { message } = await res.json();
      console.log(message);
      return;
    }
    const { _id } = await res.json();
    socket.send(JSON.stringify({ ...message, _id }));
  };

  const handleVote = async (
    incValue: number,
    isUnvote: boolean,
    messageId: string | undefined
  ) => {
    const jwtCookie = Cookies.get('jwtCookie');
    if (!messageId || !jwtCookie) {
      console.log('Vote failed');
      return;
    }
    const res = await fetch(
      `${
        process.env.REACT_APP_WEBSERVER_URL || 'http://127.0.0.1:52176'
      }/message/vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtCookie,
        },
        body: JSON.stringify({
          messageId: messageId,
          incValue: incValue,
          isUnvote: isUnvote,
        }),
      }
    );
    if (!res.ok) {
      const { message } = await res.json();
      console.log(message);
      return;
    }
    const updatedUser = user;
    if (isUnvote) {
      updatedUser?.upvotedChatIds.delete(messageId);
      updatedUser?.downvotedChatIds.delete(messageId);
    } else if (incValue > 0) {
      updatedUser?.upvotedChatIds.add(messageId);
      updatedUser?.downvotedChatIds.delete(messageId);
    } else if (incValue < 0) {
      updatedUser?.upvotedChatIds.delete(messageId);
      updatedUser?.downvotedChatIds.add(messageId);
    }
    setUser({ ...(updatedUser as IUser) });
  };

  useEffect(() => {
    setSocket(
      new WebSocket(
        `ws://${
          process.env.REACT_APP_WEBSERVER_URL?.slice(
            process.env.REACT_APP_WEBSERVER_URL.indexOf('http://') +
              'http://'.length
          ) || '127.0.0.1:52176'
        }`
      )
    );
    fetch(
      `${
        process.env.REACT_APP_WEBSERVER_URL || 'http://127.0.0.1:52176'
      }/message/all-chat-messages`
    ).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      }
      setMessages([...data.messages]);
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
    <SocketContext.Provider
      value={{ socket, sendMessage, messages, handleVote }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
