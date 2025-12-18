import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert 24-hour time format (HH:mm) to 12-hour format (h:mm AM/PM)
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @returns Time string in 12-hour format (e.g., "2:30 PM")
 */
export function formatTo12Hour(time: string): string {
  if (!time) return ''

  try {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const minute = minutes || '00'

    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12

    return `${hour12}:${minute} ${ampm}`
  } catch (error) {
    return time
  }
}

/**
 * Resolves a storage path to a full URL
 * @param path - The relative storage path (e.g., "/storage/venues/...")
 * @returns The full URL to the file
 */
export function getStorageUrl(path?: string): string {
  if (!path) return "/placeholder.svg";

  // If it's already a full URL, return it
  if (path.startsWith("http")) return path;

  // If it's a storage path, prepend the backend URL
  if (path.startsWith("/storage")) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    // Extract base URL (remove /api if present)
    const baseUrl = backendUrl.replace(/\/api\/?$/, "");
    return `${baseUrl}${path}`;
  }

  return path;
}
