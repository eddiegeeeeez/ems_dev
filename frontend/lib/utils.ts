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
