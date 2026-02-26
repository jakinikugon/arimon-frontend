export const is_boolean_string = (s: string): s is "true" | "false" =>
  s === "true" || s === "false";

export const to_boolean = (s: string): boolean => {
  if (!is_boolean_string(s)) {
    throw new Error(`Invalid boolean string: ${s}`);
  }
  return s === "true";
};
