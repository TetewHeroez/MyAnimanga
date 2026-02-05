// In-memory user storage (replace with database later)
// This is for demo/development purposes

export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  avatar?: string;
  createdAt: Date;
}

export interface UserList {
  id: string;
  userId: string;
  type: "anime" | "manga" | "lightnovel";
  malId: number;
  title: string;
  titleEnglish: string | null;
  imageUrl: string;
  status: "watching" | "reading" | "completed" | "plan_to_watch" | "plan_to_read" | "dropped" | "on_hold";
  score: number | null;
  progress: number; // episodes watched / chapters read
  notes: string;
  addedAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users: Map<string, User> = new Map();
const userLists: Map<string, UserList[]> = new Map(); // userId -> lists

// User functions
export function createUser(user: User): User {
  users.set(user.id, user);
  userLists.set(user.id, []);
  return user;
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByUsername(username: string): User | undefined {
  return Array.from(users.values()).find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const user = users.get(id);
  if (!user) return undefined;
  
  const updated = { ...user, ...updates };
  users.set(id, updated);
  return updated;
}

// List functions
export function getUserLists(userId: string): UserList[] {
  return userLists.get(userId) || [];
}

export function addToUserList(userId: string, item: UserList): UserList {
  const lists = userLists.get(userId) || [];
  
  // Check if already exists
  const existingIndex = lists.findIndex(l => l.malId === item.malId && l.type === item.type);
  if (existingIndex >= 0) {
    // Update existing
    lists[existingIndex] = { ...lists[existingIndex], ...item, updatedAt: new Date() };
    userLists.set(userId, lists);
    return lists[existingIndex];
  }
  
  // Add new
  lists.push(item);
  userLists.set(userId, lists);
  return item;
}

export function updateUserListItem(userId: string, itemId: string, updates: Partial<UserList>): UserList | undefined {
  const lists = userLists.get(userId) || [];
  const index = lists.findIndex(l => l.id === itemId);
  
  if (index < 0) return undefined;
  
  lists[index] = { ...lists[index], ...updates, updatedAt: new Date() };
  userLists.set(userId, lists);
  return lists[index];
}

export function removeFromUserList(userId: string, itemId: string): boolean {
  const lists = userLists.get(userId) || [];
  const index = lists.findIndex(l => l.id === itemId);
  
  if (index < 0) return false;
  
  lists.splice(index, 1);
  userLists.set(userId, lists);
  return true;
}

export function getListItemByMalId(userId: string, malId: number, type: "anime" | "manga" | "lightnovel"): UserList | undefined {
  const lists = userLists.get(userId) || [];
  return lists.find(l => l.malId === malId && l.type === type);
}
