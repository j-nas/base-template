import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { env } from '../src/env/server.mjs'
import { getResources } from '../src/utils/cloudinaryApi'
export const prisma = new PrismaClient()


const imagesRes = await getResources()
const images = await prisma.image.createMany({
  data: imagesRes.resources.map((resource) => ({
    url: resource.url,
    public_Id: resource.public_id,
    format: resource.format,
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
    type: resource.type,
    id: resource.id,
    secure_url: resource.secure_url,
  })),
})

const admin = await prisma.user.create({
  data: {
    name: 'Jon Snow',
    email: 'jon@thewall.westeros',
  },
})
const client = await prisma.user.create({
  data: {
    name: 'Client',
    email: 'danaeris@targ.com',
  },
})
const business = await prisma.businessInfo.create({
  data: {
    title: 'Business name here',
    email: 'email@email.com',
    telephone: '123456789',
    addressFirstLine: 'First line',
    addressSecondLine: 'Second line',
    ownerName: 'Jon Snow',
    ownerTitle: 'CEO',
    ownerQuote: 'I am the king of the north',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    twitterUrl: 'https://twitter.com',
    youtubeUrl: 'https://youtube.com',
    linkedInUrl: 'https://linkedin.com',
    pinterestUrl: 'https://pinterest.com',
    tiktokUrl: 'https://tiktok.com',
    snapchatUrl: 'https://snapchat.com',
    whatsappUrl: 'https://whatsapp.com',
  },
})
await prisma.businessInfo.update({
  where: {
    id: business.id,
  },
  data: {
    inUse: true,
  },
})

const topHero = await prisma.hero.create({
  data: {
    title: 'Top hero',
    subtitle: 'Business name',
    image: 'https://placeimg.com/2500/1667/arch',
    description: "this is the hero description. include an exciting call to action here."
  },
})
await prisma.hero.update({
  where: {
    id: topHero.id,
  },
  data: {
    position: 'TOP',
  },
})

const bottomHero = await prisma.hero.create({
  data: {
    title: 'Bottom hero',
    subtitle: 'Service Name',
    image: 'https://placeimg.com/2500/1667/arch',
    description: "this is the hero description. include an exciting call to action here."
  },
})
await prisma.hero.update({
  where: {
    id: bottomHero.id,
  },
  data: {
    position: 'BOTTOM',
  },
})

const service1 = await prisma.service.create({
  data: {
    title: 'Service 1',
    summary: 'Two paragraphs about the service. This is another sentence.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    shortDescription: 'Short description, two sentences. This is another sentence.',
    markdown: "This the long form lorem ipsum. Lorem ipsum is dummy text, "
      + "which is used in the publishing industry or by web designers to "
      + "fill up their space. It is a long established fact that a reader "
      + "will be distracted by the readable content of a page when looking "
      + "at its layout. The point of using Lorem Ipsum is that it has a "
      + "more-or-less normal distribution of letters, as opposed to using "
      + "'Content here, content here', making it look like readable English. "
      + "Many desktop publishing packages and web page editors now use Lorem "
      + "Ipsum as their default model text, and a search for 'lorem ipsum' "
      + "will uncover many web sites still in their infancy. Various versions "
      + "have evolved over the years, sometimes by accident, sometimes on "
      + "purpose (injected humour and the like).\n This section can be as long as you would like, and can include many paragraphs and images, as it is serialized as a markdown document. ",
    icon: 'https://www.svgrepo.com/download/494429/man-suit-work.svg'
  },
})
await prisma.service.update({
  where: {
    id: service1.id,
  },
  data: {
    position: 'SERVICE1',
  },
})

const service2 = await prisma.service.create({
  data: {
    title: 'Service 2',
    summary: 'Two paragraphs about the service. This is another sentence.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    shortDescription: 'Short description, two sentences. This is another sentence.',
    markdown: "This the long form lorem ipsum. Lorem ipsum is dummy text, " +
      "which is used in the publishing industry or by web designers to " +
      "fill up their space. It is a long established fact that a reader " +
      "will be distracted by the readable content of a page when looking " +
      "at its layout. The point of using Lorem Ipsum is that it has a " +
      "more-or-less normal distribution of letters, as opposed to using " +
      "'Content here, content here', making it look like readable English. " +
      "Many desktop publishing packages and web page editors now use Lorem " +
      "Ipsum as their default model text, and a search for 'lorem ipsum' " +
      "will uncover many web sites still in their infancy. Various versions " +
      "have evolved over the years, sometimes by accident, sometimes on " +
      "purpose (injected humour and the like).\n This section can be as long as you would like, and can include many paragraphs and images, as it is serialized as a markdown document. ",
    icon: 'https://www.svgrepo.com/download/494429/man-suit-work.svg',
  },
})
await prisma.service.update({
  where: {
    id: service2.id,
  },
  data: {
    position: 'SERVICE2',
  },
})

const service3 = await prisma.service.create({
  data: {
    title: 'Service 3',
    summary: 'Two paragraphs about the service. This is another sentence.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    shortDescription: 'Short description, two sentences. This is another sentence.',
    markdown: "This the long form lorem ipsum. Lorem ipsum is dummy text, " +

      "which is used in the publishing industry or by web designers to " +
      "fill up their space. It is a long established fact that a reader " +
      "will be distracted by the readable content of a page when looking " +
      "at its layout. The point of using Lorem Ipsum is that it has a " +
      "more-or-less normal distribution of letters, as opposed to using " +
      "'Content here, content here', making it look like readable English. " +
      "Many desktop publishing packages and web page editors now use Lorem " +
      "Ipsum as their default model text, and a search for 'lorem ipsum' " +
      "will uncover many web sites still in their infancy. Various versions " +
      "have evolved over the years, sometimes by accident, sometimes on " +
      "purpose (injected humour and the like).\n This section can be as long as you would like, and can include many paragraphs and images, as it is serialized as a markdown document. ",
    icon: 'https://www.svgrepo.com/download/494429/man-suit-work.svg'

  },
})
await prisma.service.update({
  where: {
    id: service3.id,
  },
  data: {
    position: 'SERVICE3',
  },
})

const aboutUs = await prisma.aboutUs.create({
  data: {
    title: 'About Us',
    summary: 'Two paragraphs about the service. This is another sentence.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    insetImageUrl: 'https://placeimg.com/2500/1667/arch',
    markdown: "This the long form lorem ipsum. Lorem ipsum is dummy text, " +

      "which is used in the publishing industry or by web designers to " +
      "fill up their space. It is a long established fact that a reader " +
      "will be distracted by the readable content of a page when looking " +
      "at its layout. The point of using Lorem Ipsum is that it has a " +
      "more-or-less normal distribution of letters, as opposed to using " +
      "'Content here, content here', making it look like readable English. " +
      "Many desktop publishing packages and web page editors now use Lorem " +
      "Ipsum as their default model text, and a search for 'lorem ipsum' " +
      "will uncover many web sites still in their infancy. Various versions " +
      "have evolved over the years, sometimes by accident, sometimes on " +
      "purpose (injected humour and the like).\n This section can be as long as you would like, and can include many paragraphs and images, as it is serialized as a markdown document. ",

  },
})

await prisma.aboutUs.update({
  where: {
    id: aboutUs.id,
  },
  data: {
    inUse: true,
  },
})

const middleHero = await prisma.middleHero.create({
  data: {
    title: 'Middle Hero',
    subtitle: 'Two sentences about the hero. This is another sentence.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    insetImageUrl: 'https://placeimg.com/2500/1667/arch',
  }
})

await prisma.middleHero.update({
  where: {
    id: middleHero.id,
  },
  data: {
    inUse: true,
  },
})

const testimonial1 = await prisma.testimonial.create({
  data: {
    name: 'Joe Homeowner',
    title: 'CEO of Homeowner Inc.',
    avatarUrl: 'https://i.pravatar.cc/300',
    quote: 'This is a quote. ',
    highlighted: true,
  },
})

const testimonial2 = await prisma.testimonial.create({
  data: {
    name: 'Jane Homeowner',
    title: 'CEO of Homeowner Inc.',
    avatarUrl: 'https://i.pravatar.cc/300',
    quote: 'This is a quote. ',
    highlighted: true,
  },
})

const blog = await prisma.blog.create({
  data: {
    title: 'Sample blog post',
    summary: 'This is a sample blog post. This is another sentence.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
    imageUrl: 'https://placeimg.com/2500/1667/arch',
    markdown: "This the long form lorem ipsum. Lorem ipsum is dummy text, " +
      "which is used in the publishing industry or by web designers to " +
      "fill up their space. It is a long established fact that a reader " +
      "will ne *distracted* by the readable content of a page when looking " +
      "at its layout. The point of using Lorem Ipsum is that it has a " +
      "more-or-less normal distribution of letters, as opposed to using " +
      "'Content here, content here', making it look like readable English. " +
      "Many desktop publishing packages and web page editors now use Lorem " +
      "Ipsum as their default model text, and a search for 'lorem ipsum' " +
      "will uncover many web sites still in their infancy. Various versions " +
      "have evolved over the years, sometimes by accident, sometimes on " +
      "purpose (injected humour and the like).\n This section can be as long as you would like, and can include many paragraphs and images, as it is serialized as a markdown document. ",
    userId: admin.id,
  },
})







console.log({ admin, client, service1, service2, service3, aboutUs, middleHero, testimonial1, testimonial2, blog })
}

main().then(async () => {
  console.log('Done')
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
