import {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useToast} from "@chakra-ui/react";
import {Payload} from "../utils/types";

const SocketContext = createContext({
  connectSocket: (url: string) => {
  },
  disconnectSocket: () => {
  },
  emitEvent: (eventName: string, payload: Payload) => {
  },
  socketId: '',
  outEvents: [] as OutEvent[]
});

type OutEvent = { eventName: string, payload: Payload, timestamp: string };

export const SocketContextProvider = ({children}: { children: ReactNode }) => {
  const toast = useToast();
  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState('');
  const [outEvents, setOutEvents] = useState<OutEvent[]>([]);

  const connectSocket = useCallback((url: string) => {
    socketRef.current = io(url);
    socketRef.current.on("connect_error", (err) => {
      setSocketId('');
      toast({
        title: 'Connection error',
        description: `Due to ${err.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    });
    socketRef.current.on("connect", () => {
      setSocketId(socketRef.current?.id ?? '');
      toast({
        title: "Connected",
        description: `with socket id: ${socketRef.current?.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    })
    socketRef.current.connect();
  }, [socketRef.current]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      setSocketId('');
      socketRef.current.disconnect();
    }
  }, [socketRef.current])

  const emitEvent = useCallback((eventName: string, payload: Payload) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, payload);
      const newOutEvent: OutEvent = {
        eventName,
        payload,
        timestamp: new Date().toISOString()
      }
      setOutEvents(prevState => [...prevState, newOutEvent])
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        disconnectSocket,
        socketId,
        emitEvent,
        outEvents
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext);
}
