const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const avatarMap = {
  'Dr. Mansur Ali Chowdhury': '/images/people/principal.jpg',
  'Administrative Directorate': '/images/people/principal.jpg',
  'Kazi Farhana Yasmin': '/images/people/teacher-farhana.jpg',
  'Dr. Tanvir Rahman': '/images/people/teacher-tanvir.jpg',
  'Nusrat Jahan Chowdhury': '/images/people/teacher-nusrat.jpg',
  'Syed Mahmudul Hasan': '/images/people/teacher-mahmudul.jpg',
  'Rezaul Karim': '/images/people/teacher-rezaul.jpg',
  'Mohammad Jahangir Alam': '/images/people/teacher-jahangir.jpg',
  'Tareq Mahmud': '/images/people/parent-tareq.jpg',
  'Tareq Mahmud (Demo Guardian)': '/images/people/parent-tareq.jpg',
  'Dr. Samira Khan': '/images/people/parent-samira.jpg',
  'Tahmid Mahmud': '/images/people/student-tahmid.jpg',
  'Tahmid Mahmud (Demo Student)': '/images/people/student-tahmid.jpg',
  'Zareen Anjum Khan': '/images/people/student-zareen.jpg',
  'Farhan Ahmed': '/images/people/student-tahmid.jpg',
  'Maisha Tasnim': '/images/people/student-zareen.jpg',
  'Abrar Al-Hasan': '/images/people/student-tahmid.jpg',
};

async function updateAvatars() {
  console.log('Updating user avatars in database...');
  for (const [name, avatar] of Object.entries(avatarMap)) {
    const updated = await prisma.user.updateMany({
      where: { name },
      data: { avatar },
    });
    console.log(`Updated ${name} (${updated.count} record(s)) -> ${avatar}`);
  }

  // Fallback for any other user based on role:
  const fallbackStudents = await prisma.user.updateMany({
    where: {
      role: 'STUDENT',
      avatar: { startsWith: 'http' },
    },
    data: { avatar: '/images/people/student-tahmid.jpg' },
  });
  console.log(`Fallback students updated: ${fallbackStudents.count}`);

  const fallbackTeachers = await prisma.user.updateMany({
    where: {
      role: 'TEACHER',
      avatar: { startsWith: 'http' },
    },
    data: { avatar: '/images/people/teacher-tanvir.jpg' },
  });
  console.log(`Fallback teachers updated: ${fallbackTeachers.count}`);

  const fallbackParents = await prisma.user.updateMany({
    where: {
      role: 'PARENT',
      avatar: { startsWith: 'http' },
    },
    data: { avatar: '/images/people/parent-tareq.jpg' },
  });
  console.log(`Fallback parents updated: ${fallbackParents.count}`);

  const allUsers = await prisma.user.findMany({
    select: { name: true, role: true, avatar: true },
  });
  console.log('\nFinal User Database Verification:');
  console.log(allUsers);
}

updateAvatars()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
