import * as icons from "react-icons/fa";

type IconList = keyof typeof icons;

type Props = {
  icon: IconList;
  title: string;
  summary: string;
};

export default function ServiceSummaryCard({ icon, title, summary }: Props) {
  const Icon = icon ? icons[icon] : null;

  return (
    <div className="card rounded-none bg-base-300 ">
      <div className="card-body">
        <div className="mb-8 h-auto w-fit place-self-center rounded-full bg-primary py-4 px-4 text-center">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <h2 className=" text-center font-medium text-xl">{title}</h2>
        <p className="text-center">{summary}</p>
      </div>
    </div>
  );
}
