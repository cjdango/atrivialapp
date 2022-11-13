import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dummyUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: "dummy@user.com",
      password: "dummy",
    },
  });

  console.log({ dummyUser });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
