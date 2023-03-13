import * as icons from "react-icons/fa";

type IconList = keyof typeof icons;

type Props = {
  icon: IconList;
};

export default function IconDisplay({ icon }: Props) {
  const Icon = icon ? icons[icon as IconList] : null;

  return <span>{Icon && <Icon className="h-6 w-6" />}</span>;
}
