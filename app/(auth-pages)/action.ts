"use server";
import { formSchema } from "@/components/auth/sign-up-stages/StageOne";
import { insertUser } from "@/db";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

// Sign Up
export async function createUser(newUser: z.infer<typeof formSchema>) {
  const supabase = createClient();
  const { email, password, firstName, lastName } = newUser;

  // Sign up with supabase built in function
  const { data, error } = await (
    await supabase
  ).auth.signUp({
    email,
    password,
  });

  if (error) throw Error(error.message);
  else {
    // If no error, insert user details into custom users table
    const user = await insertUser({
      name: firstName.concat(" ", lastName),
      email,
    });
    console.log(user);
    return { ...user, status: "successful" };
  }
}
