import axios from 'axios';
import { env } from '../env/server.mjs'
import getBase64ImageUrl from './generateBlurPlaceholder.js';

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
  }]
}

export const getResources = async () => {
  const response = await axios.get(
    `https://${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/search`,
    { data: { expression: `folder:${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}` } }
  )


  return response.data as CloudinaryResource

}

export const formattedResources = async () => {
  const resources = await getResources()
  const formattedResources = resources.resources.map(async (resource) => ({
    ...resource,
    public_id: resource.public_id.replace(`${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/`, ''),
    blur_url: getBase64ImageUrl(resource.public_id, resource.format).then((url) => url)
  }))
  return formattedResources
}

export const cloudinaryUrlGenerator = (id = "", format = "") => {
  return `https://res.cloudinary.com/dkascnwj7/image/upload/q_auto:eco,f_auto/base-template/${id}.${format}`
}

