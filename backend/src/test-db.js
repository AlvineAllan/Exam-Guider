import prisma from './lib/prisma.js';

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    const count = await prisma.user.count();
    console.log(`📊 Current users: ${count}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
