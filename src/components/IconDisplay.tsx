import * as icons from "react-icons/fa";

export type IconList = keyof typeof icons;

type Props = {
  icon: IconList;
};

export default function IconDisplay({ icon }: Props) {
  const Icon = icon ? icons[icon] : null;

  return <span>{Icon && <Icon className="h-6 w-6" />}</span>;
}
