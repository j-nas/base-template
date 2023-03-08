import Link from "next/link";

type Props = {
  subPath?: string;
  subName?: string;
  subSubName?: string;
};

export default function Breadcrumbs({ subPath, subName, subSubName }: Props) {
  return (
    <div className="text-md breadcrumbs place-self-start p-2">
      <ul>
        <li>
          <Link href="/admin">Dashboard Home</Link>
        </li>
        {subName && subPath && (
          <li>
            {subSubName ? (
              <Link href={`/admin/${subPath}`}>{subName}</Link>
            ) : (
              subName
            )}
          </li>
        )}
        {subSubName && <li>Add Document</li>}
      </ul>
    </div>
  );
}
