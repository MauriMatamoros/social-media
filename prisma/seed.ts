import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const unHashedPassword = 'secret123';
  const password = await bcrypt.hash(unHashedPassword, 10);

  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password,
      name: 'john',
      role: 'STUDENT',
      photo: 'https://robohash.org/stefan-two',
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password,
      name: 'jane',
      role: 'STUDENT',
      photo: 'https://robohash.org/stefan-two',
    },
  });

  const video1 = await prisma.video.create({
    data: {
      title: 'Funny Video',
      src: 'https://youtu.be/-LFSpfxBcm4',
      authorId: john.id,
    },
  });

  const video2 = await prisma.video.create({
    data: {
      title: 'Funny Video #2',
      src: 'https://youtu.be/_d4zSb3OR7g',
      authorId: jane.id,
    },
  });
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
