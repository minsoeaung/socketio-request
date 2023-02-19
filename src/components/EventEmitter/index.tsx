import {Box, Button, Flex, Heading, HStack, Input, Radio, RadioGroup, Stack, Textarea, VStack} from "@chakra-ui/react";
import {ChangeEventHandler, KeyboardEventHandler, useCallback, useRef, useState} from "react";
import getBase64 from "../../utils/getBase64";
import {useSocket} from "../../context/SocketContext";
import {payloadOptions, PayloadType} from "../../utils/types";

const EventEmitter = () => {
  const [payloadType, setPayloadType] = useState<PayloadType>('text');
  const [base64Str, setBase64Str] = useState('');
  const eventNameInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const {emitEvent} = useSocket();

  const handlePayloadTypeChange = useCallback((value: PayloadType) => {
    setPayloadType(value);
  }, [])

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      getBase64(file).then((base64Str) => {
        setBase64Str(base64Str as string);
      });
    }
  }, [])

  const handleSend = () => {
    if (!eventNameInputRef.current) return;
    const eventName = eventNameInputRef.current.value;
    switch (payloadType) {
      case "text":
        emitEvent(eventName, textInputRef.current?.value ?? '', payloadType);
        return;
      case "json":
        emitEvent(eventName, 'wait', payloadType);
        return;
      case "binary":
        emitEvent(eventName, base64Str, payloadType);
        return;
    }
  }

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }

  return (
    <Box p={5} shadow='md' borderWidth='1px' h='100%'>
      <Flex direction='column' alignItems='end' justifyContent='space-between' h='100%'>
        <VStack justifyContent='start' alignItems='start' w='100%'>
          <Heading size='md' mb='4'>Emit event</Heading>
          <RadioGroup onChange={handlePayloadTypeChange} value={payloadType}>
            <Stack direction='row'>
              {payloadOptions.map(option => (
                <Radio key={option} value={option}>{option.toUpperCase()}</Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Box mt='2' p='2' borderWidth='1px' w='100%' minH='200px'>
            {payloadType === 'binary' && (
              <input type='file' onChange={handleFileChange}/>
            )}
            {payloadType === 'text' && (
              <Textarea placeholder='text' ref={textInputRef}/>
            )}
          </Box>
        </VStack>
        <HStack maxW='50%'>
          <Input placeholder='Event name' ref={eventNameInputRef} onKeyDown={handleKeyDown}/>
          <Button
            colorScheme='teal'
            variant='outline'
            disabled
            onClick={handleSend}
          >
            Send
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

export default EventEmitter;
