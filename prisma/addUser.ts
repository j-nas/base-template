import { PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises"
import { z } from "zod";



const prisma = new PrismaClient();


async function main() {
  console.log("Adding user...");
  console.log("Enter user's name and email address");
  const input = await readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const name = await input.question("Name: ");

  const email = await input.question("Email: ");


  try {
    const newUser = await prisma.user.create({
      data: {
        name: z.string().min(1).parse(name),
        email: z.string().email().min(1).parse(email),
      },
    })
    console.log(newUser)
    console.log("User added");
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }

}

main().then(async () => {
  console.log("Done");
  await prisma.$disconnect();
  process.exit(0);
})
