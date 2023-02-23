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
        <Link href={props.facebookUrl} className="btn-xl  btn">
          <FaFacebook className="scale-[2]" />
        </Link>
      )}
      {props.instagramUrl && (
        <Link href={props.instagramUrl} className="btn-xl  btn">
          <FaInstagram className="scale-[2]" />
        </Link>
      )}
      {props.twitterUrl && (
        <Link href={props.twitterUrl} className="btn-xl  btn">
          <FaTwitter className="scale-[2]" />
        </Link>
      )}
      {props.youtubeUrl && (
        <Link href={props.youtubeUrl} className="btn-xl  btn">
          <FaYoutube className="scale-[2]" />
        </Link>
      )}
      {props.linkedInUrl && (
        <Link href={props.linkedInUrl} className="btn-xl  btn">
          <FaLinkedin className="scale-[2]" />
        </Link>
      )}
      {props.pinterestUrl && (
        <Link href={props.pinterestUrl} className="btn-xl  btn">
          <FaPinterest className="scale-[2]" />
        </Link>
      )}
      {props.tiktokUrl && (
        <Link href={props.tiktokUrl} className="btn-xl  btn">
          <FaTiktok className="scale-[2]" />
        </Link>
      )}
      {props.snapchatUrl && (
        <Link href={props.snapchatUrl} className="btn-xl  btn">
          <FaSnapchat className="scale-[2]" />
        </Link>
      )}
      {props.whatsappUrl && (
        <Link href={props.whatsappUrl} className="btn-xl  btn">
          <FaWhatsapp className="scale-[2]" />
        </Link>
      )}
    </div>
  );
}
