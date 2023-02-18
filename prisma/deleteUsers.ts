import inquirer from 'inquirer';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

async function main() {
  const userList = await prisma.user.findMany();
  const userChoices = userList.map((user) => ({
    name: user.name,
    value: user.id,
  }));
  const { userId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'userId',
      message: 'Select a user to delete',
      choices: userChoices,
    },
  ]);
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete this user?',
    },
  ]);
  if (confirm) {
    const deletedUser = await prisma.user.delete({
      where: {
        id: z.string().min(1).parse(userId),
      },
    });
    console.log(deletedUser);
    console.log('User deleted');
  }

}

main().then(async () => {
  console.log('Done');
  await prisma.$disconnect();
  process.exit(0);
}
).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
);