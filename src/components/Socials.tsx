import { type BusinessInfo } from "@prisma/client";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
} from "react-icons/fa";
import Link from "next/link";

type Props = Omit<BusinessInfo, "createdAt" | "updatedAt">;
export default function Socials(props: Props) {
  return (
    <div className="flex flex-wrap justify-items-end gap-1">
      {props.facebookUrl && (
        <Link
          aria-label="facebook"
          href={props.facebookUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaFacebook className="scale-[1.75]" />
        </Link>
      )}
      {props.instagramUrl && (
        <Link
          href={props.instagramUrl}
          className="btn btn-ghost btn-sm"
          aria-label="instagram"
        >
          <FaInstagram className="scale-[1.75]" />
        </Link>
      )}
      {props.twitterUrl && (
        <Link
          href={props.twitterUrl}
          className="btn btn-ghost btn-sm"
          aria-label="twitter"
        >
          <FaTwitter className="scale-[1.75]" />
        </Link>
      )}
      {props.youtubeUrl && (
        <Link
          aria-label="youtube"
          href={props.youtubeUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaYoutube className="scale-[1.75]" />
        </Link>
      )}
      {props.linkedInUrl && (
        <Link
          aria-label="linkedin"
          href={props.linkedInUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaLinkedin className="scale-[1.75]" />
        </Link>
      )}
      {props.pinterestUrl && (
        <Link
          aria-label="pinterest"
          href={props.pinterestUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaPinterest className="scale-[1.75]" />
        </Link>
      )}
      {props.tiktokUrl && (
        <Link
          aria-label="tiktok"
          href={props.tiktokUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaTiktok className="scale-[1.75]" />
        </Link>
      )}
      {props.snapchatUrl && (
        <Link
          aria-label="snapchat"
          href={props.snapchatUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaSnapchat className="scale-[1.75]" />
        </Link>
      )}
      {props.whatsappUrl && (
        <Link
          aria-label="whatsapp"
          href={props.whatsappUrl}
          className="btn btn-ghost btn-sm"
        >
          <FaWhatsapp className="scale-[1.75]" />
        </Link>
      )}
    </div>
  );
}
