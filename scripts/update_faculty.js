const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updateFaculty() {
  console.log('1. Cleaning up duplicate demo teacher account...');
  const demoUser = await prisma.user.findFirst({
    where: {
      OR: [
        { name: 'Kazi Farhana Yasmin (Demo)' },
        { identifier: 'TCH001' },
        { email: 'tch001@sonargaon.edu.bd' }
      ]
    },
    include: { teacherProfile: true }
  });

  if (demoUser) {
    if (demoUser.teacherProfile) {
      await prisma.teacherProfile.delete({ where: { id: demoUser.teacherProfile.id } });
    }
    await prisma.user.delete({ where: { id: demoUser.id } });
    console.log('Deleted duplicate demo teacher record.');
  }

  console.log('2. Updating existing faculty avatars and details...');
  await prisma.user.updateMany({
    where: { name: 'Kazi Farhana Yasmin' },
    data: { avatar: '/images/people/teacher-farhana.jpg' }
  });

  await prisma.user.updateMany({
    where: { name: 'Dr. Tanvir Rahman' },
    data: { avatar: '/images/people/teacher-tanvir.jpg' }
  });

  await prisma.user.updateMany({
    where: { name: 'Nusrat Jahan Chowdhury' },
    data: { avatar: '/images/people/teacher-nusrat.jpg' }
  });

  await prisma.user.updateMany({
    where: { name: 'Syed Mahmudul Hasan' },
    data: { avatar: '/images/people/teacher-mahmudul.jpg' }
  });

  await prisma.user.updateMany({
    where: { name: 'Rezaul Karim' },
    data: { avatar: '/images/people/teacher-rezaul.jpg' }
  });

  console.log('3. Ensuring Mohammad Jahangir Alam exists...');
  let jahangirUser = await prisma.user.findFirst({
    where: { email: 'teacher6@sonargaon.edu.bd' }
  });

  const teacherPassword = await bcrypt.hash('teacher123', 10);

  if (!jahangirUser) {
    jahangirUser = await prisma.user.create({
      data: {
        name: 'Mohammad Jahangir Alam',
        email: 'teacher6@sonargaon.edu.bd',
        identifier: 'TCH-006',
        password: teacherPassword,
        role: 'TEACHER',
        phone: '+880 1819 200006',
        avatar: '/images/people/teacher-jahangir.jpg'
      }
    });

    await prisma.teacherProfile.create({
      data: {
        userId: jahangirUser.id,
        employeeId: 'EMP-006',
        designation: 'Senior Faculty, Chemistry & Environmental Science',
        qualification: 'M.Sc. in Chemistry (DU), Cambridge CIDTL',
        specialization: 'Organic Chemistry & Environmental Analysis',
        salary: 74000,
        joiningDate: new Date('2022-01-15')
      }
    });
    console.log('Created Mohammad Jahangir Alam profile.');
  } else {
    await prisma.user.update({
      where: { id: jahangirUser.id },
      data: {
        name: 'Mohammad Jahangir Alam',
        avatar: '/images/people/teacher-jahangir.jpg'
      }
    });
  }

  const allTeachers = await prisma.teacherProfile.findMany({
    include: { user: true },
    orderBy: { employeeId: 'asc' }
  });

  console.log('\nVerified Faculty List in Database (' + allTeachers.length + ' teachers):');
  allTeachers.forEach(t => {
    console.log(`- [${t.employeeId}] ${t.user.name} | ${t.designation} | Avatar: ${t.user.avatar}`);
  });
}

updateFaculty()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
