import { Box, Heading, HStack, Image, List, ListIcon, ListItem, Spacer, Tag, TagLabel, Text, } from "@chakra-ui/react";
import { useSocket } from "../../context/SocketContext";
import { ArrowRightIcon, ArrowUpIcon, Icon } from "@chakra-ui/icons";
import isBase64ImageString from "../../utils/isBase64ImageString";
import { useRef } from "react";
import useStayAtBottomIfBottom from "../../hooks/useStayAtBottomIfBottom";

const OutGoingEvents = () => {
  const {emittedEvents} = useSocket();

  const bottomMostElRef = useRef(null);

  console.log(emittedEvents)

  useStayAtBottomIfBottom(emittedEvents, bottomMostElRef.current ?? undefined);

  return (
    <Box p={2} borderWidth="1px" h="100%">
      <Heading size="md" mb="4">
        <ArrowUpIcon color="cyan.500"/> Emitted events
      </Heading>
      <List
        spacing={3}
        maxH="calc(50vh - 100px)"
        overflowY="scroll"
        overflowX="hidden"
        pl="3"
      >
        {emittedEvents.map(({eventName, payload, timestamp, withAck, ack}) => (
          <ListItem key={timestamp} ref={bottomMostElRef}>
            <HStack align="center" justify="space">
              <ListIcon as={ArrowUpIcon} color="cyan.500"/>
              <Tag variant="subtle" colorScheme="cyan">
                <TagLabel>{eventName}</TagLabel>
              </Tag>
              {typeof payload === "object" ? (
                <Text>{JSON.stringify(payload)}</Text>
              ) : (
                typeof payload === "string" &&
                (isBase64ImageString(payload) ? (
                  <Image
                    boxSize="70px"
                    objectFit="cover"
                    src={payload}
                    alt={eventName}
                  />
                ) : (
                  <Text>{payload}</Text>
                ))
              )}
              <Spacer/>
              <Text fontSize="sm" as="i" fontWeight="thin" paddingRight='10px'>
                at {new Date(timestamp).toLocaleTimeString()}
              </Text>
            </HStack>
            {withAck && (
              <HStack mt='5px'>
                <Text>Ack: </Text>
                <Icon as={ArrowRightIcon} color="red.200" marginLeft='2rem' w={2} h={2}/>
                <Text>{ack}</Text>
              </HStack>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OutGoingEvents;
