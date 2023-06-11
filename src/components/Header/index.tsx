import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
  useColorMode,
} from "@chakra-ui/react";
import { useSocket } from "../../context/SocketContext";
import { ChangeEvent, useCallback, useEffect, useState, } from "react";
import { AddIcon, ArrowDownIcon, CheckCircleIcon, CheckIcon, } from "@chakra-ui/icons";
import { HeaderInfo } from "../../utils/types";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const {connectSocket, disconnectSocket, socketId} = useSocket();
  const [isReqHeaderDrawerOpen, setIsReqHeaderDrawerOpen] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const toggleConnection = () => {
    if (socketId) {
      disconnectSocket();
    } else if (urlValue.trim()) {
      connectSocket(urlValue.trim());
    }
  };

  const closeReqHeaderDrawer = useCallback(() => {
    setIsReqHeaderDrawerOpen(false);
  }, []);

  const openReqHeaderDrawer = useCallback(() => {
    setIsReqHeaderDrawerOpen(true);
  }, []);

  return (
    <Box h="100%">
      <Flex h="100%" justify="space-between" align="center">
        <HStack>
          <Input
            placeholder="http://"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && urlValue.trim()) {
                toggleConnection();
              }
            }}
          />
          <ButtonGroup>
            <Button
              colorScheme={socketId ? "red" : "blue"}
              onClick={toggleConnection}
              variant={socketId ? "outline" : "solid"}
              isDisabled={!urlValue.trim()}
            >
              {socketId ? "Disconnect" : "Connect"}
            </Button>
            <Button onClick={openReqHeaderDrawer} rightIcon={<ArrowDownIcon/>}>
              Headers
            </Button>
            <RequestHeaderDrawer
              isOpen={isReqHeaderDrawerOpen}
              close={closeReqHeaderDrawer}
            />
          </ButtonGroup>
        </HStack>
        {socketId && (
          <HStack>
            <CheckCircleIcon color="green"/>
            <Text>Socket id: {socketId}</Text>
          </HStack>
        )}
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Flex>
    </Box>
  );
};

const RequestHeaderDrawer = ({
                               isOpen,
                               close,
                             }: {
  isOpen: boolean;
  close: () => void;
}) => {
  const [allHeaders, setAllHeaders] = useState<Record<string, HeaderInfo>>({});
  const [headerCount, setHeaderCount] = useState(1);
  const {setHeaders, getHeaders} = useSocket();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setAllHeaders(getHeaders());
  }, []);

  const addMoreHeaderInput = () => {
    setHeaderCount((prevState) => prevState + 1);
  };

  const handleSave = () => {
    setHeaders(allHeaders);
    setIsSaved(true);
  };

  const handleInputChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsSaved(false);
      const strIndex = String(index);
      const inputId = e.target.id as keyof HeaderInfo;
      const changedValue =
        inputId === "isActive" ? e.target.checked : e.target.value;
      if (allHeaders[strIndex]) {
        setAllHeaders((prevState) => ({
          ...prevState,
          [strIndex]: {
            ...allHeaders[strIndex],
            [inputId]: changedValue,
          },
        }));
      } else {
        setAllHeaders((prevState) => ({
          ...prevState,
          [strIndex]: {
            key: "",
            value: "",
            isActive: true,
            [inputId]: changedValue,
          },
        }));
      }
    };

  return (
    <Drawer onClose={close} isOpen={isOpen} placement="top">
      <DrawerOverlay/>
      <DrawerContent width="1000px" margin="0 auto">
        <DrawerCloseButton/>
        <DrawerHeader>Request headers</DrawerHeader>
        <DrawerBody>
          {Array(headerCount)
            .fill("headerPair")
            .map((_, index) => (
              <HStack spacing={3} key={index} mt="2">
                <Checkbox
                  id="isActive"
                  size="lg"
                  isChecked={allHeaders[String(index)]?.isActive}
                  onChange={handleInputChange(index)}
                />
                <Input
                  placeholder="Key"
                  width="30%"
                  id="key"
                  value={allHeaders[String(index)]?.key ?? ""}
                  onChange={handleInputChange(index)}
                />
                <Input
                  placeholder="Value"
                  width="70%"
                  id="value"
                  value={allHeaders[String(index)]?.value ?? ""}
                  onChange={handleInputChange(index)}
                />
              </HStack>
            ))}
          <HStack>
            <Button
              variant="outline"
              mt="5"
              mb="5"
              onClick={addMoreHeaderInput}
              rightIcon={<AddIcon/>}
            >
              Add more
            </Button>
            <Spacer/>
            <Button
              leftIcon={isSaved ? <CheckIcon/> : undefined}
              variant={isSaved ? "outline" : "solid"}
              colorScheme="blue"
              onClick={handleSave}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Header;
