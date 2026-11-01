const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLookup(adm, roll) {
  const student = await prisma.studentProfile.findFirst({
    where: { admissionNumber: adm, rollNumber: roll },
    include: {
      user: { select: { name: true } },
      section: { include: { classLevel: true } },
      marks: {
        include: {
          examSubject: {
            include: { subject: true, examTerm: true }
          }
        }
      }
    }
  });

  if (!student) {
    console.log('NOT FOUND:', adm, roll);
    return;
  }

  const marksList = student.marks.map(m => ({
    subject: m.examSubject.subject.name,
    obtainedMarks: m.obtainedMarks,
    grade: m.grade,
    gpa: m.gpa
  }));

  console.log('SUCCESS:', adm, 'Roll:', roll, 'Student:', student.user.name, 'Marks count:', marksList.length);
}

async function run() {
  await testLookup('SIS-2026-1001', '01');
  await testLookup('SIS-2026-1002', '02');
  await testLookup('SIS-2026-1003', '03');
  await testLookup('SIS-2026-1004', '04');
  await testLookup('SIS-2026-1005', '05');
  await testLookup('SIS-2026-1024', '06');
  await testLookup('SIS-2026-1025', '07');
}

run().catch(console.error).finally(() => prisma.$disconnect());
