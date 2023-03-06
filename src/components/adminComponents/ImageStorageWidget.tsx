import { api } from "../../utils/api";

export default function ImageStorageWidget() {
  const { data } = api.image.getTotalSize.useQuery();

  return (
    <div className="absolute bottom-0 left-0 flex w-full  flex-col place-content-center gap-2 place-self-end bg-base-100 px-4 py-2">
      <span className="">Image Storage</span>
      <progress
        className="w- progress progress-primary"
        value={data?._sum.bytes || 0}
        max="100000000"
      ></progress>
      <span className="">
        {data?._sum.bytes ? formatBytes(data?._sum.bytes) : "0"} of 100MB used
      </span>
    </div>
  );
}

function formatBytes(bytes = 0, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
