const tryParseJSONObject = (jsonString: string): object | false => {
  try {
    const o = JSON.parse(jsonString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsy, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {
  }

  return false;
}

// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
export default tryParseJSONObject;
