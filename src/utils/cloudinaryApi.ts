import axios from 'axios';
import { env } from '../env/server.mjs'

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
  return resources.resources.map((resource) => ({
    ...resource,
    public_id: resource.public_id.replace(`${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/`, ''),
  }))
}

export const cloudinaryUrlGenerator = (id = "", format = "") => {
  return `https://res.cloudinary.com/dkascnwj7/image/upload/q_auto:eco,f_auto/base-template/${id}.${format}`
}