/* eslint-disable @typescript-eslint/unbound-method */

import inquirer, { type QuestionCollection, type Answers } from "inquirer";
import { z } from "zod";
import { PrismaClient, type Services } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { env } from '~/env/server.mjs';
import type * as icons from "react-icons/fa";
import { v2 as cloudinary, type ResourceApiResponse } from 'cloudinary';
import { cloudinaryConfig } from '~/utils/cloudinaryApi';
type IconType = keyof typeof icons;

export const prisma = new PrismaClient()


const startTime = new Date().getTime();

const blogPosts = [{
  title: "The Benefits of Exercise",
  summary: "Exercise has numerous benefits for the body, mind, and spirit. In this post, we'll explore some of the top benefits of exercise.",
  content: `<h2>The Benefits of Exercise</h2><p>Physical activity is important for maintaining good health and well-being. Exercise has numerous benefits for the body, mind, and spirit. In this post, we'll explore some of the top benefits of exercise and why it's important to make it a regular part of your routine.</p><h2>Physical Health Benefits</h2><p>Exercise can improve your physical health in many ways. Here are just a few examples:</p><ol><li><p>Increases Strength and Endurance Regular exercise helps to build muscle and improve endurance. This means that you'll be able to perform physical tasks with greater ease and for longer periods of time. Whether you're lifting weights, going for a run, or doing yoga, you'll notice improvements in your physical abilities over time.</p></li><li><p>Boosts Immune System Exercise can help to strengthen your immune system, making you less susceptible to illnesses and infections. This is because physical activity increases the production of white blood cells, which are responsible for fighting off viruses and bacteria.</p></li><li><p>Improves Heart Health Exercise is good for your heart! Regular physical activity can help to reduce your risk of heart disease by improving blood flow, lowering blood pressure, and reducing cholesterol levels.</p></li><li><p>Helps with Weight Loss If you're looking to lose weight, exercise can be a helpful tool. Physical activity burns calories and can help you to create a calorie deficit, which is necessary for weight loss.</p></li></ol><h3>Mental Health Benefits</h3><p>Exercise is also great for your mental health. Here are a few examples of how physical activity can improve your mood and mental well-being:</p><ol><li><p>Exercise is a natural stress-reliever. Physical activity releases endorphins, which are chemicals in the brain that help to reduce stress and anxiety. Going for a run or hitting the gym can help you to feel calmer and more relaxed.</p></li><li><p>Regular exercise can help to boost your self-esteem and confidence. When you achieve fitness goals or see improvements in your physical abilities, you'll feel a sense of accomplishment and pride in yourself.</p></li><li><p>Exercise can also improve your sleep quality. Physical activity helps to regulate your body's circadian rhythm, which can help you to fall asleep faster and sleep more soundly.</p></li></ol><h2>Spiritual Benefits</h2><p>Finally, exercise can have spiritual benefits as well. Here are a few examples:</p><ol><li><p>Many forms of exercise, such as yoga and tai chi, promote mindfulness and presence. These practices can help you to connect with your inner self and find a sense of calm and peace.</p></li><li><p>Outdoor exercise, such as hiking or running in a park, can help you to feel more connected to nature. Being in nature has been shown to have a positive impact on mental health and well-being.</p></li></ol><h2>Conclusion</h2><p>In conclusion, exercise is essential for maintaining good health and well-being. Whether you're looking to improve your physical health, boost your mood, or connect with your spiritual self, physical activity can help you to achieve your goals. So get out there and move your body - your body, mind, and spirit will thank you!</p>`
},
{
  title: "Why Fire Alarm System Maintenance is Important",
  summary: " In this blog post, we'll explore why maintaining your fire alarm system is crucial and what you can do to ensure that it is functioning correctly.",
  content: `<h2>The Importance of Maintaining a Fire Alarm System</h2><p> A fire alarm system is an essential part of any building's safety infrastructure. It alerts occupants in the event of a fire, giving them time to evacuate safely and quickly. However, many people overlook the importance of regular maintenance for these systems. In this blog post, we'll explore why maintaining your fire alarm system is crucial and what you can do to ensure that it is functioning correctly. </p><h3>Why Maintaining Your Fire Alarm System is Crucial </h3><ol><li><p>Early Detection of Fire One of the most significant benefits of a fire alarm system is early detection. It can detect a fire in its early stages, alerting occupants and emergency services promptly. This early detection can save lives and prevent property damage. However, if your fire alarm system is not maintained correctly, it may not function correctly. Faulty equipment, outdated technology, or an unresponsive monitoring service can all contribute to a system that fails to detect a fire in time. Regular maintenance can help ensure that your system is always functioning correctly. </p></li><li><p>Compliance with Fire Safety Regulations Another reason to maintain your fire alarm system is to comply with fire safety regulations. Depending on your location, there may be specific regulations that require you to have a functioning fire alarm system. Failure to comply with these regulations can result in fines or legal action. Additionally, if you have insurance for your building, your policy may require you to have a functioning fire alarm system. Failure to maintain your system could result in your policy being voided in the event of a fire. </p></li><li><p>Reduced False Alarms A well-maintained fire alarm system can help reduce false alarms. False alarms can be a significant drain on emergency services and can result in fines for building owners. They can also cause unnecessary stress for occupants and distract from real emergencies. Regular maintenance can help ensure that your system is not triggered by false alarms, reducing the risk of unnecessary emergency service callouts. </p></li><li><p>Increased System Lifespan Fire alarm systems are a significant investment for building owners. They can be expensive to install and maintain, but they are crucial for building safety. Regular maintenance can help increase the lifespan of your system, ensuring that you get the most out of your investment. By identifying and fixing issues early on, you can avoid costly repairs or replacements in the future. Additionally, regular maintenance can help ensure that your system remains up to date with the latest technology and regulatory requirements. </p></li></ol><h3>What You Can Do to Maintain Your Fire Alarm System </h3><p>Now that we've explored why maintaining your fire alarm system is crucial, let's look at what you can do to ensure that your system is functioning correctly. </p><ol><li><p>Schedule Regular Inspections Regular inspections by a qualified technician can help identify any issues with your fire alarm system. These inspections can be conducted annually or more frequently, depending on the requirements of your location or insurance policy. During these inspections, the technician will check that all components of your system are functioning correctly. They may also recommend upgrades or replacements to ensure that your system remains up to date. </p></li><li><p>Test Your System Regularly Regular testing can help ensure that your fire alarm system is functioning correctly. You should test your system at least once a month to ensure that it is operating correctly. This testing can be done manually or automatically, depending on your system's capabilities. During testing, you should ensure that all alarms and notification devices are functioning correctly. You should also ensure that your monitoring service is receiving signals from your system. </p></li><li><p>Keep Your System Up to Date Fire safety regulations and technology are constantly evolving. To ensure that your fire alarm system is functioning correctly, you should keep it up to date with the latest regulatory requirements and technology. This may include upgrading your system to accommodate new</p></li></ol>`
}
]

async function main() {

  console.log("Make sure your email is valid, as you will need it to log in to the admin panel.")
  const questions: QuestionCollection<Answers> = [
    {
      type: 'input',
      name: 'email',
      message: "Enter user's email address",
      validate(value) {
        if (z.string().email("Please enter valid s email").parse(value)) {
          return true
        }
        return "Please enter valid email"
      }
    },
  ]

  const answers = await inquirer.prompt(questions)

  const admin = await prisma.user.create({
    data: {
      name: "Site Admin",
      email: answers.email as string,
      admin: true,
      superAdmin: true,
    }
  })


  console.log('Admin created')




  cloudinary.config(cloudinaryConfig)





  console.log('Admin created')

  const cloudinaryImages = async () => {
    const images = await cloudinary.search
      .expression(`folder:${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`)
      .execute() as ResourceApiResponse
    if (images.resources.length < 9) {
      console.log('Not enough images in cloudinary, adding more')
      const diff = 9 - images.resources.length
      for (let i = 0; i < diff; i++) {
        console.log(`Adding image ${i + 1} of ${diff}`)
        await cloudinary.uploader.upload(
          `https://picsum.photos/seed/${i}/1200/1600`,
          {
            folder: env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
            public_id: `sample-${i + 1}`,
          }
        )
        console.log(`Image ${i + 1} of ${diff} added`)
      }
      const newImages = await cloudinary.search
        .expression(`folder:${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`)
        .execute() as ResourceApiResponse
      return newImages.resources.map((resource) => ({
        ...resource,
        blur_url: cloudinary.url(resource.public_id, resource.format),
      }))
    }
    return images.resources.map((resource) => ({
      ...resource,
      blur_url: cloudinary.url(resource.public_id, resource.format),
    }))
  }
  console.log('Cloudinary images fetched and/or uploaded')

  await prisma.image.createMany({
    data: (await cloudinaryImages()).map((image) => ({
      format: image.format,
      bytes: image.bytes,
      width: image.width,
      height: image.height,
      secure_url: image.secure_url,
      blur_url: image.blur_url,
      public_id: image.public_id.split("/")[1] as string,
      type: image.resource_type,
    })),
  })
  const images = await prisma.image.findMany()
  console.log('Images created')

  await prisma.gallery.create({
    data: {
      name: 'Front Page Gallery',
      imageForGallery: {
        createMany: {
          data: images.slice(0, 9).map((image) => ({
            imageId: image.id,
            altText: faker.lorem.sentence(3),
          })),
        }
      },
      position: 'FRONT',
    }
  })
  console.log('Front page gallery created')

  await prisma.gallery.create({
    data: {
      name: 'Main Gallery',
      imageForGallery: {
        createMany: {
          data: images.map((image) => ({
            imageId: image.id,
            altText: faker.lorem.sentence(3),
          })),
        }
      },
      position: 'MAIN',
    }
  })


  const user = await prisma.user.create({
    data: {
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
    },
  })
  console.log('Dummy user created')
  await prisma.businessInfo.create({
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

    },
  })
  console.log('Dummy business created')


  await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      primaryImage: {
        create: {
          image: {
            connect: {
              id: images[0]?.id
            }
          }
        },
      },
      position: 'FRONT'
    }
  })
  console.log('Front Hero banner created')

  await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      primaryImage: {
        create: {
          image: {
            connect: {
              id: images[0]?.id
            }
          }
        },
      },
      position: 'BOTTOM'
    },
  })

  await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      primaryImage: {
        create: {
          image: {
            connect: {
              id: images[7]?.id
            }
          }
        },
      },
      position: 'CONTACT'
    },
  })
  console.log('Bottom Hero created')

  await prisma.hero.create({
    data: {
      heading: faker.company.bs(),
      ctaText: faker.lorem.sentence(12),
      primaryImage: {
        create: {
          image: {
            connect: {
              id: images[0]?.id
            }
          }
        },
      },
      position: 'TOP'
    },
  })
  console.log('Top Hero created')

  const services = () => {
    const services = []
    for (let i = 0; i < 5; i++) {
      services.push({
        title: faker.commerce.productName(),
        pageName: faker.helpers.unique(faker.commerce.department),
        summary: faker.commerce.productDescription(),
        content: faker.lorem.paragraphs(3),
        icon: "FaBeer" as IconType,
        position: `SERVICE${i + 1}` as Services,

      })
      console.log(`Service ${i + 1} created`)
    }
    return services
  }
  await prisma.service.createMany({
    data: services()
  })

  for (let i = 0; i < 5; i++) {
    await prisma.service.update({
      where: {
        position: `SERVICE${i + 1}` as Services,
      },
      data: {
        primaryImage: {
          create: {
            image: {
              connect: {
                id: images[i + 1]?.id
              }
            }
          }
        },
        secondaryImage: {
          create: {
            image: {
              connect: {
                id: images[i + 2]?.id
              }
            }
          }
        },
      }
    })
  }
  console.log('Services created')




  await prisma.aboutUs.create({
    data: {
      title: 'About Us',
      summary: faker.commerce.productDescription(),
      content: faker.lorem.paragraphs(3),
      primaryImage: {
        create: {
          image: {
            connect: {
              id: images[3]?.id
            }
          }
        }
      },
      secondaryImage: {
        create: {
          image: {
            connect: {
              id: images[4]?.id
            }
          }
        }
      },
      inUse: true,


    },
  })
  console.log('About Us created')



  const testimonials = () => {
    const data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        title: faker.name.jobTitle(),
        company: faker.company.name(),
        quote: faker.company.bs(),
        highlighted: i < 2 ? true : false,
      })

    }
    return data
  }

  await prisma.testimonial.createMany({
    data: testimonials(),
  })
  console.log('Testimonials created')

  await prisma.blog.createMany({
    data: blogPosts.map((post, index) => ({
      ...post,
      featured: index === 0 ? true : false,

      userId: index === 0 ? user.id : admin?.id


    })),

  })

  const blogs = await prisma.blog.findMany()

  blogs.forEach(async (blog) => {
    await prisma.blog.update({
      where: {
        id: blog.id
      },
      data: {
        primaryImage: {
          create: {
            image: {
              connect: {
                id: images[8]?.id
              }
            }
          }
        }
      }
    })
  })


  console.log('Blog posts created')

}











main().then(async () => {
  console.log(`--------------------------------------\n🌱 Finished seeding database in ${Date.now() - startTime}ms\n--------------------------------------`)
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


