import { PrismaClient } from '@prisma/client'
import { formattedResources } from '../src/utils/cloudinaryApi'
import { faker } from '@faker-js/faker';

export const prisma = new PrismaClient()

async function main() {
  const imagesRes = await Promise.all(await formattedResources())
  console.log('Images fetched, formatted and blur url generated')
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
      blur_url: resource.blur_url
    })),
  })
  console.log('Images created')

  const nineGalleryImages = await prisma.image.findMany({
    where: {
      public_Id: {
        not: {
          startsWith: 'avatar'
        }
      }
    },
    take: 9,

  })
  console.log('nineGalleryImages created')

  const gallery = await prisma.gallery.create({
    data: {
      name: 'Gallery',
      ImageForGallery: {
        create: nineGalleryImages.map((image) => ({
          imageId: image.id,
          altText: faker.lorem.sentence(3),
        })),
      },
      position: 'FRONT',
    }
  })
  console.log('Gallery created')

  const fullGalleryImages = await prisma.image.findMany({
    where: {
      public_Id: {
        not: {
          startsWith: 'avatar'
        }
      }
    },
  })

  const fullGallery = await prisma.gallery.create({
    data: {
      name: 'Gallery',
      ImageForGallery: {
        create: fullGalleryImages.map((image) => ({
          imageId: image.id,
          altText: faker.lorem.sentence(3),
        })),
      },
      position: 'MAIN',
    }
  })
  console.log('Full Gallery created')




  const admin = await prisma.user.create({
    data: {
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
    },
  })
  console.log('Admin created')
  const client = await prisma.user.create({
    data: {
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
    },
  })
  console.log('Client created')
  const business = await prisma.businessInfo.create({
    data: {
      title: faker.company.name() + ' ' + faker.company.companySuffix(),
      email: faker.internet.email(),
      telephone: faker.phone.number('604-###-####'),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      province: 'BC',
      postalCode: 'V1V1V1',
      ownerName: faker.name.firstName() + ' ' + faker.name.lastName(),
      ownerTitle: faker.name.jobTitle(),
      ownerQuote: faker.company.catchPhrase(),
      isActive: true,
      hours: 'Mon - Fri: 9am - 5pm',
      holidays: 'Closed on all holidays',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: 'https://twitter.com',
      whatsappUrl: 'https://whatsapp.com',
      //////////////////////////////////////////////////////////////////
      // Uncomment the following lines to add more social media links.//
      // Social media links are optional, and will only be rendered   //
      // if they are present.                                         //
      //////////////////////////////////////////////////////////////////
      // youtubeUrl: 'https://youtube.com',
      // linkedInUrl: 'https://linkedin.com',
      // pinterestUrl: 'https://pinterest.com',
      // tiktokUrl: 'https://tiktok.com',
      // snapchatUrl: 'https://snapchat.com',
    },
  })
  console.log('Business created')


  const frontHero = await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
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
  console.log('Front Hero created')

  const bottomHero = await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      PrimaryImage: {
        create: {
          imageId: await validateImage('bottomHero')
        },
      },
      position: 'BOTTOM'
    },
  })
  console.log('Bottom Hero created')

  const topHero = await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      PrimaryImage: {
        create: {
          imageId: await validateImage('bottomHero')
        },
      },
      position: 'TOP'
    },
  })
  console.log('Top Hero created')

  const service1 = await prisma.service.create({
    data: {
      title: faker.commerce.productName(),
      pageName: faker.helpers.unique(faker.commerce.department),
      shortDescription: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(3),
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
  console.log('Service 1 created')

  const service2 = await prisma.service.create({
    data: {
      title: faker.commerce.productName(), pageName: faker.helpers.unique(faker.commerce.department),

      shortDescription: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(3),
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
  console.log('Service 2 created')
  const service3 = await prisma.service.create({
    data: {
      title: faker.commerce.productName(),
      pageName: faker.helpers.unique(faker.commerce.department),
      shortDescription: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(3),
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
  console.log('Service 3 created')
  const service4 = await prisma.service.create({
    data: {
      title: faker.commerce.productName(),
      pageName: faker.helpers.unique(faker.commerce.department),
      shortDescription: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(4),
      icon: 'mdi:smoke-detector-variant',
      position: 'SERVICE4',
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
  console.log('Service 4 created')
  const service5 = await prisma.service.create({
    data: {
      title: faker.commerce.productName(),
      pageName: faker.helpers.unique(faker.commerce.department),
      shortDescription: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(5),
      icon: 'mdi:smoke-detector-variant',
      position: 'SERVICE5',
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
  console.log('Service 5 created')
  const aboutUs = await prisma.aboutUs.create({
    data: {
      title: 'About Us',
      summary: faker.commerce.productDescription(),
      markdown: faker.lorem.paragraphs(3),
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
  console.log('About Us created')


  const testimonial1 = await prisma.testimonial.create({
    data: {
      name: faker.name.firstName('female') + ' ' + faker.name.lastName(),
      title: faker.name.jobTitle() + ' of ' + faker.company.name(),
      quote: faker.company.bs(),
      highlighted: true,
      AvatarImage: {
        create: {
          imageId: await validateImage('avatar1')
        }
      },
    },
  })
  console.log('Testimonial 1 created')
  const testimonial2 = await prisma.testimonial.create({
    data: {
      name: faker.name.firstName('male') + ' ' + faker.name.lastName(),
      title: faker.name.jobTitle() + ' of ' + faker.company.name(),
      quote: faker.company.bs(),
      highlighted: true,
      AvatarImage: {
        create: {
          imageId: await validateImage('avatar2')
        }
      },
    },
  })
  console.log('Testimonial 2 created')

  const moreTestimonials = () => {
    const data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        title: faker.name.jobTitle() + ' of ' + faker.company.name(),
        quote: faker.company.bs(),
        highlighted: false,
      })

    }
    return prisma.testimonial.createMany({
      data,
      skipDuplicates: true,
    })
  }
  const moreTestimonialsCreated = await moreTestimonials()
  console.log('More Testimonials created')
  console.log(
    aboutUs,
    service1,
    service2,
    service3,
    service4,
    service5,
    testimonial1,
    testimonial2,
    moreTestimonialsCreated,
    frontHero,
    bottomHero,
    topHero,
    business,
    admin,
    client,
    gallery,

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


