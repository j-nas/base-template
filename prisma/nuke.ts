import { PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises"



const prisma = new PrismaClient();

async function main() {
  console.log("☢☢☢ Nuking all fields ☢☢☢");
  console.log("☢☢☢ Are you sure? ☢☢☢");
  console.log("☢☢☢ Type 'yes' to continue ☢☢☢");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const response = await rl.question("☢☢☢: ");

  if (response !== "yes") {
    console.log("☢☢☢ Aborting ☢☢☢");
    process.exit(0);
  }
  console.log("☢☢☢ Nuking... ☢☢☢")

  await prisma.aboutUs.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.businessInfo.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.middleHero.deleteMany();
  await prisma.service.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();

}

main().then(async () => {
  console.log("☢☢☢ All fields nuked ☢☢☢");
  await prisma.$disconnect();
  process.exit(0);
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
);
