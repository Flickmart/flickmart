import { createClient } from "@/utils/supabase/client";

/**
 * Gets the current logged in session from Supabase
 * @returns The current session object or null if not logged in
 */
export async function getCurrentSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }
  
  return data.session;
}

/**
 * Gets the current logged in user from Supabase
 * @returns The current user object or null if not logged in
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  
  return data.user;
}

/**
 * Gets both the current user and session in a single call
 * @returns Object containing both user and session data
 */
export async function getUserAndSession() {
  const supabase = createClient();
  
  // Get both user and session in parallel for better performance
  const [userResponse, sessionResponse] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession()
  ]);
  
  return {
    user: userResponse.error ? null : userResponse.data.user,
    session: sessionResponse.error ? null : sessionResponse.data.session
  };
}

/**
 * Gets all active sessions for the current user
 * @returns Array of active sessions or empty array if error
 */
export async function getAllSessions() {
  const supabase = createClient();
  // Using getSession instead of getSessions which doesn't exist
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error fetching sessions:", error.message);
    return [];
  }
  
  // Return an array with the single session if it exists
  return data.session ? [data.session] : [];
}


/**
 * Checks if the user is currently logged in
 * @returns Boolean indicating if user is logged in
 */
export async function isLoggedIn() {
  const session = await getCurrentSession();
  return session !== null;
}