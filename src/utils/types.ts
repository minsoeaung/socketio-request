type Base64<imageType extends string> = `data:image/${imageType};base64${string}`;

export type EventArg<T = void> = T extends string ? Base64<T> : (string | object);
