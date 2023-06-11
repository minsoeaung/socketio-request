import { ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Heading, HStack, List, ListIcon, ListItem, Spacer, Tag, TagLabel, Text, } from "@chakra-ui/react";
import { useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import useStayAtBottomIfBottom from "../../hooks/useStayAtBottomIfBottom";

const IncomingEvents = () => {
  const {receivedEvents} = useSocket();

  const bottomMostElRef = useRef(null);

  useStayAtBottomIfBottom(receivedEvents, bottomMostElRef.current ?? undefined);

  return (
    <Box p={2} borderWidth="1px" h="100%">
      <Heading size="md" mb="4">
        <ArrowDownIcon color="red.500"/> Received events
      </Heading>
      <List
        spacing={3}
        maxH="calc(50vh - 100px)"
        overflowY="scroll"
        overflowX="hidden"
        pl="3"
      >
        {receivedEvents.map(({eventName, timestamp, payload}) => (
          <ListItem key={timestamp} ref={bottomMostElRef}>
            <HStack align="center" justify="space">
              <ListIcon as={ArrowDownIcon} color="red.500"/>
              <Tag variant="subtle" colorScheme="red">
                <TagLabel>{eventName}</TagLabel>
              </Tag>
              <Text>{payload}</Text>
              <Spacer/>
              <Text fontSize="sm" as="i" fontWeight="thin" paddingRight='10px'>
                at {new Date(timestamp).toLocaleTimeString()}
              </Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default IncomingEvents;
