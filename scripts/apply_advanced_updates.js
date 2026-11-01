const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getGradeInfo(marks) {
  if (marks >= 90) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 80) return { grade: 'A', gpa: 4.5 };
  if (marks >= 70) return { grade: 'A-', gpa: 4.0 };
  if (marks >= 60) return { grade: 'B', gpa: 3.5 };
  if (marks >= 50) return { grade: 'C', gpa: 3.0 };
  if (marks >= 40) return { grade: 'D', gpa: 2.0 };
  return { grade: 'F', gpa: 0.0 };
}

async function main() {
  console.log('=== STARTING ADVANCED UPDATES ===');

  // ==========================================
  // 1. UPDATE PAYROLL RECORDS (REMOVE DEMO)
  // ==========================================
  console.log('\n--- 1. Updating Payroll Records ---');
  await prisma.payrollRecord.deleteMany(); // Clear all old records including demo

  const teachers = await prisma.teacherProfile.findMany({
    include: { user: true },
    orderBy: { employeeId: 'asc' },
  });

  const payrollData = [
    {
      name: 'Kazi Farhana Yasmin',
      empId: 'EMP-001',
      designation: 'Head of Mathematics & Cambridge Coordinator',
      basic: 75000,
      allowances: 8500,
      deductions: 3500,
    },
    {
      name: 'Dr. Tanvir Rahman',
      empId: 'EMP-002',
      designation: 'Head of Natural Sciences & STEM',
      basic: 78000,
      allowances: 9000,
      deductions: 3800,
    },
    {
      name: 'Nusrat Jahan Chowdhury',
      empId: 'EMP-003',
      designation: 'Faculty Lead, English Language & Literature',
      basic: 70000,
      allowances: 7500,
      deductions: 3200,
    },
    {
      name: 'Syed Mahmudul Hasan',
      empId: 'EMP-004',
      designation: 'Senior Faculty, Bangladesh Studies & Heritage',
      basic: 68000,
      allowances: 7000,
      deductions: 3000,
    },
    {
      name: 'Rezaul Karim',
      empId: 'EMP-005',
      designation: 'Lead Faculty, Computer Science & ICT',
      basic: 72000,
      allowances: 8000,
      deductions: 3400,
    },
    {
      name: 'Mohammad Jahangir Alam',
      empId: 'EMP-006',
      designation: 'Senior Faculty, Chemistry & Environmental Science',
      basic: 74000,
      allowances: 8200,
      deductions: 3500,
    },
    {
      name: 'Abdul Hannan',
      empId: 'STF-001',
      designation: 'Chief Campus Estate & Logistics Officer',
      basic: 52000,
      allowances: 5500,
      deductions: 2200,
    },
    {
      name: 'Roksana Begum',
      empId: 'STF-002',
      designation: 'Chief Admissions & Student Registrar',
      basic: 55000,
      allowances: 6000,
      deductions: 2500,
    },
  ];

  let payIndex = 1001;
  for (const item of payrollData) {
    const matchedTeacher = teachers.find((t) => t.employeeId === item.empId);
    const userId = matchedTeacher ? matchedTeacher.userId : 'admin-directorate';
    const net = item.basic + item.allowances - item.deductions;
    const payslipNumber = `PAY-2026-${payIndex++}`;

    await prisma.payrollRecord.create({
      data: {
        userId,
        employeeName: item.name,
        employeeId: item.empId,
        designation: item.designation,
        monthYear: 'October 2026',
        basicSalary: item.basic,
        allowances: item.allowances,
        deductions: item.deductions,
        netSalary: net,
        paymentMethod: 'BANK_TRANSFER',
        status: 'PAID',
        payslipNumber,
        paymentDate: new Date('2026-10-31'),
      },
    });
    console.log(`Created payroll record: ${payslipNumber} for ${item.name} (${item.empId})`);
  }

  // ==========================================
  // 2. EXPAND CAMPUS INVENTORY & EQUIPMENT
  // ==========================================
  console.log('\n--- 2. Expanding Campus Inventory & Equipment ---');
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventoryItem.deleteMany();

  const inventoryAssets = [
    {
      name: 'Olympus CX23 Binocular Compound Microscope',
      category: 'LAB_EQUIPMENT',
      qty: 24,
      unit: 'Units',
      price: 42000,
      loc: 'Biology & Experimental Science Lab 1',
    },
    {
      name: 'Arduino Robotics Starter Development Kits',
      category: 'IT_HARDWARE',
      qty: 35,
      unit: 'Kits',
      price: 5500,
      loc: 'STEM & Robotics Innovation Suite',
    },
    {
      name: 'FIFA Quality Pro Match Footballs (Size 5)',
      category: 'SPORTS',
      qty: 40,
      unit: 'Balls',
      price: 3200,
      loc: 'Central Athletics Equipment Room',
    },
    {
      name: 'Vernier Graphical Analysis Digital Sensor Interfaces',
      category: 'LAB_EQUIPMENT',
      qty: 30,
      unit: 'Kits',
      price: 18500,
      loc: 'Physics & Experimental Mechanics Lab',
    },
    {
      name: 'Digital Analytical Precision Balance (0.0001g)',
      category: 'LAB_EQUIPMENT',
      qty: 12,
      unit: 'Units',
      price: 38000,
      loc: 'Chemistry & Analytical Science Lab',
    },
    {
      name: 'Human Anatomy 3D Dissection Model & Skeletal Stand',
      category: 'LAB_EQUIPMENT',
      qty: 8,
      unit: 'Sets',
      price: 22000,
      loc: 'Biology & Life Science Pavilion',
    },
    {
      name: 'Raspberry Pi 5 Computer Science Experimenter Workstations',
      category: 'IT_HARDWARE',
      qty: 40,
      unit: 'Units',
      price: 14500,
      loc: 'Computer Science & AI Research Lab',
    },
    {
      name: 'Interactive Smart 4K UHD Flat Panel (75-inch Touch)',
      category: 'IT_HARDWARE',
      qty: 15,
      unit: 'Panels',
      price: 185000,
      loc: 'Smart Lecture Halls & Audiovisual Complex',
    },
    {
      name: 'Robotics Competition Arena & Obstacle Navigation Course',
      category: 'IT_HARDWARE',
      qty: 6,
      unit: 'Sets',
      price: 32000,
      loc: 'STEM & Robotics Innovation Suite',
    },
    {
      name: 'Cambridge Advanced Mathematics Demonstration & Geometry Toolsets',
      category: 'STATIONERY',
      qty: 50,
      unit: 'Sets',
      price: 4500,
      loc: 'Mathematics Department Store',
    },
    {
      name: 'Professional Digital Astronomical Refractor Telescope',
      category: 'LAB_EQUIPMENT',
      qty: 4,
      unit: 'Units',
      price: 85000,
      loc: 'Campus Astronomy Observation Deck',
    },
    {
      name: 'Cambridge English Digital Headsets & Audio Consoles',
      category: 'IT_HARDWARE',
      qty: 48,
      unit: 'Sets',
      price: 6800,
      loc: 'Language Development & Phonetics Studio',
    },
    {
      name: 'Table Tennis Championship ITTF Approved Tables',
      category: 'SPORTS',
      qty: 8,
      unit: 'Tables',
      price: 45000,
      loc: 'Recreational Sports Complex',
    },
    {
      name: 'Microbiology Autoclave & Steam Sterilization Chamber',
      category: 'LAB_EQUIPMENT',
      qty: 6,
      unit: 'Units',
      price: 65000,
      loc: 'Advanced Biotechnology Prep Room',
    },
  ];

  for (const asset of inventoryAssets) {
    const item = await prisma.inventoryItem.create({
      data: {
        itemName: asset.name,
        category: asset.category,
        quantity: asset.qty,
        unit: asset.unit,
        unitPrice: asset.price,
        location: asset.loc,
        status: 'IN_STOCK',
      },
    });

    await prisma.inventoryTransaction.create({
      data: {
        itemId: item.id,
        transactionType: 'PURCHASE',
        quantity: asset.qty,
        recordedBy: 'Admin Directorate',
        notes: `Procured for ${asset.loc}`,
      },
    });
    console.log(`Added inventory asset: ${asset.name} (${asset.qty} ${asset.unit})`);
  }

  // ==========================================
  // 3. POPULATE FEE INVOICES FOR ALL 26 STUDENTS
  // ==========================================
  console.log('\n--- 3. Populating Fee Invoices for All 26 Students ---');
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();

  const allStudents = await prisma.studentProfile.findMany({
    include: {
      user: true,
      section: { include: { classLevel: true } },
    },
    orderBy: { admissionNumber: 'asc' },
  });

  console.log(`Enrolled students count: ${allStudents.length}`);

  let invCount = 1;
  let receiptCount = 1001;

  for (let idx = 0; idx < allStudents.length; idx++) {
    const student = allStudents[idx];
    const order = student.section?.classLevel?.order || 10;

    let totalAmount = 14500;
    if (order >= 6 && order <= 8) totalAmount = 16500;
    if (order >= 9) totalAmount = 18500;

    // Realistic status distribution:
    // idx % 4 === 0 -> PARTIAL
    // idx % 7 === 0 -> UNPAID
    // others -> PAID
    let status = 'PAID';
    let paidAmount = totalAmount;

    if (idx === 3 || idx === 8 || idx === 15 || idx === 21) {
      status = 'PARTIAL';
      paidAmount = 10000;
    } else if (idx === 5 || idx === 11 || idx === 19) {
      status = 'UNPAID';
      paidAmount = 0;
    }

    const padStr = String(invCount++).padStart(4, '0');
    const invoiceNumber = `SIS-INV-2026-${padStr}`;

    const invoice = await prisma.feeInvoice.create({
      data: {
        invoiceNumber,
        studentId: student.id,
        title: `October 2026 Academic Tuition & STEM Lab Fees`,
        totalAmount,
        paidAmount,
        dueDate: new Date('2026-11-15'),
        status,
        createdAt: new Date(Date.now() - (idx + 1) * 3600000 * 24),
      },
    });

    if (paidAmount > 0) {
      const recStr = `REC-2026-${receiptCount++}`;
      await prisma.feePayment.create({
        data: {
          invoiceId: invoice.id,
          amount: paidAmount,
          paymentMethod: idx % 2 === 0 ? 'ONLINE_BKASH' : 'BANK_TRANSFER',
          transactionRef: `TRX-${idx % 2 === 0 ? 'BKS' : 'EBL'}-${Math.floor(100000 + Math.random() * 900000)}`,
          receiptNumber: recStr,
          paymentDate: new Date(Date.now() - idx * 3600000 * 12),
          notes: status === 'PAID' ? 'Full term clearance' : 'First installment cleared',
        },
      });
    }

    console.log(`Invoice ${invoiceNumber} | ${student.user.name} (${student.section?.classLevel?.name}) | ${totalAmount} | ${status}`);
  }

  // ==========================================
  // 4. ADVANCED EXAM MARKS WITH VARIETY & 1-2 FAILS
  // ==========================================
  console.log('\n--- 4. Setting Varied Exam Marks with 1-2 Fails per Subject ---');
  const examTerm = await prisma.examTerm.findFirst({
    where: { isPublished: true },
    include: { examSubjects: { include: { subject: true } } },
  });

  if (!examTerm) {
    console.error('No published exam term found!');
    return;
  }

  // We have 6 subjects in this exam term:
  // Math (MTH-4024), Physics (PHY-5054), English (ENG-1123), Bangla (BNG-3204), BD Studies (BDS-7094), ICT (ICT-2210)
  // Let's create an authentic curated score matrix for all 26 students:
  // Fails (< 40) explicitly distributed:
  // - Math: 2 fails (Tanveer Hossain: 32, Ahnaf Tahmid: 28)
  // - Physics: 2 fails (Zubair Bin Tariq: 31, Sarah Humayra: 35)
  // - English: 1 fail (Rayhan Siddique: 34)
  // - Bangla: 1 fail (Muhtasim Billah: 36)
  // - Computer Science / ICT: 1 fail (Nafis Chowdhury: 37)
  // - Bangladesh Studies: 0 fails (all pass: 52 to 94)

  // Pre-planned marks distribution table:
  const marksDistribution = {
    // Math: 2 fails
    'MTH-4024': {
      'SIS-2026-1001': 96, // Tahmid Mahmud (A+)
      'SIS-2026-1002': 98, // Zareen Anjum Khan (A+)
      'SIS-2026-1003': 88, // Farhan Ahmed (A)
      'SIS-2026-1004': 94, // Maisha Tasnim (A+)
      'SIS-2026-1005': 78, // Abrar Al-Hasan (A-)
      'SIS-2026-1006': 85, // Samiul Islam (A)
      'SIS-2026-1007': 72, // Anika Tabassum (A-)
      'SIS-2026-1008': 65, // Nafis Chowdhury (B)
      'SIS-2026-1009': 82, // Raisa Mehreen (A)
      'SIS-2026-1010': 32, // Tanveer Hossain -> FAIL 1
      'SIS-2026-1011': 68, // Fariha Jannat (B)
      'SIS-2026-1012': 75, // Wasif Al-Mamun (A-)
      'SIS-2026-1013': 54, // Sarah Humayra (C)
      'SIS-2026-1014': 62, // Shafin Arman (B)
      'SIS-2026-1015': 88, // Tasfia Rahman (A)
      'SIS-2026-1016': 48, // Rayhan Siddique (D)
      'SIS-2026-1017': 79, // Nabiha Nawar (A-)
      'SIS-2026-1018': 58, // Zubair Bin Tariq (C)
      'SIS-2026-1019': 84, // Samia Mehnaz (A)
      'SIS-2026-1020': 42, // Muhtasim Billah (D)
      'SIS-2026-1021': 91, // Nusayba Binte Asad (A+)
      'SIS-2026-1022': 28, // Ahnaf Tahmid -> FAIL 2
      'SIS-2026-1023': 76, // Ishrat Jahan (A-)
      'SIS-2026-1024': 86, // Rohan Bin Sayeed (A)
      'SIS-2026-1025': 93, // Lamia Tabassum (A+)
      'SIS-2026-1099': 95, // Tahmid Mahmud (A+)
    },

    // Physics: 2 fails
    'PHY-5054': {
      'SIS-2026-1001': 92,
      'SIS-2026-1002': 94,
      'SIS-2026-1003': 85,
      'SIS-2026-1004': 96,
      'SIS-2026-1005': 82,
      'SIS-2026-1006': 78,
      'SIS-2026-1007': 80,
      'SIS-2026-1008': 64,
      'SIS-2026-1009': 75,
      'SIS-2026-1010': 58,
      'SIS-2026-1011': 66,
      'SIS-2026-1012': 70,
      'SIS-2026-1013': 35, // Sarah Humayra -> FAIL 1
      'SIS-2026-1014': 72,
      'SIS-2026-1015': 84,
      'SIS-2026-1016': 61,
      'SIS-2026-1017': 88,
      'SIS-2026-1018': 31, // Zubair Bin Tariq -> FAIL 2
      'SIS-2026-1019': 79,
      'SIS-2026-1020': 52,
      'SIS-2026-1021': 87,
      'SIS-2026-1022': 67,
      'SIS-2026-1023': 74,
      'SIS-2026-1024': 85,
      'SIS-2026-1025': 94,
      'SIS-2026-1099': 92,
    },

    // English: 1 fail
    'ENG-1123': {
      'SIS-2026-1001': 88,
      'SIS-2026-1002': 96,
      'SIS-2026-1003': 90,
      'SIS-2026-1004': 95,
      'SIS-2026-1005': 84,
      'SIS-2026-1006': 82,
      'SIS-2026-1007': 88,
      'SIS-2026-1008': 74,
      'SIS-2026-1009': 85,
      'SIS-2026-1010': 63,
      'SIS-2026-1011': 77,
      'SIS-2026-1012': 68,
      'SIS-2026-1013': 72,
      'SIS-2026-1014': 69,
      'SIS-2026-1015': 86,
      'SIS-2026-1016': 34, // Rayhan Siddique -> FAIL 1
      'SIS-2026-1017': 90,
      'SIS-2026-1018': 65,
      'SIS-2026-1019': 81,
      'SIS-2026-1020': 56,
      'SIS-2026-1021': 92,
      'SIS-2026-1022': 71,
      'SIS-2026-1023': 83,
      'SIS-2026-1024': 82,
      'SIS-2026-1025': 91,
      'SIS-2026-1099': 89,
    },

    // Bangla: 1 fail
    'BNG-3204': {
      'SIS-2026-1001': 91,
      'SIS-2026-1002': 93,
      'SIS-2026-1003': 86,
      'SIS-2026-1004': 92,
      'SIS-2026-1005': 88,
      'SIS-2026-1006': 80,
      'SIS-2026-1007': 84,
      'SIS-2026-1008': 71,
      'SIS-2026-1009': 79,
      'SIS-2026-1010': 68,
      'SIS-2026-1011': 82,
      'SIS-2026-1012': 74,
      'SIS-2026-1013': 65,
      'SIS-2026-1014': 66,
      'SIS-2026-1015': 80,
      'SIS-2026-1016': 73,
      'SIS-2026-1017': 85,
      'SIS-2026-1018': 60,
      'SIS-2026-1019': 78,
      'SIS-2026-1020': 36, // Muhtasim Billah -> FAIL 1
      'SIS-2026-1021': 89,
      'SIS-2026-1022': 75,
      'SIS-2026-1023': 82,
      'SIS-2026-1024': 88,
      'SIS-2026-1025': 94,
      'SIS-2026-1099': 91,
    },

    // Bangladesh Studies: 0 fails (all pass)
    'BDS-7094': {
      'SIS-2026-1001': 94,
      'SIS-2026-1002': 97,
      'SIS-2026-1003': 89,
      'SIS-2026-1004': 93,
      'SIS-2026-1005': 85,
      'SIS-2026-1006': 88,
      'SIS-2026-1007': 86,
      'SIS-2026-1008': 76,
      'SIS-2026-1009': 81,
      'SIS-2026-1010': 70,
      'SIS-2026-1011': 85,
      'SIS-2026-1012': 78,
      'SIS-2026-1013': 74,
      'SIS-2026-1014': 68,
      'SIS-2026-1015': 89,
      'SIS-2026-1016': 67,
      'SIS-2026-1017': 92,
      'SIS-2026-1018': 72,
      'SIS-2026-1019': 83,
      'SIS-2026-1020': 58,
      'SIS-2026-1021': 90,
      'SIS-2026-1022': 79,
      'SIS-2026-1023': 86,
      'SIS-2026-1024': 91,
      'SIS-2026-1025': 96,
      'SIS-2026-1099': 94,
    },

    // ICT: 1 fail
    'ICT-2210': {
      'SIS-2026-1001': 98,
      'SIS-2026-1002': 99,
      'SIS-2026-1003': 92,
      'SIS-2026-1004': 97,
      'SIS-2026-1005': 91,
      'SIS-2026-1006': 84,
      'SIS-2026-1007': 87,
      'SIS-2026-1008': 37, // Nafis Chowdhury -> FAIL 1
      'SIS-2026-1009': 86,
      'SIS-2026-1010': 74,
      'SIS-2026-1011': 80,
      'SIS-2026-1012': 82,
      'SIS-2026-1013': 76,
      'SIS-2026-1014': 78,
      'SIS-2026-1015': 91,
      'SIS-2026-1016': 79,
      'SIS-2026-1017': 94,
      'SIS-2026-1018': 81,
      'SIS-2026-1019': 88,
      'SIS-2026-1020': 64,
      'SIS-2026-1021': 95,
      'SIS-2026-1022': 83,
      'SIS-2026-1023': 89,
      'SIS-2026-1024': 92,
      'SIS-2026-1025': 97,
      'SIS-2026-1099': 97,
    },
  };

  let totalMarksWritten = 0;

  for (const es of examTerm.examSubjects) {
    const code = es.subject.code;
    const subjectScores = marksDistribution[code] || {};
    console.log(`Writing marks for ${es.subject.name} (${code})...`);

    let failCount = 0;
    for (const student of allStudents) {
      let score = subjectScores[student.admissionNumber];
      if (score === undefined) {
        score = Math.floor(65 + Math.random() * 25);
      }
      const { grade, gpa } = getGradeInfo(score);
      if (grade === 'F') failCount++;

      await prisma.markRecord.upsert({
        where: {
          examSubjectId_studentId: {
            examSubjectId: es.id,
            studentId: student.id,
          },
        },
        create: {
          studentId: student.id,
          examSubjectId: es.id,
          obtainedMarks: score,
          grade,
          gpa,
          remarks: grade === 'F' ? 'Academic Support Recommended' : 'Term Examination Assessment',
        },
        update: {
          obtainedMarks: score,
          grade,
          gpa,
          remarks: grade === 'F' ? 'Academic Support Recommended' : 'Term Examination Assessment',
        },
      });
      totalMarksWritten++;
    }
    console.log(`Finished ${es.subject.name}: 26 students recorded, Fails: ${failCount}`);
  }

  console.log(`Total marks records written: ${totalMarksWritten}`);
  console.log('\n=== ALL ADVANCED UPDATES APPLIED SUCCESSFULLY ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
