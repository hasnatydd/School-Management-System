import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️ Starting SONARGAON INTERNATIONAL SCHOOL ERP seed...');

  // 1. Clean existing records in reverse relation order
  await prisma.inAppNotification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.websiteCMS.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.staffLeave.deleteMany();
  await prisma.department.deleteMany();
  await prisma.studentTransport.deleteMany();
  await prisma.transportStop.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.libraryLoan.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.admissionInquiry.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.feeHead.deleteMany();
  await prisma.markRecord.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.examTerm.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.subjectTeacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.section.deleteMany();
  await prisma.classLevel.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.parentProfile.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();
  await prisma.schoolSetting.deleteMany();

  // 2. School Settings
  await prisma.schoolSetting.create({
    data: {
      id: 'default',
      schoolName: 'SONARGAON INTERNATIONAL SCHOOL',
      tagline: 'Building Character. Inspiring Excellence.',
      email: 'admissions@sonargaon.edu.bd',
      phone: '+880 2 8876543',
      address: 'Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh',
      academicYear: '2026-2027',
      currency: '৳',
      timeZone: 'Asia/Dhaka',
      country: 'Bangladesh',
    },
  });

  // Common hashed passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const parentPassword = await bcrypt.hash('parent123', 10);

  // 3. Super Admin / Principal
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Mansur Ali Chowdhury',
      email: 'admin@sonargaon.edu.bd',
      identifier: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+880 1711 000001',
      avatar: '/images/people/principal.jpg',
    },
  });

  // Admin alias for ADMIN001 requirement
  await prisma.user.create({
    data: {
      name: 'Administrative Directorate',
      email: 'admin001@sonargaon.edu.bd',
      identifier: 'ADMIN001',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+880 1711 000099',
      avatar: '/images/people/principal.jpg',
    },
  });

  // 4. Academic Grades: Grade 1 through Grade 10 (Full K-10 coverage)
  const grades = [
    { name: 'Grade 1', code: 'G1', order: 1 },
    { name: 'Grade 2', code: 'G2', order: 2 },
    { name: 'Grade 3', code: 'G3', order: 3 },
    { name: 'Grade 4', code: 'G4', order: 4 },
    { name: 'Grade 5', code: 'G5', order: 5 },
    { name: 'Grade 6', code: 'G6', order: 6 },
    { name: 'Grade 7', code: 'G7', order: 7 },
    { name: 'Grade 8', code: 'G8', order: 8 },
    { name: 'Grade 9', code: 'G9', order: 9 },
    { name: 'Grade 10', code: 'G10', order: 10 },
  ];

  const classMap = new Map<string, any>();
  for (const g of grades) {
    const createdClass = await prisma.classLevel.create({
      data: g,
    });
    classMap.set(g.code, createdClass);
  }

  // 5. Sections
  const g10 = classMap.get('G10');
  const g9 = classMap.get('G9');
  const g8 = classMap.get('G8');
  const g7 = classMap.get('G7');
  const g6 = classMap.get('G6');
  const g5 = classMap.get('G5');
  const g4 = classMap.get('G4');
  const g3 = classMap.get('G3');
  const g2 = classMap.get('G2');
  const g1 = classMap.get('G1');

  const sec10A = await prisma.section.create({
    data: { name: 'A', classLevelId: g10.id },
  });
  const sec10B = await prisma.section.create({
    data: { name: 'B', classLevelId: g10.id },
  });
  const sec9A = await prisma.section.create({
    data: { name: 'A', classLevelId: g9.id },
  });
  const sec8A = await prisma.section.create({
    data: { name: 'A', classLevelId: g8.id },
  });
  const sec7A = await prisma.section.create({
    data: { name: 'A', classLevelId: g7.id },
  });
  const sec6A = await prisma.section.create({
    data: { name: 'A', classLevelId: g6.id },
  });
  const sec5A = await prisma.section.create({
    data: { name: 'A', classLevelId: g5.id },
  });
  const sec4A = await prisma.section.create({
    data: { name: 'A', classLevelId: g4.id },
  });
  const sec3A = await prisma.section.create({
    data: { name: 'A', classLevelId: g3.id },
  });
  const sec2A = await prisma.section.create({
    data: { name: 'A', classLevelId: g2.id },
  });
  const sec1A = await prisma.section.create({
    data: { name: 'A', classLevelId: g1.id },
  });

  // 6. Prestigious Faculty Profiles
  const teacherData = [
    {
      name: 'Kazi Farhana Yasmin',
      email: 'teacher@sonargaon.edu.bd',
      identifier: 'TCH-001',
      employeeId: 'EMP-001',
      phone: '+880 1819 200001',
      designation: 'Head of Mathematics & Cambridge Coordinator',
      qualification: 'M.Sc. in Applied Mathematics (DU), Cambridge CIDTL',
      specialization: 'Pure Mathematics & Additional Mathematics',
      salary: 75000,
      avatar: '/images/people/teacher-farhana.jpg',
      classTeacherSectionId: sec10A.id,
    },
    {
      name: 'Dr. Tanvir Rahman',
      email: 'teacher2@sonargaon.edu.bd',
      identifier: 'TCH-002',
      employeeId: 'EMP-002',
      phone: '+880 1712 200002',
      designation: 'Head of Natural Sciences & STEM',
      qualification: 'Ph.D. in Physics, M.Sc. (BUET)',
      specialization: 'Physics, Mechanics & Advanced Robotics',
      salary: 78000,
      avatar: '/images/people/teacher-tanvir.jpg',
      classTeacherSectionId: null,
    },
    {
      name: 'Nusrat Jahan Chowdhury',
      email: 'teacher3@sonargaon.edu.bd',
      identifier: 'TCH-003',
      employeeId: 'EMP-003',
      phone: '+880 1913 200003',
      designation: 'Faculty Lead, English Language & Literature',
      qualification: 'M.A. in English (JNU), CELTA Certified',
      specialization: 'English Literature, Rhetoric & Debate',
      salary: 70000,
      avatar: '/images/people/teacher-nusrat.jpg',
      classTeacherSectionId: null,
    },
    {
      name: 'Syed Mahmudul Hasan',
      email: 'teacher4@sonargaon.edu.bd',
      identifier: 'TCH-004',
      employeeId: 'EMP-004',
      phone: '+880 1614 200004',
      designation: 'Senior Faculty, Bangladesh Studies & Heritage',
      qualification: 'M.A. in History (DU), B.Ed.',
      specialization: 'History of Bengal, Culture & Civics',
      salary: 68000,
      avatar: '/images/people/teacher-mahmudul.jpg',
      classTeacherSectionId: null,
    },
    {
      name: 'Rezaul Karim',
      email: 'teacher5@sonargaon.edu.bd',
      identifier: 'TCH-005',
      employeeId: 'EMP-005',
      phone: '+880 1515 200005',
      designation: 'Lead Faculty, Computer Science & ICT',
      qualification: 'B.Sc. in Computer Science & Engineering (IUT)',
      specialization: 'Python, Algorithms & Web Architecture',
      salary: 72000,
      avatar: '/images/people/teacher-rezaul.jpg',
      classTeacherSectionId: null,
    },
    {
      name: 'Mohammad Jahangir Alam',
      email: 'teacher6@sonargaon.edu.bd',
      identifier: 'TCH-006',
      employeeId: 'EMP-006',
      phone: '+880 1819 200006',
      designation: 'Senior Faculty, Chemistry & Environmental Science',
      qualification: 'M.Sc. in Chemistry (DU), Cambridge CIDTL',
      specialization: 'Organic Chemistry & Environmental Analysis',
      salary: 74000,
      avatar: '/images/people/teacher-jahangir.jpg',
      classTeacherSectionId: null,
    },
  ];

  const teacherProfiles: any[] = [];
  for (const t of teacherData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        identifier: t.identifier,
        password: teacherPassword,
        role: 'TEACHER',
        phone: t.phone,
        avatar: t.avatar,
      },
    });

    const prof = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        employeeId: t.employeeId,
        designation: t.designation,
        qualification: t.qualification,
        specialization: t.specialization,
        salary: t.salary,
        joiningDate: new Date('2021-07-01'),
      },
    });

    if (t.classTeacherSectionId) {
      await prisma.section.update({
        where: { id: t.classTeacherSectionId },
        data: { classTeacherId: prof.id },
      });
    }

    teacherProfiles.push({ ...prof, user, email: t.email });
  }

  // 7. Academic Subjects for Grade 10 (Cambridge International & National Standard)
  const subMath = await prisma.subject.create({
    data: { name: 'Mathematics (Syllabus D)', code: 'MTH-4024', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });
  const subPhysics = await prisma.subject.create({
    data: { name: 'Physics & Experimental Lab', code: 'PHY-5054', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });
  const subEnglish = await prisma.subject.create({
    data: { name: 'English Language & Composition', code: 'ENG-1123', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });
  const subBangla = await prisma.subject.create({
    data: { name: 'Bangla Language & Literature', code: 'BNG-3204', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });
  const subBDStudies = await prisma.subject.create({
    data: { name: 'Bangladesh Studies & History', code: 'BDS-7094', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });
  const subICT = await prisma.subject.create({
    data: { name: 'Computer Science & ICT', code: 'ICT-2210', classLevelId: g10.id, totalMarks: 100, passMarks: 40 },
  });

  // Assign teachers to Section 10-A
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subMath.id, teacherId: teacherProfiles[0].id },
  });
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subPhysics.id, teacherId: teacherProfiles[1].id },
  });
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subEnglish.id, teacherId: teacherProfiles[2].id },
  });
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subBangla.id, teacherId: teacherProfiles[3].id },
  });
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subBDStudies.id, teacherId: teacherProfiles[3].id },
  });
  await prisma.subjectTeacher.create({
    data: { sectionId: sec10A.id, subjectId: subICT.id, teacherId: teacherProfiles[4].id },
  });

  // 8. Parents
  const parent1User = await prisma.user.create({
    data: {
      name: 'Tareq Mahmud',
      email: 'parent@sonargaon.edu.bd',
      identifier: 'PRN-001',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1715 400001',
      avatar: '/images/people/parent-tareq.jpg',
    },
  });
  const parent1Prof = await prisma.parentProfile.create({
    data: {
      userId: parent1User.id,
      occupation: 'Managing Director & Corporate Executive',
      relationship: 'Father',
    },
  });

  // Parent alias for PAR001 requirement
  const parentDemoUser = await prisma.user.create({
    data: {
      name: 'Tareq Mahmud',
      email: 'par001@sonargaon.edu.bd',
      identifier: 'PAR001',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1715 400099',
      avatar: '/images/people/parent-tareq.jpg',
    },
  });
  await prisma.parentProfile.create({
    data: {
      userId: parentDemoUser.id,
      occupation: 'Corporate Director',
      relationship: 'Father',
    },
  });

  const parent2User = await prisma.user.create({
    data: {
      name: 'Dr. Samira Khan',
      email: 'parent2@sonargaon.edu.bd',
      identifier: 'PRN-002',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1817 400002',
      avatar: '/images/people/parent-samira.jpg',
    },
  });
  const parent2Prof = await prisma.parentProfile.create({
    data: {
      userId: parent2User.id,
      occupation: 'Consultant Neurosurgeon',
      relationship: 'Mother',
    },
  });

  const parent3User = await prisma.user.create({
    data: {
      name: 'Engr. Kamal Ahmed',
      email: 'kamal.ahmed@sonargaon.edu.bd',
      identifier: 'PAR003',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1713 550003',
      avatar: '/images/people/parent-tareq.jpg',
    },
  });
  const parent3Prof = await prisma.parentProfile.create({
    data: {
      userId: parent3User.id,
      occupation: 'Chief Civil Engineer & Infrastructure Specialist',
      relationship: 'Father',
    },
  });

  const parent4User = await prisma.user.create({
    data: {
      name: 'Nasrin Sultana',
      email: 'nasrin.sultana@sonargaon.edu.bd',
      identifier: 'PAR004',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1819 660004',
      avatar: '/images/people/parent-samira.jpg',
    },
  });
  const parent4Prof = await prisma.parentProfile.create({
    data: {
      userId: parent4User.id,
      occupation: 'Senior Educationist & Academic Advisor',
      relationship: 'Mother',
    },
  });

  const parent5User = await prisma.user.create({
    data: {
      name: 'Zahirul Hasan',
      email: 'zahirul.hasan@sonargaon.edu.bd',
      identifier: 'PAR005',
      password: parentPassword,
      role: 'PARENT',
      phone: '+880 1911 770005',
      avatar: '/images/people/parent-tareq.jpg',
    },
  });
  const parent5Prof = await prisma.parentProfile.create({
    data: {
      userId: parent5User.id,
      occupation: 'Director of Corporate Finance & Banking',
      relationship: 'Father',
    },
  });

  // 9. Enrolled Students
  const studentsList = [
    {
      name: 'Tahmid Mahmud',
      email: 'student@sonargaon.edu.bd',
      identifier: 'STU-2026-001',
      admissionNumber: 'SIS-2026-1001',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2010-03-15'),
      bloodGroup: 'B+',
      address: 'House 42, Road 11, Banani, Dhaka 1213',
      sectionId: sec10A.id,
      parentId: parent1Prof.id,
      avatar: '/images/people/student-tahmid.jpg',
    },
    {
      name: 'Tahmid Mahmud',
      email: 'stu001@sonargaon.edu.bd',
      identifier: 'STU001',
      admissionNumber: 'SIS-2026-1099',
      rollNumber: '99',
      gender: 'Male',
      dob: new Date('2010-03-15'),
      bloodGroup: 'B+',
      address: 'House 42, Road 11, Banani, Dhaka 1213',
      sectionId: sec10A.id,
      parentId: parent1Prof.id,
      avatar: '/images/people/student-tahmid.jpg',
    },
    {
      name: 'Zareen Anjum Khan',
      email: 'student2@sonargaon.edu.bd',
      identifier: 'STU-2026-002',
      admissionNumber: 'SIS-2026-1002',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2010-07-22'),
      bloodGroup: 'A+',
      address: 'Plot 7, Road 84, Gulshan-2, Dhaka 1212',
      sectionId: sec10A.id,
      parentId: parent2Prof.id,
      avatar: '/images/people/student-zareen.jpg',
    },
    {
      name: 'Farhan Ahmed',
      email: 'student3@sonargaon.edu.bd',
      identifier: 'STU-2026-003',
      admissionNumber: 'SIS-2026-1003',
      rollNumber: '03',
      gender: 'Male',
      dob: new Date('2010-01-10'),
      bloodGroup: 'O+',
      address: 'Sector 4, Uttara Model Town, Dhaka 1230',
      sectionId: sec10A.id,
      parentId: parent3Prof.id,
      avatar: '/images/people/student-tahmid.jpg',
    },
    {
      name: 'Maisha Tasnim',
      email: 'student4@sonargaon.edu.bd',
      identifier: 'STU-2026-004',
      admissionNumber: 'SIS-2026-1004',
      rollNumber: '04',
      gender: 'Female',
      dob: new Date('2011-05-18'),
      bloodGroup: 'AB+',
      address: 'Road 27, Dhanmondi R/A, Dhaka 1209',
      sectionId: sec10A.id,
      parentId: parent4Prof.id,
      avatar: '/images/people/student-zareen.jpg',
    },
    {
      name: 'Abrar Al-Hasan',
      email: 'student5@sonargaon.edu.bd',
      identifier: 'STU-2026-005',
      admissionNumber: 'SIS-2026-1005',
      rollNumber: '05',
      gender: 'Male',
      dob: new Date('2010-10-04'),
      bloodGroup: 'O-',
      address: 'Bashundhara R/A, Block C, Dhaka 1229',
      sectionId: sec10A.id,
      parentId: parent5Prof.id,
      avatar: '/images/people/student-tahmid.jpg',
    },
  ];

  const studentProfiles: any[] = [];
  for (const s of studentsList) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        identifier: s.identifier,
        password: studentPassword,
        role: 'STUDENT',
        avatar: s.avatar,
      },
    });

    const prof = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: s.rollNumber,
        admissionNumber: s.admissionNumber,
        gender: s.gender,
        dateOfBirth: s.dob,
        bloodGroup: s.bloodGroup,
        address: s.address,
        sectionId: s.sectionId,
        parentId: s.parentId,
      },
    });

    studentProfiles.push({ ...prof, user });
  }

  // 10. Attendance Records for past 5 school days
  const today = new Date();
  for (let i = 4; i >= 0; i--) {
    const attDate = new Date(today);
    attDate.setDate(today.getDate() - i);
    attDate.setHours(8, 0, 0, 0);

    for (let j = 0; j < studentProfiles.length; j++) {
      const student = studentProfiles[j];
      let status = 'PRESENT';
      if (j === 0 && i === 3) status = 'LATE';
      if (j === 2 && i === 1) status = 'ABSENT';

      await prisma.attendanceRecord.create({
        data: {
          date: attDate,
          status,
          remarks: status === 'ABSENT' ? 'Leave letter submitted by guardian' : null,
          studentId: student.id,
          sectionId: sec10A.id,
        },
      });
    }
  }

  // 11. Examinations & Marks
  const examTerm = await prisma.examTerm.create({
    data: {
      name: 'Midterm Examination 2026',
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-22'),
      academicYear: '2026-2027',
      isPublished: true,
    },
  });

  const examMath = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subMath.id, maxMarks: 100, passMarks: 40 },
  });
  const examPhysics = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subPhysics.id, maxMarks: 100, passMarks: 40 },
  });
  const examEnglish = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subEnglish.id, maxMarks: 100, passMarks: 40 },
  });
  const examBangla = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subBangla.id, maxMarks: 100, passMarks: 40 },
  });
  const examBDStudies = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subBDStudies.id, maxMarks: 100, passMarks: 40 },
  });
  const examICT = await prisma.examSubject.create({
    data: { examTermId: examTerm.id, subjectId: subICT.id, maxMarks: 100, passMarks: 40 },
  });

  function getGradeInfo(marks: number) {
    if (marks >= 90) return { grade: 'A+', gpa: 5.0 };
    if (marks >= 80) return { grade: 'A', gpa: 4.5 };
    if (marks >= 70) return { grade: 'A-', gpa: 4.0 };
    if (marks >= 60) return { grade: 'B', gpa: 3.5 };
    if (marks >= 50) return { grade: 'C', gpa: 3.0 };
    if (marks >= 40) return { grade: 'D', gpa: 2.0 };
    return { grade: 'F', gpa: 0.0 };
  }

  // Tahmid Mahmud marks
  const tahmidScores = [
    { sub: examMath, score: 96 },
    { sub: examPhysics, score: 92 },
    { sub: examEnglish, score: 88 },
    { sub: examBangla, score: 85 },
    { sub: examBDStudies, score: 91 },
    { sub: examICT, score: 98 },
  ];
  for (const item of tahmidScores) {
    const info = getGradeInfo(item.score);
    await prisma.markRecord.create({
      data: {
        examSubjectId: item.sub.id,
        studentId: studentProfiles[0].id,
        obtainedMarks: item.score,
        grade: info.grade,
        gpa: info.gpa,
        remarks: 'Distinction performance in theoretical and practical coursework',
      },
    });
  }

  // Zareen Anjum marks
  const zareenScores = [
    { sub: examMath, score: 88 },
    { sub: examPhysics, score: 94 },
    { sub: examEnglish, score: 95 },
    { sub: examBangla, score: 90 },
    { sub: examBDStudies, score: 92 },
    { sub: examICT, score: 91 },
  ];
  for (const item of zareenScores) {
    const info = getGradeInfo(item.score);
    await prisma.markRecord.create({
      data: {
        examSubjectId: item.sub.id,
        studentId: studentProfiles[1].id,
        obtainedMarks: item.score,
        grade: info.grade,
        gpa: info.gpa,
        remarks: 'Exemplary academic command and leadership',
      },
    });
  }

  // 12. Fee Heads, Invoices & Payments in BDT ৳
  await prisma.feeHead.createMany({
    data: [
      { title: 'Monthly Academic Tuition (Senior School)', amount: 12500, description: 'Core curriculum instruction and faculty mentoring' },
      { title: 'Advanced STEM & Computing Lab Facility', amount: 2500, description: 'Modern physics, chemistry, and robotics lab consumables' },
      { title: 'Sports Complex, Swimming & Clubs', amount: 1500, description: 'Athletics, campus facilities, and extracurricular societies' },
      { title: 'Term Assessment & Examination Materials', amount: 2000, description: 'Standardized assessment and Cambridge-aligned examination papers' },
    ],
  });

  // Invoice 1: Tahmid Mahmud (Paid in Full)
  const inv1 = await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'SIS-INV-2026-0001',
      studentId: studentProfiles[0].id,
      title: 'October 2026 Academic Tuition & STEM Lab Fees',
      totalAmount: 18500,
      paidAmount: 18500,
      dueDate: new Date('2026-10-15'),
      status: 'PAID',
    },
  });

  await prisma.feePayment.create({
    data: {
      receiptNumber: 'SIS-REC-2026-0001',
      invoiceId: inv1.id,
      amount: 18500,
      paymentDate: new Date('2026-10-08'),
      paymentMethod: 'BANK_TRANSFER',
      transactionRef: 'EBL-NPSB-9847291',
      notes: 'Settled in full via Eastern Bank online transfer by Tareq Mahmud',
    },
  });

  // Invoice 2: Zareen Anjum (Partial Payment)
  const inv2 = await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'SIS-INV-2026-0002',
      studentId: studentProfiles[1].id,
      title: 'October 2026 Academic Tuition & STEM Lab Fees',
      totalAmount: 18500,
      paidAmount: 10000,
      dueDate: new Date('2026-10-15'),
      status: 'PARTIAL',
    },
  });

  await prisma.feePayment.create({
    data: {
      receiptNumber: 'SIS-REC-2026-0002',
      invoiceId: inv2.id,
      amount: 10000,
      paymentDate: new Date('2026-10-10'),
      paymentMethod: 'CHEQUE',
      transactionRef: 'SCB-CHQ-48201',
      notes: 'First installment of ৳ 10,000 received via Standard Chartered cheque',
    },
  });

  // Invoice 3: Farhan Ahmed (Unpaid / Due)
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'SIS-INV-2026-0003',
      studentId: studentProfiles[2].id,
      title: 'October 2026 Academic Tuition & STEM Lab Fees',
      totalAmount: 18500,
      paidAmount: 0,
      dueDate: new Date('2026-10-25'),
      status: 'UNPAID',
    },
  });

  // 13. Weekly Routine (Sunday to Thursday - Bangladesh Academic Week)
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
  const periodSchedule = [
    { period: 1, start: '08:30', end: '09:20' },
    { period: 2, start: '09:25', end: '10:15' },
    { period: 3, start: '10:30', end: '11:20' },
    { period: 4, start: '11:25', end: '12:15' },
    { period: 5, start: '01:00', end: '01:50' },
  ];

  const subCycle = [
    { sub: subMath, tch: teacherProfiles[0] },
    { sub: subPhysics, tch: teacherProfiles[1] },
    { sub: subEnglish, tch: teacherProfiles[2] },
    { sub: subBangla, tch: teacherProfiles[3] },
    { sub: subICT, tch: teacherProfiles[4] },
  ];

  for (let d = 0; d < days.length; d++) {
    const day = days[d];
    for (let p = 0; p < periodSchedule.length; p++) {
      const item = subCycle[(d + p) % subCycle.length];
      await prisma.timetableSlot.create({
        data: {
          dayOfWeek: day,
          periodNumber: periodSchedule[p].period,
          startTime: periodSchedule[p].start,
          endTime: periodSchedule[p].end,
          sectionId: sec10A.id,
          subjectId: item.sub.id,
          teacherId: item.tch.id,
        },
      });
    }
  }

  // 14. Institutional Bulletins & Notices
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Academic Year 2026–2027 at Sonargaon International School',
      content:
        'The Governing Body and Senior Leadership Team warmly welcome all new and returning scholars, esteemed faculty, and respected guardians. Orientation sessions and curriculum syllabi are available in your portal.',
      category: 'General',
      targetRole: 'ALL',
      authorId: adminUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Publication of Midterm Assessment Transcripts',
      content:
        'Official academic report cards for Midterm Examinations 2026 have been published. Scholars and parents may view or print their verified transcripts with GPA rankings from the Examinations portal.',
      category: 'Exam',
      targetRole: 'ALL',
      authorId: adminUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Faculty Academic Senate & Curriculum Review',
      content:
        'All Senior and Middle School Faculty are requested to assemble in the Executive Conference Hall on Wednesday at 03:45 PM for the Term Curricular Alignment Symposium.',
      category: 'Academic',
      targetRole: 'TEACHER',
      authorId: adminUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Notice Regarding Term Fee Settlements for October 2026',
      content:
        'Respected Guardians are kindly reminded to clear outstanding tuition vouchers by November 10th to ensure unhindered examination hall clearance.',
      category: 'Fee',
      targetRole: 'PARENT',
      authorId: adminUser.id,
    },
  });

  // 15. Online Prospective Student Inquiries (Submitted through Public Website)
  await prisma.admissionInquiry.create({
    data: {
      applicationNumber: 'SIS-ADM-2026-101',
      studentName: 'Shafayat Islam',
      gender: 'Male',
      dateOfBirth: new Date('2011-04-12'),
      gradeApplying: 'Grade 9',
      parentName: 'Md. Shahidul Islam',
      parentEmail: 'shahidul.islam@example.com',
      parentPhone: '+880 1711 998877',
      previousSchool: 'Scholastica, Senior Campus',
      address: 'Road 4, Sector 7, Uttara, Dhaka',
      status: 'PENDING',
      notes: 'Applied for Science stream with Additional Mathematics and Physics.',
    },
  });

  await prisma.admissionInquiry.create({
    data: {
      applicationNumber: 'SIS-ADM-2026-102',
      studentName: 'Nayla Rahman',
      gender: 'Female',
      dateOfBirth: new Date('2019-09-20'),
      gradeApplying: 'Grade 1',
      parentName: 'Engr. Kazi Ashfaqur Rahman',
      parentEmail: 'ashfaq.rahman@example.com',
      parentPhone: '+880 1819 554433',
      previousSchool: 'Maple Leaf Early Years',
      address: 'House 18, Road 2, Dhanmondi, Dhaka',
      status: 'APPROVED',
      notes: 'Assessed for Grade 1. Excellent foundational English literacy and numeracy.',
    },
  });

  await prisma.admissionInquiry.create({
    data: {
      applicationNumber: 'SIS-ADM-2026-103',
      studentName: 'Rayyan Chowdhury',
      gender: 'Male',
      dateOfBirth: new Date('2014-11-05'),
      gradeApplying: 'Grade 6',
      parentName: 'Advocate Farzana Begum',
      parentEmail: 'farzana.begum@example.com',
      parentPhone: '+880 1912 332211',
      previousSchool: 'Mastermind English Medium',
      address: 'Road 68, Gulshan-2, Dhaka',
      status: 'REVIEWED',
      notes: 'Interview scheduled for upcoming Sunday at 11:00 AM.',
    },
  });

  // 16. Contact Inquiries
  await prisma.contactMessage.create({
    data: {
      name: 'Dr. Zulfiqar Haider',
      email: 'zulfiqar.haider@example.com',
      phone: '+880 1713 001122',
      subject: 'Inquiry regarding Cambridge O-Level Science Laboratory Facilities',
      message: 'Good day. We are considering transferring our son to Grade 9 for the upcoming academic session. Could you please arrange a guided tour of the Physics, Chemistry, and Computer Science laboratories?',
      status: 'UNREAD',
    },
  });

  await prisma.contactMessage.create({
    data: {
      name: 'Salma Akter',
      email: 'salma.akter@example.com',
      phone: '+880 1914 445566',
      subject: 'School Transport Routes for Banani & Gulshan Zone',
      message: 'Greetings. We live near Banani Kamal Ataturk Avenue. We would like to know if your AC school transport bus services cover this route with security attendants on board.',
      status: 'READ',
      notes: 'Transport department confirmed Route 3 covers Banani Block E/F.',
    },
  });

  // 17. Homework & LMS Assignments
  const asg1 = await prisma.assignment.create({
    data: {
      title: 'Quadratic Equations & Discriminant Problem Set',
      description: 'Solve questions 1 through 15 from Chapter 4 of Cambridge Syllabus D. Show full algebraic steps.',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      totalMarks: 50,
      subjectId: subMath.id,
      sectionId: sec10A.id,
      teacherId: teacherProfiles[0].id,
      attachments: 'MTH4024-HW4-Quadratics.pdf',
    },
  });

  const asg2 = await prisma.assignment.create({
    data: {
      title: 'Newtonian Dynamics & Friction Lab Report',
      description: 'Submit your typed experimental lab report on static and kinetic friction coefficient measurements.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalMarks: 30,
      subjectId: subPhysics.id,
      sectionId: sec10A.id,
      teacherId: teacherProfiles[1].id,
      attachments: 'PHY5054-LabReport-Guidelines.pdf',
    },
  });

  // Tahmid's submission
  const firstStudent = await prisma.studentProfile.findFirst({
    where: { rollNumber: '01' },
  });

  if (firstStudent) {
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: asg1.id,
        studentId: firstStudent.id,
        textAnswer: 'Completed questions 1 through 15 with verified discriminant tests. See attached file.',
        fileUrl: 'Tahmid-M-MTH4024-HW4-Answers.pdf',
        status: 'GRADED',
        marks: 48,
        feedback: 'Outstanding mathematical rigor. Accurate algebraic factoring in question 12.',
      },
    });

    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: asg2.id,
        studentId: firstStudent.id,
        textAnswer: 'Lab data recorded in Table 2. Graph plotting slope indicates friction coefficient 0.32.',
        fileUrl: 'Tahmid-M-PHY5054-LabReport.pdf',
        status: 'SUBMITTED',
      },
    });
  }

  // 18. Learning Materials
  await prisma.learningMaterial.create({
    data: {
      title: 'Cambridge IGCSE Mathematics Formula Sheet & Index',
      description: 'Official formula sheet covering mensuration, trigonometry, and calculus basics.',
      subjectId: subMath.id,
      sectionId: sec10A.id,
      fileUrl: '/materials/cambridge-math-formula-sheet.pdf',
      fileType: 'PDF',
      chapter: 'General Reference',
      uploadedBy: 'Kazi Farhana Yasmin',
    },
  });

  await prisma.learningMaterial.create({
    data: {
      title: 'Electromagnetism Lecture Slides & Conceptual Questions',
      description: 'Comprehensive slide deck on Fleming left-hand rule and magnetic induction.',
      subjectId: subPhysics.id,
      sectionId: sec10A.id,
      fileUrl: '/materials/physics-electromagnetism-slides.pdf',
      fileType: 'PDF',
      chapter: 'Unit 4: Magnetism',
      uploadedBy: 'Dr. Tanvir Rahman',
    },
  });

  // 19. Library Books & Loans
  const book1 = await prisma.libraryBook.create({
    data: {
      title: 'Cambridge O Level Mathematics (Syllabus D) 2nd Edition',
      author: 'Audrey Simpson',
      isbn: '978-1107611955',
      category: 'Mathematics',
      totalCopies: 15,
      availableCopies: 14,
      rackNumber: 'MTH-RACK-02',
    },
  });

  const book2 = await prisma.libraryBook.create({
    data: {
      title: 'University Physics with Modern Physics',
      author: 'Hugh D. Young, Roger A. Freedman',
      isbn: '978-0135159552',
      category: 'Physics',
      totalCopies: 8,
      availableCopies: 7,
      rackNumber: 'SCI-RACK-05',
    },
  });

  const book3 = await prisma.libraryBook.create({
    data: {
      title: 'To Kill a Mockingbird (Critical Scholastic Edition)',
      author: 'Harper Lee',
      isbn: '978-0060935467',
      category: 'Literature',
      totalCopies: 20,
      availableCopies: 19,
      rackNumber: 'LIT-RACK-01',
    },
  });

  await prisma.libraryLoan.create({
    data: {
      bookId: book1.id,
      borrowerName: 'Tahmid Mahmud',
      borrowerId: 'SIS-2026-1001',
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      status: 'ISSUED',
    },
  });

  // 20. Transport Management
  const route1 = await prisma.transportRoute.create({
    data: {
      routeName: 'Route 1: Uttara Express (Sectors 3, 7, 11, 14)',
      vehicleNumber: 'DHA-METRO-CHA-11-2026',
      driverName: 'Mohammad Rafiqul Islam',
      driverPhone: '+880 1718 901234',
      capacity: 32,
      monthlyFare: 3500,
    },
  });

  await prisma.transportStop.create({
    data: {
      routeId: route1.id,
      stopName: 'Uttara Sector 3 (Main Gate)',
      pickupTime: '07:15 AM',
      dropTime: '02:30 PM',
    },
  });

  await prisma.transportStop.create({
    data: {
      routeId: route1.id,
      stopName: 'Uttara Sector 7 (Rabindra Sarani)',
      pickupTime: '07:30 AM',
      dropTime: '02:45 PM',
    },
  });

  const route2 = await prisma.transportRoute.create({
    data: {
      routeName: 'Route 2: Banani & Gulshan Diplomatic Shuttle',
      vehicleNumber: 'DHA-METRO-CHA-12-8877',
      driverName: 'Abdul Karim',
      driverPhone: '+880 1819 876543',
      capacity: 30,
      monthlyFare: 4000,
    },
  });

  if (firstStudent) {
    await prisma.studentTransport.create({
      data: {
        studentId: firstStudent.id,
        routeId: route2.id,
        stopName: 'Banani Road 11 (Star Tower)',
        status: 'ACTIVE',
      },
    });
  }

  // 21. HR & Staff Management
  const departments = ['Mathematics', 'Natural Sciences & STEM', 'English Language & Rhetoric', 'Humanities & Social Studies', 'Information Technology', 'General Administration'];
  for (const dep of departments) {
    await prisma.department.create({
      data: { name: dep },
    });
  }

  await prisma.staffLeave.create({
    data: {
      userId: teacherProfiles[1].user.id,
      userName: teacherProfiles[1].user.name,
      leaveType: 'CASUAL',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      reason: 'Attending Cambridge Regional STEM Educators Conclave in Dhaka',
      status: 'APPROVED',
      approvedBy: 'Dr. Mansur Ali Chowdhury',
    },
  });

  // Payroll Records for October 2026
  const payrollStaff = [
    { profile: teacherProfiles[0], basic: 75000, allowances: 8500, deductions: 3500 },
    { profile: teacherProfiles[1], basic: 78000, allowances: 9000, deductions: 3800 },
    { profile: teacherProfiles[2], basic: 70000, allowances: 7500, deductions: 3200 },
    { profile: teacherProfiles[3], basic: 68000, allowances: 7000, deductions: 3000 },
    { profile: teacherProfiles[4], basic: 72000, allowances: 8000, deductions: 3400 },
    { profile: teacherProfiles[5], basic: 74000, allowances: 8200, deductions: 3500 },
  ];

  let payNum = 1001;
  for (const item of payrollStaff) {
    if (item.profile) {
      await prisma.payrollRecord.create({
        data: {
          userId: item.profile.user.id,
          employeeName: item.profile.user.name,
          employeeId: item.profile.employeeId,
          designation: item.profile.designation || 'Faculty Member',
          monthYear: 'October 2026',
          basicSalary: item.basic,
          allowances: item.allowances,
          deductions: item.deductions,
          netSalary: item.basic + item.allowances - item.deductions,
          paymentMethod: 'BANK_TRANSFER',
          status: 'PAID',
          payslipNumber: `PAY-2026-${payNum++}`,
          paymentDate: new Date('2026-10-31'),
        },
      });
    }
  }

  // 22. Campus Inventory & Equipment (14 High-Value Educational Assets)
  const educationalAssets = [
    { itemName: 'Olympus CX23 Binocular Compound Microscope', category: 'LAB_EQUIPMENT', quantity: 24, unit: 'Units', unitPrice: 42000, location: 'Biology & Experimental Science Lab 1' },
    { itemName: 'Arduino Robotics Starter Development Kits', category: 'IT_HARDWARE', quantity: 35, unit: 'Kits', unitPrice: 5500, location: 'STEM & Robotics Innovation Suite' },
    { itemName: 'FIFA Quality Pro Match Footballs (Size 5)', category: 'SPORTS', quantity: 40, unit: 'Balls', unitPrice: 3200, location: 'Central Athletics Equipment Room' },
    { itemName: 'Vernier Graphical Analysis Digital Sensor Interfaces', category: 'LAB_EQUIPMENT', quantity: 30, unit: 'Kits', unitPrice: 18500, location: 'Physics & Experimental Mechanics Lab' },
    { itemName: 'Digital Analytical Precision Balance (0.0001g)', category: 'LAB_EQUIPMENT', quantity: 12, unit: 'Units', unitPrice: 38000, location: 'Chemistry & Analytical Science Lab' },
    { itemName: 'Human Anatomy 3D Dissection Model & Skeletal Stand', category: 'LAB_EQUIPMENT', quantity: 8, unit: 'Sets', unitPrice: 22000, location: 'Biology & Life Science Pavilion' },
    { itemName: 'Raspberry Pi 5 Computer Science Experimenter Workstations', category: 'IT_HARDWARE', quantity: 40, unit: 'Units', unitPrice: 14500, location: 'Computer Science & AI Research Lab' },
    { itemName: 'Interactive Smart 4K UHD Flat Panel (75-inch Touch)', category: 'IT_HARDWARE', quantity: 15, unit: 'Panels', unitPrice: 185000, location: 'Smart Lecture Halls & Audiovisual Complex' },
    { itemName: 'Robotics Competition Arena & Obstacle Navigation Course', category: 'IT_HARDWARE', quantity: 6, unit: 'Sets', unitPrice: 32000, location: 'STEM & Robotics Innovation Suite' },
    { itemName: 'Cambridge Advanced Mathematics Demonstration & Geometry Toolsets', category: 'STATIONERY', quantity: 50, unit: 'Sets', unitPrice: 4500, location: 'Mathematics Department Store' },
    { itemName: 'Professional Digital Astronomical Refractor Telescope', category: 'LAB_EQUIPMENT', quantity: 4, unit: 'Units', unitPrice: 85000, location: 'Campus Astronomy Observation Deck' },
    { itemName: 'Cambridge English Digital Headsets & Audio Consoles', category: 'IT_HARDWARE', quantity: 48, unit: 'Sets', unitPrice: 6800, location: 'Language Development & Phonetics Studio' },
    { itemName: 'Table Tennis Championship ITTF Approved Tables', category: 'SPORTS', quantity: 8, unit: 'Tables', unitPrice: 45000, location: 'Recreational Sports Complex' },
    { itemName: 'Microbiology Autoclave & Steam Sterilization Chamber', category: 'LAB_EQUIPMENT', quantity: 6, unit: 'Units', unitPrice: 65000, location: 'Advanced Biotechnology Prep Room' },
  ];

  for (const asset of educationalAssets) {
    const itm = await prisma.inventoryItem.create({
      data: {
        ...asset,
        status: 'IN_STOCK',
      },
    });
    await prisma.inventoryTransaction.create({
      data: {
        itemId: itm.id,
        transactionType: 'PURCHASE',
        quantity: asset.quantity,
        recordedBy: 'Admin Directorate',
        notes: `Procured for ${asset.location}`,
      },
    });
  }

  // 23. In-App Notifications
  if (firstStudent) {
    await prisma.inAppNotification.create({
      data: {
        userId: firstStudent.userId,
        title: 'Marks Published: Quadratic Equations Problem Set',
        message: 'Your score of 48/50 has been recorded with teacher remarks.',
        type: 'ASSIGNMENT',
        link: '/dashboard/assignments',
      },
    });

    await prisma.inAppNotification.create({
      data: {
        userId: firstStudent.userId,
        title: 'Tuition Fee Clearance Voucher Ready',
        message: 'Payment for October 2026 tuition voucher SIS-INV-2026-0001 confirmed.',
        type: 'FEE',
        link: '/dashboard/fees',
      },
    });
  }

  // 24. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userName: adminUser.name,
      action: 'SYSTEM_SEED_INITIALIZATION',
      module: 'SYSTEM',
      details: 'Initialized full institutional seed data for Academic Year 2026-2027.',
    },
  });

  // 25. Website CMS Content
  await prisma.websiteCMS.create({
    data: {
      sectionKey: 'HERO_WELCOME',
      title: 'SONARGAON INTERNATIONAL SCHOOL',
      subtitle: 'Building Character. Inspiring Excellence.',
      content: 'A premier educational institution in Bangladesh, dedicated to academic excellence and holistic development.',
      imageUrl: '/images/campus-building.jpg',
      isPublished: true,
    },
  });

  await prisma.websiteCMS.create({
    data: {
      sectionKey: 'PRINCIPAL_MESSAGE',
      title: 'A Tradition of Excellence',
      subtitle: 'Dr. Ahmed Karim, Principal',
      content: 'Sonargaon International School is committed to providing quality education, fostering creativity and building strong values for a brighter future.',
      imageUrl: '/images/principal-ahmed-karim.jpg',
      isPublished: true,
    },
  });

  console.log('✅ SONARGAON INTERNATIONAL SCHOOL ERP Seed successfully completed!');
  console.log('----------------------------------------------------');
  console.log('Official Demonstration Credentials:');
  console.log('• Admin:    admin@sonargaon.edu.bd   / admin   OR   ADMIN001 (pw: admin123)');
  console.log('• Teacher:  teacher@sonargaon.edu.bd / TCH-001 OR   TCH001   (pw: teacher123)');
  console.log('• Student:  student@sonargaon.edu.bd / STU-2026-001 OR STU001 (pw: student123)');
  console.log('• Parent:   parent@sonargaon.edu.bd  / PRN-001 OR   PAR001   (pw: parent123)');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
