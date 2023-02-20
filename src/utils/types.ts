export type Base64String = `data:image/${string};base64${string}`;

// For 3 types of payload mode -> "text", "json" or "binary"
export type Payload = string | object | Base64String | undefined;

// https://github.com/microsoft/TypeScript/issues/28046
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType>
    ? ElementType
    : never
