/**
 * Utility functions for authentication-related operations
 */

import type { Id } from '@/convex/_generated/dataModel';

export type User = {
  _id: Id<'users'>;
  name: string;
  email: string;
  imageUrl?: string;
  username?: string;
  description?: string;
  contact?: {
    phone?: string;
    address?: string;
  };
  _creationTime: number;
};

/**
 * Type guard to check if user is properly loaded
 */
export function isUserLoaded(user: any): user is User {
  return user?._id;
}

/**
 * Get user display name with fallback
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) {
    return 'Unknown User';
  }
  return user.name || user.username || 'User';
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: User | null | undefined): string {
  if (!user?.name) {
    return 'U';
  }
  return user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if user has completed profile setup
 */
export function isProfileComplete(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }
  return !!(user.name && user.email);
}

/**
 * Format user join date
 */
export function formatJoinDate(user: User | null | undefined): string {
  if (!user?._creationTime) {
    return '';
  }
  return new Date(user._creationTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
