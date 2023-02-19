import {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {EventArg, PayloadType} from "../utils/types";
import {useToast} from "@chakra-ui/react";

const SocketContext = createContext({
  connectSocket: (url: string) => {
  },
  disconnectSocket: () => {
  },
  emitEvent: <T, >(eventName: string, payload: EventArg<T>, payloadType: PayloadType) => {
  },
  socketId: '',
  outEvents: [] as OutEvent[]
});

type OutEvent = { event: string, payload: object | string, payloadType: PayloadType, timestamp: string };

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

  const emitEvent = useCallback(<T, >(eventName: string, payload: EventArg<T>, payloadType: PayloadType) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, payload);
      setOutEvents(prevState => {
        return [...prevState, {event: eventName, payload, payloadType, timestamp: new Date().toISOString()}]
      })
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
