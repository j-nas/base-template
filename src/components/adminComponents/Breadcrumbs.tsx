import Link from "next/link";

type Props = {
  subPath?: string;
  subName?: string;
  subSubName?: string;
};

export default function Breadcrumbs({ subPath, subName, subSubName }: Props) {
  return (
    <div className="breadcrumbs min-h-12 place-self-start p-2 overflow-y-hidden scrollbar-none text-xs">
      <ul>
        <li>
          {subPath ? (
            <Link href="/admin">Dashboard Home</Link>
          ) : (
            "Dashboard Home"
          )}
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
        {subSubName && <li>{subSubName}</li>}
      </ul>
    </div>
  );
}
