import { Icon, type IconProps } from "./Icon";

export function CodeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
    </Icon>
  );
}
