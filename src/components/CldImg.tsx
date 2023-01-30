import Image from "next/image";
type Props = {
  public_Id: string;
  height: number;
  width: number;
  alt: string;
  id: string;
  format: string;
  className?: string;
};

export const CldImg = ({
  public_Id,
  height,
  width,
  alt,
  id,
  format,
  className,
}: Props) => {
  return (
    <Image
      src={`https://res.cloudinary.com/dkascnwj7/image/upload/v1674866703/base-template/${public_Id}.${format}`}
      alt={alt}
      height={height}
      width={width}
      id={id}
      className={className}
    />
  );
};

export default CldImg;
