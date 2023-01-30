import { PrismaClient } from '@prisma/client'
import { formattedResources } from '../src/utils/cloudinaryApi'

export const prisma = new PrismaClient()

async function main() {
  const imagesRes = await formattedResources()
  await prisma.image.createMany({
    data: imagesRes.map((resource) => ({
      public_Id: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      type: resource.type,
      secure_url: resource.secure_url,
      id: resource.asset_id,
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
      address: '123 Main Street',
      city: 'Vancouver',
      province: 'BC',
      postalCode: 'V1V1V1',
      ownerName: 'Mr Duck',
      ownerTitle: 'CEO',
      ownerQuote: 'Proudly serving the community, one duck at a time.',
      isActive: true,
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


  const frontHero = await prisma.hero.create({
    data: {
      heading: 'Front page hero heading text',
      ctaText: 'This is where the call to action goes. It should be concise and exciting.',
      PrimaryImage: {
        create: {
          image: {
            connect: {
              id: await validateImage('topHero')
            }
          }
        },
      },
      position: 'FRONT'
    }
  })

  const bottomHero = await prisma.hero.create({
    data: {
      heading: 'Bottom hero heading text',
      ctaText: 'This is where the call to action goes. It should be concise and exciting.',
      PrimaryImage: {
        create: {
          imageId: await validateImage('bottomHero')
        },
      },
      position: 'BOTTOM'
    },
  })


  const service1 = await prisma.service.create({
    data: {
      title: 'Tenant Improvement',
      shortDescription: 'We are experts in tenant improvement. From a single office to multi-floor renovations, we can help you make your space work for you.',
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
      icon: "mdi:head-lightbulb-outline",
      position: 'SERVICE1',
      PrimaryImage: {
        create: {
          imageId: await validateImage('commercial-primary')
        }
      },
      SecondaryImage: {
        create: {
          imageId: await validateImage('commercialsec')
        }
      },
    },
  })


  const service2 = await prisma.service.create({
    data: {
      title: 'Higherise Construction',
      shortDescription: 'From excavation to final finish, we have the expertise to get your project done on time and on budget.',
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
      icon: 'mdi:account-hard-hat-outline',
      position: 'SERVICE2',
      PrimaryImage: {
        create: {
          imageId: await validateImage('highrisepri')
        }
      },
      SecondaryImage: {
        create: {
          imageId: await validateImage('highrisesec')
        }
      },
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
      title: 'Fire Alarm Systems',
      shortDescription: 'Installation, repair and maintenance of fire alarm systems. We are certified to install and maintain all types of fire alarm systems.',
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
      icon: 'mdi:smoke-detector-variant',
      position: 'SERVICE3',
      PrimaryImage: {
        create: {
          imageId: await validateImage('firealarmpri')
        }
      },
      SecondaryImage: {
        create: {
          imageId: await validateImage('firealarmsec')
        }
      },


    },
  })


  const aboutUs = await prisma.aboutUs.create({
    data: {
      title: 'About Us',
      summary: 'In business since 1980, we have the experience and expertise to get your project done right.',
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
      PrimaryImage: {
        create: {
          imageId: await validateImage('aboutusprimary')
        }
      },
      SecondaryImage: {
        create: {
          imageId: await validateImage('aboutussecondary')
        }
      },
      inUse: true,


    },
  })



  const testimonial1 = await prisma.testimonial.create({
    data: {
      name: 'Joe Homeowner',
      title: 'CEO of Homeowner Inc.',
      quote: 'This is a quote. ',
      highlighted: true,
    },
  })

  const testimonial2 = await prisma.testimonial.create({
    data: {
      name: 'Jane Homeowner',
      title: 'CEO of Homeowner Inc.',
      quote: 'This is a quote. ',
      highlighted: true,
    },
  })
  console.log(
    aboutUs,
    service1,
    service2,
    service3,
    testimonial1,
    testimonial2,
    frontHero,
    bottomHero,
    business,
    admin,
    client,
  )
  async function validateImage(public_id: string) {

    const imageId = await prisma.image.findFirstOrThrow({
      where: {
        public_Id: {
          startsWith: public_id
        }
      }

    })
    const { id } = imageId

    return id
  }
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


