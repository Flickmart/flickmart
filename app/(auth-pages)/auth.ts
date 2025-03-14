import { LoginType } from "@/types/auth";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Verify  email
export async function verifyOtp({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, error } = await supabase.auth.verifyOtp({
    token,
    type: "signup",
    email,
  });
  return data;
}

// Login with email and password
export const login: LoginType = async function (credentials) {
  const {
    data: { session: sessionData, user: userData },
    error,
  } = await supabase.auth.signInWithPassword(credentials);

  if (error?.message) throw Error(error.message);

  if (!sessionData || !userData)
    throw Error("Invalid login response from Supabase");

  const session = {
    access_token: sessionData.access_token,
    expires_at: sessionData.expires_at,
    expires_in: sessionData.expires_in,
    refresh_token: sessionData.refresh_token,
    token_type: sessionData.token_type,
  };

  const user = {
    created_at: userData.created_at,
    id: userData.id,
    email: userData.email,
    role: userData.role,
    is_anonymous: userData.is_anonymous,
    last_sign_in_at: userData.created_at,
    phone: userData.created_at,
  };

  return { user, session };
};

// Login in with google
export async function authWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw Error(error.message);
}

// Retrieve User & session
export async function retrieveUserSession() {
  const { data: user, error: userErr } = await supabase.auth.getUser();
  const { data: session, error: sessionErr } = await supabase.auth.getSession();

  if (userErr || sessionErr)
    console.log(sessionErr?.message || userErr?.message);

  return { session: session.session, user: user.user };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  localStorage.clear();
  if (!error) console.log("Logged out");
}
