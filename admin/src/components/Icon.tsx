import { icons } from 'lucide-react';

export type IconProps = {
  name: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, color = "#aaa" }) => {
  const LucideIcon = (icons as any)[name as any];
  if(!LucideIcon) return <span>.</span>

  return <><LucideIcon /></>;
};

export default Icon;
