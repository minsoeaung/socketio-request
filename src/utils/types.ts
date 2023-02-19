type Base64<imageType extends string> = `data:image/${imageType};base64${string}`;

export type EventArg<T = void> = T extends string ? Base64<T> : (string | object);

// https://github.com/microsoft/TypeScript/issues/28046
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType>
    ? ElementType
    : never

export const payloadOptions = ['text', 'json', 'binary'] as const;
export type PayloadType = ElementType<typeof payloadOptions>;
