import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";
import {SocketContextProvider} from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SocketContextProvider>
        <App/>
      </SocketContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
