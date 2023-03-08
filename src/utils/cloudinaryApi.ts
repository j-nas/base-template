import axios from 'axios';
import { env } from '../env/server.mjs'
import getBase64ImageUrl from './generateBlurPlaceholder';
import cloudinary, { type ConfigOptions } from "cloudinary";

const cloudinaryConfig: ConfigOptions = {
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
};

export const cloudinaryApi = cloudinary.v2.config(cloudinaryConfig)

export type CloudinaryResource = {
  resources: [{
    public_id: string;
    format: string;
    width: number;
    height: number;
    url: string;
    secure_url: string;
    bytes: number;
    type: string;
    asset_id: string;
    version: number;
  }]
}

export const getResources = async () => {
  const response = await axios.get(
    `https://${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/search`,
    { data: { expression: `folder:${"base-template"}` } }
  )

  return response.data as CloudinaryResource

}

export const formattedResources = async () => {
  const resources = await getResources()
  const formattedResources = resources.resources.map(async (resource) => ({
    ...resource,
    public_id: resource.public_id.replace(`${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/`, ''),
    blur_url: await getBase64ImageUrl(resource.public_id, resource.format).then((url) => url)
  }))
  return formattedResources.map(async (resource) => await resource)
}

export const cloudinaryUrlGenerator = (id = "", format = "") => {
  return `https://res.cloudinary.com/dkascnwj7/image/upload/q_auto:eco,f_auto/base-template/${id}.${format}`
}

