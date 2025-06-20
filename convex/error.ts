import { ConvexError } from "convex/values";

export function errorHandler(fn: Function) {
  try {
    return fn();
  } catch (e) {
    const error = e as ConvexError<any>;
    console.log(error.message);
  }
}
