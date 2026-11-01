const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- INVOICES ---');
  const invs = await prisma.feeInvoice.findMany({
    include: { student: { include: { user: true, section: { include: { classLevel: true } } } } },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Total invoices:', invs.length);
  invs.forEach(i => {
    console.log(i.invoiceNumber, '|', i.student?.user?.name, `(${i.student?.section?.classLevel?.name})`, '|', i.title, '| Amount:', i.amount, '| Paid:', i.paidAmount, '| Status:', i.status);
  });

  console.log('\n--- PAYROLL / STAFF ---');
  const teachers = await prisma.teacherProfile.findMany({
    include: { user: true }
  });
  console.log('Total teachers in DB:', teachers.length);
  teachers.forEach(t => {
    console.log(t.employeeId, '|', t.user.name, '|', t.designation, '| Salary:', t.salary);
  });

  console.log('\n--- INVENTORY ---');
  const items = await prisma.inventoryItem.findMany();
  console.log('Total inventory items:', items.length);
  items.forEach(it => {
    console.log(it.name, '| Category:', it.category, '| Qty:', it.quantity, '| UnitPrice:', it.unitPrice);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
