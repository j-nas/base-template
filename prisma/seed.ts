

import { PrismaClient } from '@prisma/client'
import { formattedResources } from '../src/utils/cloudinaryApi'
import { faker } from '@faker-js/faker';


export const prisma = new PrismaClient()

const blogPosts = [
  `# The Benefits of Exercise

  Physical activity is important for maintaining good health and well-being. Exercise has numerous benefits for the body, mind, and spirit. In this post, we'll explore some of the top benefits of exercise and why it's important to make it a regular part of your routine.
  
  ## Physical Health Benefits
  
  Exercise can improve your physical health in many ways. Here are just a few examples:
  
  ### 1. Increases Strength and Endurance
  
  Regular exercise helps to build muscle and improve endurance. This means that you'll be able to perform physical tasks with greater ease and for longer periods of time. Whether you're lifting weights, going for a run, or doing yoga, you'll notice improvements in your physical abilities over time.
  
  ### 2. Boosts Immune System
  
  Exercise can help to strengthen your immune system, making you less susceptible to illnesses and infections. This is because physical activity increases the production of white blood cells, which are responsible for fighting off viruses and bacteria.
  
  ### 3. Improves Heart Health
  
  Exercise is good for your heart! Regular physical activity can help to reduce your risk of heart disease by improving blood flow, lowering blood pressure, and reducing cholesterol levels.
  
  ### 4. Helps with Weight Loss
  
  If you're looking to lose weight, exercise can be a helpful tool. Physical activity burns calories and can help you to create a calorie deficit, which is necessary for weight loss.
  
  ## Mental Health Benefits
  
  Exercise is also great for your mental health. Here are a few examples of how physical activity can improve your mood and mental well-being:
  
  ### 1. Reduces Stress and Anxiety
  
  Exercise is a natural stress-reliever. Physical activity releases endorphins, which are chemicals in the brain that help to reduce stress and anxiety. Going for a run or hitting the gym can help you to feel calmer and more relaxed.
  
  ### 2. Boosts Self-Esteem
  
  Regular exercise can help to boost your self-esteem and confidence. When you achieve fitness goals or see improvements in your physical abilities, you'll feel a sense of accomplishment and pride in yourself.
  
  ### 3. Improves Sleep Quality
  
  Exercise can also improve your sleep quality. Physical activity helps to regulate your body's circadian rhythm, which can help you to fall asleep faster and sleep more soundly.
  
  ## Spiritual Benefits
  
  Finally, exercise can have spiritual benefits as well. Here are a few examples:
  
  ### 1. Promotes Mindfulness
  
  Many forms of exercise, such as yoga and tai chi, promote mindfulness and presence. These practices can help you to connect with your inner self and find a sense of calm and peace.
  
  ### 2. Increases Connection to Nature
  
  Outdoor exercise, such as hiking or running in a park, can help you to feel more connected to nature. Being in nature has been shown to have a positive impact on mental health and well-being.
  
  ## Conclusion
  
  In conclusion, exercise is essential for maintaining good health and well-being. Whether you're looking to improve your physical health, boost your mood, or connect with your spiritual self, physical activity can help you to achieve your goals. So get out there and move your body – your body, mind, and spirit will thank you!
`,
  `# The Importance of Maintaining a Fire Alarm System

A fire alarm system is an essential part of any building's safety infrastructure. It alerts occupants in the event of a fire, giving them time to evacuate safely and quickly. However, many people overlook the importance of regular maintenance for these systems. In this blog post, we'll explore why maintaining your fire alarm system is crucial and what you can do to ensure that it is functioning correctly.

## Why Maintaining Your Fire Alarm System is Crucial

1. Early Detection of Fire

One of the most significant benefits of a fire alarm system is early detection. It can detect a fire in its early stages, alerting occupants and emergency services promptly. This early detection can save lives and prevent property damage.

However, if your fire alarm system is not maintained correctly, it may not function correctly. Faulty equipment, outdated technology, or an unresponsive monitoring service can all contribute to a system that fails to detect a fire in time. Regular maintenance can help ensure that your system is always functioning correctly.

2. Compliance with Fire Safety Regulations

Another reason to maintain your fire alarm system is to comply with fire safety regulations. Depending on your location, there may be specific regulations that require you to have a functioning fire alarm system. Failure to comply with these regulations can result in fines or legal action.

Additionally, if you have insurance for your building, your policy may require you to have a functioning fire alarm system. Failure to maintain your system could result in your policy being voided in the event of a fire.

3. Reduced False Alarms

A well-maintained fire alarm system can help reduce false alarms. False alarms can be a significant drain on emergency services and can result in fines for building owners. They can also cause unnecessary stress for occupants and distract from real emergencies.

Regular maintenance can help ensure that your system is not triggered by false alarms, reducing the risk of unnecessary emergency service callouts.

4. Increased System Lifespan

Fire alarm systems are a significant investment for building owners. They can be expensive to install and maintain, but they are crucial for building safety. Regular maintenance can help increase the lifespan of your system, ensuring that you get the most out of your investment.

By identifying and fixing issues early on, you can avoid costly repairs or replacements in the future. Additionally, regular maintenance can help ensure that your system remains up to date with the latest technology and regulatory requirements.

## What You Can Do to Maintain Your Fire Alarm System

Now that we've explored why maintaining your fire alarm system is crucial, let's look at what you can do to ensure that your system is functioning correctly.

1. Schedule Regular Inspections

Regular inspections by a qualified technician can help identify any issues with your fire alarm system. These inspections can be conducted annually or more frequently, depending on the requirements of your location or insurance policy.

During these inspections, the technician will check that all components of your system are functioning correctly. They may also recommend upgrades or replacements to ensure that your system remains up to date.

2. Test Your System Regularly

Regular testing can help ensure that your fire alarm system is functioning correctly. You should test your system at least once a month to ensure that it is operating correctly. This testing can be done manually or automatically, depending on your system's capabilities.

During testing, you should ensure that all alarms and notification devices are functioning correctly. You should also ensure that your monitoring service is receiving signals from your system.

3. Keep Your System Up to Date

Fire safety regulations and technology are constantly evolving. To ensure that your fire alarm system is functioning correctly, you should keep it up to date with the latest regulatory requirements and technology.

This may include upgrading your system to accommodate new
`
]

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
      imageForGallery: {
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
      imageForGallery: {
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
      primaryImage: {
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
      primaryImage: {
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
      primaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('commercial-primary')
        }
      },
      secondaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('highrisepri')
        }
      },
      secondaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('firealarmpri')
        }
      },
      secondaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('firealarmpri')
        }
      },
      secondaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('firealarmpri')
        }
      },
      secondaryImage: {
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
      primaryImage: {
        create: {
          imageId: await validateImage('aboutusprimary')
        }
      },
      secondaryImage: {
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
      title: faker.name.jobTitle(),
      company: faker.company.name(),
      quote: faker.company.bs(),
      highlighted: true,
      avatarImage: {
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
      title: faker.name.jobTitle(),
      company: faker.company.name(),
      quote: faker.company.bs(),
      highlighted: true,
      avatarImage: {
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
        title: faker.name.jobTitle(),
        company: faker.company.name(),
        quote: faker.company.bs(),
        highlighted: false,
      })

    }
    return prisma.testimonial.createMany({
      data,
      skipDuplicates: true,
    })
  }
  const blog = blogPosts.map(async (post, index) => {
    await prisma.blog.create({
      data: {
        title: `post ${index + 1}`,
        markdown: post,
        summary: faker.lorem.paragraphs(1),
        author: {
          connect: {
            id: admin.id
          }
        },
        primaryImage: {
          create: {
            imageId: await validateImage('commercial-primary')
          }
        },
      },
    })
  })
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
    blog

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


