import type { ReactElement } from "react";
import { Layout } from "../../components/AdminComponents";

export const ImageManager = () => {
  return (
    <div className="relative grid h-full w-full  place-items-center overflow-auto">
      <div>
        <h1>Image Managment</h1>
      </div>
      <footer className="absolute bottom-0 right-0 h-12 w-full"> hello</footer>
    </div>
  );
};

export default ImageManager;

ImageManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
