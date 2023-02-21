export type Base64String = `data:image/${string};base64${string}`;

// For 3 types of payload mode -> "text", "json" or "binary"
export type Payload = string | object | Base64String | undefined;

// https://github.com/microsoft/TypeScript/issues/28046
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

// For component use
export type HeaderInfo = {
  key: string;
  value: string;
  isActive: boolean;
};

// For attaching to extraHeaders
export type Headers = Record<string, string>;

export type EmittedEvent = {
  eventName: string;
  payload: Payload;
  timestamp: string;
};

export type ReceivedEvent = {
  eventName: string;
  payload: string;
  timestamp: string;
};

export type ListeningEvent = {
  eventName: string;
  isActive: boolean;
};
