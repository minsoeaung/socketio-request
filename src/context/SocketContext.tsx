import {createContext, ReactNode, useCallback, useContext, useRef, useState,} from "react";
import {io, Socket} from "socket.io-client";
import {ToastId, useToast, UseToastOptions} from "@chakra-ui/react";
import {EmittedEvent, HeaderInfo, Headers, Payload} from "../utils/types";

const SocketContext = createContext({
  connectSocket: (url: string) => {},
  disconnectSocket: () => {},
  emitEvent: (eventName: string, payload: Payload) => {},
  socketId: "",
  emittedEvents: [] as EmittedEvent[],
  setHeaders: (headers: Record<string, HeaderInfo>) => {},
  getHeaders: (): Record<string, HeaderInfo> => ({}),
});

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();
  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState("");
  const [emittedEvents, setEmittedEvents] = useState<EmittedEvent[]>([]);
  const reqHeadersRef = useRef<Record<string, HeaderInfo>>({
    "0": { key: "", value: "", isActive: true },
  });

  const connectSocket = useCallback(
    (url: string) => {
      socketRef.current = io(url, {
        extraHeaders: reqHeadersRef.current
          ? getActiveHeaders(reqHeadersRef.current)
          : {},
      });
      socketRef.current.on("connect_error", (err) => {
        setSocketId("");
        console.log("why na");
        const toastOption: Omit<UseToastOptions, "id"> = {
          title: "Connection error",
          description: `Due to ${err.message}`,
          status: "error",
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
        setSocketId(socketRef.current?.id ?? "");
        toast({
          title: "Connected",
          description: `with socket id: ${socketRef.current?.id}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
      socketRef.current.connect();
    },
    [socketRef.current]
  );

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      setSocketId("");
      socketRef.current.disconnect();
    }
  }, [socketRef.current]);

  const emitEvent = useCallback((eventName: string, payload: Payload) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, payload);
      setEmittedEvents((prevState) => [
        ...prevState,
        {
          eventName,
          payload,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const setHeaders = useCallback((headers: Record<string, HeaderInfo>) => {
    reqHeadersRef.current = headers;
  }, []);

  const getHeaders = useCallback((): Record<string, HeaderInfo> => {
    if (reqHeadersRef.current) return reqHeadersRef.current;
    return {};
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        disconnectSocket,
        socketId,
        emitEvent,
        emittedEvents,
        setHeaders,
        getHeaders,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

const getActiveHeaders = (headers: Record<string, HeaderInfo>): Headers => {
  const results = {} as Headers;
  for (let property in headers) {
    const info = headers[property];
    if (info.isActive && info?.key.trim() && info?.value.trim()) {
      results[info.key] = info.value;
    }
  }

  return results;
};
