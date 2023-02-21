import {Box, Heading, HStack, Image, List, ListIcon, ListItem, Spacer, Tag, TagLabel, Text,} from "@chakra-ui/react";
import {useSocket} from "../../context/SocketContext";
import {ArrowUpIcon} from "@chakra-ui/icons";
import isBase64ImageString from "../../utils/isBase64ImageString";

const OutGoingEvents = () => {
  const { emittedEvents } = useSocket();

  return (
    <Box p={5} shadow="md" borderWidth="1px" h="100%">
      <Heading size="md" mb="4">
        Outgoing events
      </Heading>
      <List
        spacing={3}
        maxH="calc(50vh - 100px)"
        overflowY="scroll"
        overflowX="hidden"
      >
        {emittedEvents.map(({ eventName, payload, timestamp }) => (
          <ListItem key={timestamp}>
            <HStack align="center" justify="space">
              <ListIcon as={ArrowUpIcon} color="cyan.500" />
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
              <Spacer />
              <Text fontSize="sm" as="i" fontWeight="thin">
                at {timestamp}
              </Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OutGoingEvents;
