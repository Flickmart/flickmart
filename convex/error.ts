import { ConvexError } from "convex/values";

export function errorHandler(fn: Function) {
  try {
    const output = fn();
    return output;
  } catch (e) {
    const error = e as ConvexError<any>;
    console.log(error.message);
  }
}
