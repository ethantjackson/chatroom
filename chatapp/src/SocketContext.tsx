import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import { IUser, useAuth } from './AuthContext';

interface IChat {
  content: string;
  senderId: string;
  senderUsername: string;
  votes: number;
  _id?: string;
}

interface IVote {
  incVal: number;
  messageId: string;
}

interface IMessage {
  type: 'CHAT' | 'VOTE';
  value: IChat | IVote;
}

interface SocketContextProps {
  children: ReactNode;
}

const SocketContext = createContext({
  socket: null as WebSocket | null,
  sendChatMessage: (message: IChat) => {},
  chats: [] as IChat[],
  handleVote: (
    incValue: number,
    isUnvote: boolean,
    messageId: string | undefined
  ) => {},
});

export const SocketProvider = ({ children }: SocketContextProps) => {
  const { user, setUser } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chats, setChats] = useState<IChat[]>([]);

  const sendChatMessage = async (message: IChat) => {
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
    socket.send(JSON.stringify({ ...message, _id, type: 'CHAT' }));
  };

  const handleVote = async (
    incValue: number,
    isUnvote: boolean,
    messageId: string | undefined
  ) => {
    const jwtCookie = Cookies.get('jwtCookie');
    if (!messageId || !jwtCookie || !socket) {
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
    socket.send(
      JSON.stringify({ incVal: incValue, messageId: messageId, type: 'VOTE' })
    );
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
      setChats([...data.messages]);
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
      switch (receivedMessage.type) {
        case 'CHAT':
          setChats((curChats) => [...curChats, receivedMessage]);
          break;
        case 'VOTE':
          const { incVal, messageId } = receivedMessage;
          console.log('PROCESS vote', incVal, messageId);
          setChats((chats) =>
            chats.map((chat) =>
              chat._id === messageId
                ? { ...chat, votes: chat.votes + incVal }
                : chat
            )
          );
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, sendChatMessage, chats, handleVote }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
