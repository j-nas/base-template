import Link from "next/link";
import ImageStorageWidget from "./ImageStorageWidget";

export default function Sidebar() {
  return (
    <div className="relative hidden h-full w-80 bg-base-300 shadow-xl md:block">
      hello from sidebar
      <div>
        <ImageStorageWidget />
      </div>
    </div>
  );
}
