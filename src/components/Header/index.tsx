import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Input,
  Spacer,
  Text,
  useColorMode
} from "@chakra-ui/react";
import {useSocket} from "../../context/SocketContext";
import {useCallback, useRef, useState} from "react";
import {AddIcon, ArrowDownIcon, CheckCircleIcon} from "@chakra-ui/icons";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const {connectSocket, disconnectSocket, socketId} = useSocket();
  const [isReqHeaderDrawerOpen, setIsReqHeaderDrawerOpen] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const toggleConnection = () => {
    if (socketId) {
      disconnectSocket();
    } else if (urlInputRef.current) {
      connectSocket(urlInputRef.current.value);
    }
  };

  const closeReqHeaderDrawer = useCallback(() => {
    setIsReqHeaderDrawerOpen(false);
  }, []);

  const openReqHeaderDrawer = useCallback(() => {
    setIsReqHeaderDrawerOpen(true);
  }, [])

  return (
    <Box h='100%'>
      <Flex h='100%' justify='space-between' align='center'>
        <HStack>
          <Input placeholder='Socket url' ref={urlInputRef}/>
          <ButtonGroup>
            <Button
              colorScheme={socketId ? 'red' : 'blue'}
              onClick={toggleConnection}
              variant={socketId ? 'outline' : 'solid'}
            >
              {socketId ? 'Disconnect' : 'Connect'}
            </Button>
            <Button onClick={openReqHeaderDrawer} rightIcon={<ArrowDownIcon/>}>
              Req headers
            </Button>
            <RequestHeaderDrawer
              isOpen={isReqHeaderDrawerOpen}
              close={closeReqHeaderDrawer}
            />
          </ButtonGroup>
        </HStack>
        {socketId && (
          <HStack>
            <CheckCircleIcon color='green'/>
            <Text>Socket id: {socketId}</Text>
          </HStack>
        )}
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
    </Box>
  )
}

const RequestHeaderDrawer = ({isOpen, close}: { isOpen: boolean, close: () => void }) => {
  const [inputPairIds, setInputPairIds] = useState(1);
  const inputsRef = useRef<Record<string, { headerNameInput?: HTMLInputElement, headerValueInput?: HTMLInputElement }>>({});
  const {setHeaders} = useSocket();
  const [isSaved, setIsSaved] = useState(false);

  const addMoreHeaderInput = () => {
    setInputPairIds(prevState => prevState + 1);
  }

  const handleSave = () => {
    const headers: Record<string, string> = {};
    const inputBoxObj = inputsRef.current;
    for (const indexKey in inputBoxObj) {
      const nameInput = inputBoxObj[indexKey].headerNameInput;
      const valueInput = inputBoxObj[indexKey].headerValueInput;
      const name = nameInput?.value, value = valueInput?.value;
      if (name && value) {
        headers[name] = value;
      }
    }
    setHeaders(headers);
    setIsSaved(true);
  };

  const attachNodes = (node: HTMLInputElement, index: number, type: 'key' | 'value') => {
    const inputIdentifier = type === 'key' ? 'headerNameInput' : 'headerValueInput';
    if (!!inputsRef.current[String(index)]) {
      inputsRef.current[String(index)] = {
        ...inputsRef.current[String(index)],
        [inputIdentifier]: node,
      }
    } else {
      inputsRef.current[String(index)] = {
        [inputIdentifier]: node,
      }
    }
  };

  const breakSavedState = useCallback(() => {
    setIsSaved(false);
  }, [])

  return (
    <Drawer onClose={close} isOpen={isOpen} placement='top'>
      <DrawerOverlay/>
      <DrawerContent width='1000px' margin='0 auto'>
        <DrawerCloseButton/>
        <DrawerHeader>Request headers</DrawerHeader>
        <DrawerBody>
          {Array(inputPairIds).fill('headerPair').map((_, index) => (
            <HStack spacing={3} key={index} mt='2'>
              <Input
                placeholder='Key'
                width='30%'
                ref={node => {
                  if (node) {
                    attachNodes(node, index, 'key');
                  }
                }}
                onChange={breakSavedState}
              />
              <Input
                placeholder='Value'
                width='70%'
                ref={node => {
                  if (node) {
                    attachNodes(node, index, 'value');
                  }
                }}
                onChange={breakSavedState}
              />
            </HStack>
          ))}
          <HStack>
            <Button
              variant='outline'
              mt='5' mb='5'
              onClick={addMoreHeaderInput}
              rightIcon={<AddIcon/>}
            >
              Add more header
            </Button>
            <Spacer/>
            <Button variant={isSaved ? 'outline' : 'solid'} colorScheme='blue' onClick={handleSave}>
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default Header;
