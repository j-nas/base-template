import Link from "next/link";

export default function NotAuthorized() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="font-bold text-2xl">
        You are not authorized to view this page
      </h1>
      <Link href="/admin/">
        <span className="text-primary">Go back to dashboard home</span>
      </Link>
    </div>
  );
}
