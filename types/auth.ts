import { SessionType, UserType } from "./user";

export type LoginType = (credentials: {
  email: string;
  password: string;
}) => Promise<{
  user: UserType;
  session: SessionType;
}>;
