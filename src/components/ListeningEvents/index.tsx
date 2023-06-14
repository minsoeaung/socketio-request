import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Input,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { useSocket } from "../../context/SocketContext";

const ListeningEvents = () => {
  const {listeningEvents} = useSocket();

  return (
    <Box p={2} borderWidth="1px" h="100%" maxH="50vh">
      <Heading size="md" mb="4">
        Listeners
      </Heading>
      <Wrap spacing={2} align="center">
        {listeningEvents.map((event) => (
          <WrapItem key={event.eventName}>
            <Event name={event.eventName} isActive={event.isActive}/>
          </WrapItem>
        ))}
        <WrapItem>
          <AddEvent/>
        </WrapItem>
      </Wrap>
    </Box>
  );
};

const Event = memo(
  ({name, isActive}: { name: string; isActive: boolean }) => {
    const {addEventListener, removeEventListener} = useSocket();

    if (!name.trim()) return null;

    const toggle = () => {
      if (isActive) {
        removeEventListener(name);
      } else {
        addEventListener(name);
      }
    };

    return (
      <Tag
        size="lg"
        colorScheme={isActive ? "cyan" : "gray"}
        variant={isActive ? "subtle" : "outline"}
        borderRadius="full"
        cursor="pointer"
        onClick={toggle}
      >
        {isActive && (
          <TagLeftIcon boxSize='12px' as={CheckIcon}/>
        )}
        <TagLabel>{name}</TagLabel>
      </Tag>
    );
  }
);

const AddEvent = memo(() => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");

  const {addEventListener, socketId} = useSocket();

  const show = () => {
    if (socketId) {
      setShowInput(true);
    }
  };

  const hide = () => {
    setShowInput(false);
    setValue("");
  };

  const add = () => {
    if (!!value.trim()) {
      addEventListener(value);
      hide();
    }
  };

  if (showInput) {
    return (
      <HStack>
        <Input
          placeholder="Event name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              add();
            }
          }}
          borderRadius='full'
          size='sm'
          autoFocus
        />
        <IconButton
          size='sm'
          color="cyan"
          aria-label="Add event listener"
          icon={<AddIcon/>}
          onClick={add}
          disabled={!value.trim()}
        />
        <IconButton
          size='sm'
          color="red.200"
          aria-label="Close input box"
          icon={<CloseIcon/>}
          onClick={hide}
          variant='outline'
        />
      </HStack>
    );
  }

  return (
    <Tag
      size="lg"
      variant="outline"
      colorScheme="cyan"
      borderRadius="full"
      cursor={socketId ? "pointer" : "not-allowed"}
      onClick={show}
    >
      <TagLabel>Add event listener</TagLabel>
      <TagRightIcon boxSize="12px" as={AddIcon}/>
    </Tag>
  );
});

export default ListeningEvents;
