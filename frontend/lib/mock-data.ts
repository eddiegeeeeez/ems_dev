import type { User } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    avatar: "https://api.example.com/avatars/admin.jpg",
    department: "Admin",
  },
  {
    id: "2",
    name: "Event Organizer",
    email: "organizer@example.com",
    role: "ORGANIZER",
    avatar: "https://api.example.com/avatars/organizer.jpg",
    department: "Events",
  },
  {
    id: "3",
    name: "Regular Organizer",
    email: "organizer2@example.com",
    role: "ORGANIZER",
    avatar: "https://api.example.com/avatars/organizer2.jpg",
    department: "Events",
  },
]
