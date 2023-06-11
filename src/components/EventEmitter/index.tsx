import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ChangeEventHandler, KeyboardEventHandler, useCallback, useRef, useState, } from "react";
import getBase64 from "../../utils/getBase64";
import { useSocket } from "../../context/SocketContext";
import tryParseJSONObject from "../../utils/tryParseJSONObject";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { Base64String, ElementType } from "../../utils/types";

const PAYLOAD_MODES = ["text", "json", "binary"] as const;

type PayloadMode = ElementType<typeof PAYLOAD_MODES>;

const EventEmitter = () => {
  const [selectedPayloadMode, setSelectedPayloadMode] =
    useState<PayloadMode>("text");
  const [base64Str, setBase64Str] = useState<Base64String>();
  const [json, setJson] = useState<object>();
  const [eventName, setEventName] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number>();
  const {emitEvent, socketId} = useSocket();

  const handlePayloadTypeChange = useCallback((value: PayloadMode) => {
    setSelectedPayloadMode(value);
  }, []);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.files) {
        const file = e.target.files[0];
        getBase64(file).then((base64Str) => {
          setBase64Str(base64Str);
        });
      }
    },
    []
  );

  const handleSend = () => {
    switch (selectedPayloadMode) {
      case "text":
        emitEvent(eventName, textInputRef.current?.value ?? "");
        return;
      case "json":
        emitEvent(eventName, json ?? {});
        return;
      case "binary":
        emitEvent(eventName, base64Str);
        return;
    }
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Box p={2} borderWidth="1px" h="100%">
      <Flex
        direction="column"
        alignItems="end"
        justifyContent="space-between"
        h="100%"
      >
        <VStack justifyContent="start" alignItems="start" w="100%">
          <Heading size="md" mb="4">
            Emit event
          </Heading>
          <RadioGroup
            onChange={handlePayloadTypeChange}
            value={selectedPayloadMode}
          >
            <Stack direction="row">
              {PAYLOAD_MODES.map((option) => (
                <Radio key={option} value={option}>
                  {option.toUpperCase()}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Box mt="2" p="2" borderWidth="1px" w="100%" minH="200px" maxW="50vw">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden={selectedPayloadMode !== "binary"}
            />
            <Box pos="relative" hidden={selectedPayloadMode !== "json"}>
              <Textarea
                onChange={(e) => {
                  clearTimeout(timerRef.current);
                  setJson(undefined);
                  timerRef.current = setTimeout(() => {
                    const result = tryParseJSONObject(e.target.value);
                    if (result) {
                      setJson(result);
                    }
                  }, 700);
                }}
                height="auto"
                rows={7}
              />
              {json ? (
                <CheckIcon pos="absolute" top={1} right={1} color="green.500"/>
              ) : (
                <WarningIcon pos="absolute" top={1} right={1} color="red.500"/>
              )}
            </Box>
            <Textarea
              placeholder="text"
              ref={textInputRef}
              hidden={selectedPayloadMode !== "text"}
            />
          </Box>
        </VStack>
        <HStack maxW="50%">
          <Input
            placeholder="Event"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            colorScheme="teal"
            variant="outline"
            isDisabled={!eventName.trim() || !socketId}
            onClick={handleSend}
          >
            Send
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default EventEmitter;
