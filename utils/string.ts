export const isBooleanString = (s: string): s is "true" | "false" =>
  s === "true" || s === "false";

export const toBoolean = (s: string): boolean => {
  if (!isBooleanString(s)) {
    throw new Error(`Invalid boolean string: ${s}`);
  }
  return s === "true";
};
