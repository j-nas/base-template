import Image from "next/image";

type Props = {
  public_Id: string;
  height: number;
  width: number;
  alt: string;
  id: string;
  format: string;
  className?: string;
  blur: string;
};

export const CldImg = ({
  public_Id,
  height,
  width,
  alt,
  id,
  format,
  className,
  blur,
}: Props) => {
  return (
    <Image
      src={`https://res.cloudinary.com/dkascnwj7/image/upload/q_auto:eco,f_auto/v1674866703/base-template/${public_Id}.${format}`}
      alt={alt}
      height={height}
      width={width}
      id={id}
      className={className}
      blurDataURL={blur}
      placeholder="blur"
    />
  );
};

export default CldImg;
