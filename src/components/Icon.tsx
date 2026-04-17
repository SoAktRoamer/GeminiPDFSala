import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const LucideIcon = (LucideIcons as any)[name] || LucideIcons.File;
  return <LucideIcon className={className} />;
}
