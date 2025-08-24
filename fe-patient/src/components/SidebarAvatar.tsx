import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function SidebarAvatar({ name }: { name?: string }) {
  // Helper to get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  return (
    <Avatar>
      <AvatarImage src="/user-default.svg" alt={name || 'User'} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
