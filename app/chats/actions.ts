"use server";

import { fetchUsers } from "@/db/queries/users";

export async function getUsers() {
  const users = await fetchUsers();
  return users;
}
