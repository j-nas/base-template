import { type BusinessInfo } from "@prisma/client";
import Link from "next/link";

type Props = Omit<BusinessInfo, "createdAt" | "updatedAt">;
export default function Socials(props: Props) {
  return (
    <div className="flex flex-wrap justify-items-end gap-1">
      {props.facebookUrl && (
        <Link href={props.facebookUrl} className="btn-xl  btn">
          <span>FB</span>
        </Link>
      )}
      {props.instagramUrl && (
        <Link href={props.instagramUrl} className="btn-xl  btn">
          <span>IG</span>
        </Link>
      )}
      {props.twitterUrl && (
        <Link href={props.twitterUrl} className="btn-xl  btn">
          <span>TW</span>
        </Link>
      )}
      {props.youtubeUrl && (
        <Link href={props.youtubeUrl} className="btn-xl  btn">
          <span>YT</span>
        </Link>
      )}
      {props.linkedInUrl && (
        <Link href={props.linkedInUrl} className="btn-xl  btn">
          <span>LI</span>
        </Link>
      )}
      {props.pinterestUrl && (
        <Link href={props.pinterestUrl} className="btn-xl  btn">
          <span>PT</span>
        </Link>
      )}
      {props.tiktokUrl && (
        <Link href={props.tiktokUrl} className="btn-xl  btn">
          <span>TT</span>
        </Link>
      )}
      {props.snapchatUrl && (
        <Link href={props.snapchatUrl} className="btn-xl  btn">
          <span>SC</span>
        </Link>
      )}
      {props.whatsappUrl && (
        <Link href={props.whatsappUrl} className="btn-sm  btn">
          <span>WA</span>
        </Link>
      )}
    </div>
  );
}
