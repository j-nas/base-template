import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import { env } from '../env/client.mjs'



export default async function getBase64ImageUrl(
  public_Id: string, format: string
) {
  let url = ""
  const response = await fetch(
    `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/f_jpg,w_8,q_70/${public_Id}.${format}`
  )
  const buffer = await response.arrayBuffer()

  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  })

  url = `data:image/jpeg;base64,${Buffer.from(minified).toString('base64')}`
  return url
}