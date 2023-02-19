import {Box, Heading, HStack, Image, List, ListIcon, ListItem, Spacer, Tag, TagLabel, Text} from "@chakra-ui/react";
import {useSocket} from "../../context/SocketContext";
import {ArrowUpIcon} from "@chakra-ui/icons";

const OutGoingEvents = () => {
  const {outEvents} = useSocket();

  return (
    <Box p={5} shadow='md' borderWidth='1px' h='100%'>
      <Heading size='md' mb='4'>Outgoing events</Heading>
      <List spacing={3} maxH='50vh' overflow='scroll'>
        {outEvents.map((event) => (
          <ListItem key={event.timestamp}>
            <HStack align='center' justify='space'>
              <ListIcon as={ArrowUpIcon} color='green.500'/>
              <Tag variant='solid' colorScheme='blue'>
                <TagLabel>{event.event}</TagLabel>
              </Tag>
              {event.payloadType === 'binary' && typeof event.payload === 'string' && (
                <Image
                  boxSize='70px'
                  objectFit='cover'
                  src={event.payload}
                  alt={event.event}
                />
              )}
              {event.payloadType === 'json' && (
                <Text>{JSON.stringify(event.payload)}</Text>
              )}
              {event.payloadType === 'text' && typeof event.payload === 'string' && (
                <Text>{event.payload}</Text>
              )}
              <Spacer/>
              <Text fontSize='sm' as='i' fontWeight='thin'>at {event.timestamp}</Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default OutGoingEvents;
