import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  const state = await prisma.state.upsert({
    where: { abbreviation: 'SP' },
    update: {},
    create: {
      name: 'São Paulo',
      abbreviation: 'SP',
    },
  });

  console.log({ state });

  const cityAlreadyCreated = await prisma.city.findFirst({
    where: { name: 'São Paulo', state_id: state.id },
  });

  if (!cityAlreadyCreated) {
    await prisma.city.create({
      data: {
        name: 'São Paulo',
        state_id: state.id,
      },
    });
  }
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
