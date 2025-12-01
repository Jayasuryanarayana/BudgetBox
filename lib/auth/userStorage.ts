import { get, set } from "idb-keyval";

export interface User {
  email: string;
  password: string; // In production, this should be hashed
  createdAt: number;
}

const USERS_STORAGE_KEY = "budgetbox-users";

/**
 * Get all users from storage
 */
export async function getUsers(): Promise<User[]> {
  try {
    const users = await get<User[]>(USERS_STORAGE_KEY);
    return users || [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

/**
 * Save a new user
 */
export async function saveUser(user: User): Promise<void> {
  try {
    const users = await getUsers();
    // Check if user already exists
    if (users.some((u) => u.email === user.email)) {
      throw new Error("User with this email already exists");
    }
    users.push(user);
    await set(USERS_STORAGE_KEY, users);
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find((u) => u.email === email) || null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

/**
 * Verify user credentials
 */
export async function verifyUser(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const user = await findUserByEmail(email);
    if (!user) return false;
    return user.password === password;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
}

