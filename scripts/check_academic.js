const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const marks = await prisma.markRecord.findMany({
    include: {
      student: { include: { user: true } },
      examSubject: { include: { subject: true } }
    }
  });
  console.log('Marks count:', marks.length);
  for (const m of marks) {
    console.log(m.student.admissionNumber, m.student.user.name, m.examSubject.subject.name, m.marks, m.grade, m.gpa);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
