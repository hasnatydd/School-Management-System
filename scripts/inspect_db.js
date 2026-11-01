const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const classes = await prisma.classLevel.findMany({
    include: { sections: true },
    orderBy: { order: 'asc' }
  });
  console.log('Classes and Sections:');
  for (const c of classes) {
    console.log(c.name, '(order:', c.order, ') -> Sections:', c.sections.map(s => s.name + ' (' + s.id + ')').join(', '));
  }

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      section: { include: { classLevel: true } },
      parent: { include: { user: true } }
    }
  });
  console.log('\nTotal Students:', students.length);
  for (const s of students) {
    console.log(
      s.admissionNumber,
      s.user.name,
      '| Class:', s.section?.classLevel?.name,
      'Sec:', s.section?.name,
      'Roll:', s.rollNumber,
      '| Parent/Guardian:', s.parent ? s.parent.user.name + ' (' + s.parent.relationship + ')' : 'None'
    );
  }

  const parents = await prisma.parentProfile.findMany({
    include: { user: true, students: { include: { user: true } } }
  });
  console.log('\nParents count:', parents.length);
  for (const p of parents) {
    console.log(p.id, p.user.name, p.user.email, p.relationship, p.occupation, 'Children:', p.students.map(st => st.user.name).join(', '));
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
