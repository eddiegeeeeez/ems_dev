// Mock data for development
// NOTE: Only user data is mocked. All other data should come from the backend API.

import type { User } from "./types"

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "edgar.garan@umindanao.edu.ph",
    name: "Edgar Allain Sobremonte Garan",
    role: "organizer",
    department: "Bachelor of Science in Information Technology",
    college: "College of Computer Studies",
    position: "Event Organizer",
    isOnboarded: true,
    avatar: "EA",
  },
  {
    id: "admin-1",
    email: "admin@umindanao.edu.ph",
    name: "Maria Santos",
    role: "admin",
    department: "Facilities Management",
    college: "University Administration",
    position: "Facility Manager",
    isOnboarded: true,
    avatar: "MS",
  },
  {
    id: "user-2",
    email: "newuser@umindanao.edu.ph",
    name: "John Doe",
    role: "organizer",
    isOnboarded: false,
    avatar: "JD",
  },
]

