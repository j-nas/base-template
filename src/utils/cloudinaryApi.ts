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
    id: string;
  }]
}

export const getResources = async () => {
  const response = await axios.get(
    `https://${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/search`,
    { data: { expression: `folder:${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}` } }
  )
  return response.data as CloudinaryResource

}