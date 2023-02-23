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
        <Link href={props.facebookUrl} className="btn-ghost btn-sm btn">
          <FaFacebook className="scale-[1.75]" />
        </Link>
      )}
      {props.instagramUrl && (
        <Link href={props.instagramUrl} className="btn-ghost btn-sm btn">
          <FaInstagram className="scale-[1.75]" />
        </Link>
      )}
      {props.twitterUrl && (
        <Link href={props.twitterUrl} className="btn-ghost btn-sm btn">
          <FaTwitter className="scale-[1.75]" />
        </Link>
      )}
      {props.youtubeUrl && (
        <Link href={props.youtubeUrl} className="btn-ghost btn-sm btn">
          <FaYoutube className="scale-[1.75]" />
        </Link>
      )}
      {props.linkedInUrl && (
        <Link href={props.linkedInUrl} className="btn-ghost btn-sm btn">
          <FaLinkedin className="scale-[1.75]" />
        </Link>
      )}
      {props.pinterestUrl && (
        <Link href={props.pinterestUrl} className="btn-ghost btn-sm btn">
          <FaPinterest className="scale-[1.75]" />
        </Link>
      )}
      {props.tiktokUrl && (
        <Link href={props.tiktokUrl} className="btn-ghost btn-sm btn">
          <FaTiktok className="scale-[1.75]" />
        </Link>
      )}
      {props.snapchatUrl && (
        <Link href={props.snapchatUrl} className="btn-ghost btn-sm btn">
          <FaSnapchat className="scale-[1.75]" />
        </Link>
      )}
      {props.whatsappUrl && (
        <Link href={props.whatsappUrl} className="btn-ghost btn-sm btn">
          <FaWhatsapp className="scale-[1.75]" />
        </Link>
      )}
    </div>
  );
}
