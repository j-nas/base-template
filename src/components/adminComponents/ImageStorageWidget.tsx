import { api } from "../../utils/api";
import { formatBytes } from "../../utils/format";
import { env } from "../../env/client.mjs";

export default function ImageStorageWidget() {
  const { data } = api.image.getTotalSize.useQuery();

  return (
    <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-end  px-4 py-2">
      <span className="">Image Storage</span>
      <progress
        className="progress progress-primary w-full bg-base-100"
        value={data?._sum.bytes || 0}
        max={env.NEXT_PUBLIC_IMAGE_STORAGE_LIMIT}
      ></progress>
      <span className="">
        {data?._sum.bytes ? formatBytes(data?._sum.bytes) : "0"} of{" "}
        {formatBytes(env.NEXT_PUBLIC_IMAGE_STORAGE_LIMIT)} used
      </span>
    </div>
  );
}
