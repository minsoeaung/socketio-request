import {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {ToastId, useToast, UseToastOptions} from "@chakra-ui/react";
import {Payload} from "../utils/types";

const SocketContext = createContext({
  connectSocket: (url: string) => {
  },
  disconnectSocket: () => {
  },
  emitEvent: (eventName: string, payload: Payload) => {
  },
  socketId: '',
  outEvents: [] as OutEvent[],
  setHeaders: (headers: Record<string, string>) => {
  }
});

type OutEvent = { eventName: string, payload: Payload, timestamp: string };

export const SocketContextProvider = ({children}: { children: ReactNode }) => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();
  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState('');
  const [outEvents, setOutEvents] = useState<OutEvent[]>([]);
  const reqHeadersRef = useRef<Record<string, string>>();

  const connectSocket = useCallback((url: string) => {
    socketRef.current = io(url, {extraHeaders: reqHeadersRef.current});
    console.log('connect with headers', reqHeadersRef.current);
    socketRef.current.on("connect_error", (err) => {
      setSocketId('');
      console.log('why na')
      const toastOption: Omit<UseToastOptions, "id"> = {
        title: 'Connection error',
        description: `Due to ${err.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      };
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, toastOption);
      } else {
        toastIdRef.current = toast(toastOption);
      }
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

  const setHeaders = useCallback((headers: Record<string, string>) => {
    reqHeadersRef.current = headers;
  }, [])

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        disconnectSocket,
        socketId,
        emitEvent,
        outEvents,
        setHeaders
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext);
}
