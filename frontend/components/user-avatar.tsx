"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon } from 'lucide-react'

interface UserAvatarProps {
  name?: string
  email?: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showInitials?: boolean
  useImageUrl?: boolean
}

export function UserAvatar({
  name = "User",
  email,
  avatar,
  size = 'md',
  showInitials = true,
  useImageUrl = false,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-10 w-10 text-sm',
    xl: 'h-20 w-20 text-2xl',
  }

  // Generate DiceBear avatar URL if useImageUrl is true
  const getAvatarImageUrl = () => {
    if (avatar && !useImageUrl) return undefined
    if (avatar && useImageUrl) return avatar
    if (useImageUrl && email) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    }
    return undefined
  }

  const getInitials = () => {
    if (showInitials && name) {
      const parts = name.trim().split(' ')
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase()
    }
    return 'U'
  }

  const imageUrl = getAvatarImageUrl()

  return (
    <Avatar className={`${sizeClasses[size]} bg-[#8B1538] flex-shrink-0`}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} className="object-cover" />}
      <AvatarFallback className="bg-[#8B1538] text-white font-bold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  )
}

interface UserIconButtonProps {
  size?: 'sm' | 'md' | 'lg'
}

export function UserIconButton({ size = 'md' }: UserIconButtonProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-[#8B1538] text-white hover:bg-[#6B0D28] transition-colors cursor-pointer`}>
      <UserIcon className="h-4 w-4" />
    </div>
  )
}
