const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const records = await prisma.payrollRecord.findMany();
  console.log('Total payroll records in DB:', records.length);
  records.forEach(r => {
    console.log(r.payslipNumber, '|', r.employeeName, '|', r.employeeId, '|', r.designation, '| Net:', r.netSalary);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
