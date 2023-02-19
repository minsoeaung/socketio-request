import {Box, Button, Flex, HStack, Input, Text, useColorMode} from "@chakra-ui/react";
import {useSocket} from "../../context/SocketContext";
import {useRef} from "react";
import {CheckCircleIcon} from "@chakra-ui/icons";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const {connectSocket, disconnectSocket, socketId} = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleConnection = () => {
    if (socketId) {
      disconnectSocket();
    } else if (inputRef.current) {
      connectSocket(inputRef.current.value);
    }
  }

  return (
    <Box h='100%'>
      <Flex h='100%' justify='space-between' align='center'>
        <HStack>
          <Input placeholder='Basic usage' ref={inputRef}/>
          <Button colorScheme={socketId ? 'gray' : 'blue'} onClick={toggleConnection}>
            {socketId ? 'Disconnect' : 'Connect'}
          </Button>
        </HStack>
        {socketId && (
          <HStack>
            <CheckCircleIcon color='green'/>
            <Text>ID: {socketId}</Text>
          </HStack>
        )}
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
    </Box>
  )
}

export default Header;
