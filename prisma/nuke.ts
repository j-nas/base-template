import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`DELETE FROM "User"`;
  await prisma.$executeRaw`DELETE FROM "BusinessInfo"`;
  await prisma.$executeRaw`DELETE FROM "Testimonial"`;
  await prisma.$executeRaw`DELETE FROM "Service"`;
  await prisma.$executeRaw`DELETE FROM "Hero"`;
  await prisma.$executeRaw`DELETE FROM "MiddleHero"`;
  await prisma.$executeRaw`DELETE FROM "AboutUs"`;
  await prisma.$executeRaw`DELETE FROM "Blog"`;
  await prisma.$executeRaw`DELETE FROM "Testimonial"`;

}

main().then(async () => {
  console.log("Done");
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
);
