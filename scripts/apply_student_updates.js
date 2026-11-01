const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function getGradeInfo(score) {
  if (score >= 90) return { grade: 'A+', gpa: 5.0 };
  if (score >= 80) return { grade: 'A', gpa: 4.5 };
  if (score >= 70) return { grade: 'A-', gpa: 4.0 };
  if (score >= 60) return { grade: 'B', gpa: 3.5 };
  if (score >= 50) return { grade: 'C', gpa: 3.0 };
  if (score >= 40) return { grade: 'D', gpa: 2.0 };
  return { grade: 'F', gpa: 0.0 };
}

async function main() {
  console.log('--- STARTING STUDENT & GUARDIAN UPDATES ---');
  const defaultPassword = await bcrypt.hash('Sonargaon@2026', 10);

  // 1. Ensure ClassLevel and Section A exist for all Grades 1 to 10
  const classes = await prisma.classLevel.findMany({ orderBy: { order: 'asc' } });
  const sectionMap = {};

  for (const cl of classes) {
    let secA = await prisma.section.findFirst({
      where: { classLevelId: cl.id, name: 'A' },
    });
    if (!secA) {
      secA = await prisma.section.create({
        data: {
          name: 'A',
          classLevelId: cl.id,
        },
      });
      console.log(`Created Section A for ${cl.name}`);
    }
    sectionMap[cl.order] = secA;
  }

  // 2. Remove '(Demo Student)' from 'Tahmid Mahmud (Demo Student)'
  const demoTahmidUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'stu001@sonargaon.edu.bd' },
        { identifier: 'STU001' },
        { name: 'Tahmid Mahmud (Demo Student)' },
      ],
    },
  });
  if (demoTahmidUser) {
    await prisma.user.update({
      where: { id: demoTahmidUser.id },
      data: { name: 'Tahmid Mahmud' },
    });
    console.log(`Updated demo Tahmid user name to 'Tahmid Mahmud'`);
  }

  // Also remove '(Demo Guardian)' if present
  const demoGuardianUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'par001@sonargaon.edu.bd' },
        { identifier: 'PAR001' },
        { name: 'Tareq Mahmud (Demo Guardian)' },
      ],
    },
  });
  if (demoGuardianUser) {
    await prisma.user.update({
      where: { id: demoGuardianUser.id },
      data: { name: 'Tareq Mahmud' },
    });
    console.log(`Updated demo Guardian user name to 'Tareq Mahmud'`);
  }

  // 3. Helper to create or get parent profile
  async function getOrCreateParent({ name, email, identifier, phone, relationship, occupation }) {
    let user = await prisma.user.findFirst({
      where: { OR: [{ email }, { identifier }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          identifier,
          phone,
          role: 'PARENT',
          password: defaultPassword,
          avatar: '/images/people/parent-individual-tareq.jpg',
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, phone },
      });
    }

    let profile = await prisma.parentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.parentProfile.create({
        data: {
          userId: user.id,
          occupation,
          relationship,
        },
      });
    } else {
      profile = await prisma.parentProfile.update({
        where: { id: profile.id },
        data: { occupation, relationship },
      });
    }

    return profile;
  }

  // Add Guardians for Farhan Ahmed, Maisha Tasnim, Abrar Al-Hasan
  const kamalAhmed = await getOrCreateParent({
    name: 'Engr. Kamal Ahmed',
    email: 'kamal.ahmed@sonargaon.edu.bd',
    identifier: 'PAR003',
    phone: '+880 1713 550003',
    relationship: 'Father',
    occupation: 'Chief Civil Engineer & Infrastructure Specialist',
  });

  const nasrinSultana = await getOrCreateParent({
    name: 'Nasrin Sultana',
    email: 'nasrin.sultana@sonargaon.edu.bd',
    identifier: 'PAR004',
    phone: '+880 1819 660004',
    relationship: 'Mother',
    occupation: 'Senior Educationist & Academic Advisor',
  });

  const zahirulHasan = await getOrCreateParent({
    name: 'Zahirul Hasan',
    email: 'zahirul.hasan@sonargaon.edu.bd',
    identifier: 'PAR005',
    phone: '+880 1911 770005',
    relationship: 'Father',
    occupation: 'Director of Corporate Finance & Banking',
  });

  // Link them to their respective students
  await prisma.studentProfile.updateMany({
    where: { admissionNumber: 'SIS-2026-1003' }, // Farhan Ahmed
    data: { parentId: kamalAhmed.id },
  });
  console.log('Linked Farhan Ahmed -> Engr. Kamal Ahmed');

  await prisma.studentProfile.updateMany({
    where: { admissionNumber: 'SIS-2026-1004' }, // Maisha Tasnim
    data: { parentId: nasrinSultana.id },
  });
  console.log('Linked Maisha Tasnim -> Nasrin Sultana');

  await prisma.studentProfile.updateMany({
    where: { admissionNumber: 'SIS-2026-1005' }, // Abrar Al-Hasan
    data: { parentId: zahirulHasan.id },
  });
  console.log('Linked Abrar Al-Hasan -> Zahirul Hasan');

  // 4. Seed 20 New Students (2 per grade across Grades 1 to 10)
  const newStudentsData = [
    // Grade 1
    {
      gradeOrder: 1,
      name: 'Samiul Islam',
      email: 'samiul.islam@sonargaon.edu.bd',
      identifier: 'STU-2026-006',
      admissionNumber: 'SIS-2026-1006',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2019-04-12'),
      bloodGroup: 'A+',
      address: 'House 12, Road 4, Sector 7, Uttara, Dhaka 1230',
      guardian: {
        name: 'Mokhlesur Rahman',
        email: 'mokhlesur.rahman@sonargaon.edu.bd',
        identifier: 'PAR006',
        phone: '+880 1711 123451',
        relationship: 'Father',
        occupation: 'Software Architect & Cloud Consultant',
      },
    },
    {
      gradeOrder: 1,
      name: 'Anika Tabassum',
      email: 'anika.tabassum@sonargaon.edu.bd',
      identifier: 'STU-2026-007',
      admissionNumber: 'SIS-2026-1007',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2019-08-23'),
      bloodGroup: 'B+',
      address: 'Flat 4A, Green Peace, Mirpur DOHS, Dhaka 1216',
      guardian: {
        name: 'Farzana Haque',
        email: 'farzana.haque@sonargaon.edu.bd',
        identifier: 'PAR007',
        phone: '+880 1819 123452',
        relationship: 'Mother',
        occupation: 'University Lecturer in Literature',
      },
    },

    // Grade 2
    {
      gradeOrder: 2,
      name: 'Nafis Chowdhury',
      email: 'nafis.chowdhury@sonargaon.edu.bd',
      identifier: 'STU-2026-008',
      admissionNumber: 'SIS-2026-1008',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2018-05-19'),
      bloodGroup: 'O+',
      address: 'House 35, Road 9, Dhanmondi, Dhaka 1209',
      guardian: {
        name: 'Dr. Mahbub Chowdhury',
        email: 'mahbub.chowdhury@sonargaon.edu.bd',
        identifier: 'PAR008',
        phone: '+880 1911 123453',
        relationship: 'Father',
        occupation: 'Associate Professor of Internal Medicine',
      },
    },
    {
      gradeOrder: 2,
      name: 'Raisa Mehreen',
      email: 'raisa.mehreen@sonargaon.edu.bd',
      identifier: 'STU-2026-009',
      admissionNumber: 'SIS-2026-1009',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2018-11-04'),
      bloodGroup: 'AB+',
      address: 'House 72, Road 18, Block B, Banani, Dhaka 1213',
      guardian: {
        name: 'Shahana Akter',
        email: 'shahana.akter@sonargaon.edu.bd',
        identifier: 'PAR009',
        phone: '+880 1713 123454',
        relationship: 'Mother',
        occupation: 'Principal Financial Risk Analyst',
      },
    },

    // Grade 3
    {
      gradeOrder: 3,
      name: 'Tanveer Hossain',
      email: 'tanveer.hossain@sonargaon.edu.bd',
      identifier: 'STU-2026-010',
      admissionNumber: 'SIS-2026-1010',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2017-02-14'),
      bloodGroup: 'A+',
      address: 'Plot 14, Block F, Bashundhara R/A, Dhaka 1229',
      guardian: {
        name: 'Monir Hossain',
        email: 'monir.hossain@sonargaon.edu.bd',
        identifier: 'PAR010',
        phone: '+880 1611 123455',
        relationship: 'Father',
        occupation: 'Deputy General Manager, Supply Chain',
      },
    },
    {
      gradeOrder: 3,
      name: 'Fariha Jannat',
      email: 'fariha.jannat@sonargaon.edu.bd',
      identifier: 'STU-2026-011',
      admissionNumber: 'SIS-2026-1011',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2017-09-30'),
      bloodGroup: 'O-',
      address: 'House 22, Road 3, Sector 11, Uttara, Dhaka 1230',
      guardian: {
        name: 'Salma Begum',
        email: 'salma.begum@sonargaon.edu.bd',
        identifier: 'PAR011',
        phone: '+880 1511 123456',
        relationship: 'Mother',
        occupation: 'Senior Legal Counsel, Supreme Court',
      },
    },

    // Grade 4
    {
      gradeOrder: 4,
      name: 'Wasif Al-Mamun',
      email: 'wasif.mamun@sonargaon.edu.bd',
      identifier: 'STU-2026-012',
      admissionNumber: 'SIS-2026-1012',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2016-01-20'),
      bloodGroup: 'B+',
      address: 'Apartment 5B, Navana Tower, Gulshan 1, Dhaka 1212',
      guardian: {
        name: 'Al-Mamun Sarker',
        email: 'mamun.sarker@sonargaon.edu.bd',
        identifier: 'PAR012',
        phone: '+880 1714 123457',
        relationship: 'Father',
        occupation: 'Commercial Pilot & Aviation Instructor',
      },
    },
    {
      gradeOrder: 4,
      name: 'Sarah Humayra',
      email: 'sarah.humayra@sonargaon.edu.bd',
      identifier: 'STU-2026-013',
      admissionNumber: 'SIS-2026-1013',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2016-07-11'),
      bloodGroup: 'A-',
      address: 'House 8, Road 13, Baridhara Diplomatic Zone, Dhaka 1212',
      guardian: {
        name: 'Roxana Parvin',
        email: 'roxana.parvin@sonargaon.edu.bd',
        identifier: 'PAR013',
        phone: '+880 1817 123458',
        relationship: 'Mother',
        occupation: 'Diplomatic Protocol Officer',
      },
    },

    // Grade 5
    {
      gradeOrder: 5,
      name: 'Shafin Arman',
      email: 'shafin.arman@sonargaon.edu.bd',
      identifier: 'STU-2026-014',
      admissionNumber: 'SIS-2026-1014',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2015-03-25'),
      bloodGroup: 'O+',
      address: 'House 19, Road 6, Sector 4, Uttara, Dhaka 1230',
      guardian: {
        name: 'Arman Kabir',
        email: 'arman.kabir@sonargaon.edu.bd',
        identifier: 'PAR014',
        phone: '+880 1912 123459',
        relationship: 'Father',
        occupation: 'Fellow Chartered Accountant (FCA)',
      },
    },
    {
      gradeOrder: 5,
      name: 'Tasfia Rahman',
      email: 'tasfia.rahman@sonargaon.edu.bd',
      identifier: 'STU-2026-015',
      admissionNumber: 'SIS-2026-1015',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2015-10-17'),
      bloodGroup: 'A+',
      address: 'House 41, Road 2, Block D, Niketan, Dhaka 1212',
      guardian: {
        name: 'Sharmin Nahar',
        email: 'sharmin.nahar@sonargaon.edu.bd',
        identifier: 'PAR015',
        phone: '+880 1715 123460',
        relationship: 'Mother',
        occupation: 'Principal Architect & Urban Planner',
      },
    },

    // Grade 6
    {
      gradeOrder: 6,
      name: 'Rayhan Siddique',
      email: 'rayhan.siddique@sonargaon.edu.bd',
      identifier: 'STU-2026-016',
      admissionNumber: 'SIS-2026-1016',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2014-06-08'),
      bloodGroup: 'B+',
      address: 'Plot 27, Road 11, Block I, Bashundhara R/A, Dhaka 1229',
      guardian: {
        name: 'Abu Bakar Siddique',
        email: 'bakar.siddique@sonargaon.edu.bd',
        identifier: 'PAR016',
        phone: '+880 1811 123461',
        relationship: 'Father',
        occupation: 'Head of Telecommunications Infrastructure',
      },
    },
    {
      gradeOrder: 6,
      name: 'Nabiha Nawar',
      email: 'nabiha.nawar@sonargaon.edu.bd',
      identifier: 'STU-2026-017',
      admissionNumber: 'SIS-2026-1017',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2014-12-14'),
      bloodGroup: 'AB-',
      address: 'House 55, Road 8A, Dhanmondi, Dhaka 1209',
      guardian: {
        name: 'Meherun Nesa',
        email: 'meherun.nesa@sonargaon.edu.bd',
        identifier: 'PAR017',
        phone: '+880 1612 123462',
        relationship: 'Mother',
        occupation: 'Biochemist & Senior Research Scientist',
      },
    },

    // Grade 7
    {
      gradeOrder: 7,
      name: 'Zubair Bin Tariq',
      email: 'zubair.tariq@sonargaon.edu.bd',
      identifier: 'STU-2026-018',
      admissionNumber: 'SIS-2026-1018',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2013-04-03'),
      bloodGroup: 'O+',
      address: 'House 63, Road 27, Sector 7, Uttara, Dhaka 1230',
      guardian: {
        name: 'Tariqul Islam',
        email: 'tariqul.islam@sonargaon.edu.bd',
        identifier: 'PAR018',
        phone: '+880 1716 123463',
        relationship: 'Father',
        occupation: 'Judicial Officer & District Legal Specialist',
      },
    },
    {
      gradeOrder: 7,
      name: 'Samia Mehnaz',
      email: 'samia.mehnaz@sonargaon.edu.bd',
      identifier: 'STU-2026-019',
      admissionNumber: 'SIS-2026-1019',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2013-08-29'),
      bloodGroup: 'A+',
      address: 'Flat 7C, Shanta Pinnacle, Gulshan 2, Dhaka 1212',
      guardian: {
        name: 'Afroza Khanam',
        email: 'afroza.khanam@sonargaon.edu.bd',
        identifier: 'PAR019',
        phone: '+880 1913 123464',
        relationship: 'Mother',
        occupation: 'Executive Director of International Trade',
      },
    },

    // Grade 8
    {
      gradeOrder: 8,
      name: 'Muhtasim Billah',
      email: 'muhtasim.billah@sonargaon.edu.bd',
      identifier: 'STU-2026-020',
      admissionNumber: 'SIS-2026-1020',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2012-01-18'),
      bloodGroup: 'B-',
      address: 'House 80, Road 15, Block D, Banani, Dhaka 1213',
      guardian: {
        name: 'Qazi Asaduzzaman',
        email: 'asaduzzaman@sonargaon.edu.bd',
        identifier: 'PAR020',
        phone: '+880 1812 123465',
        relationship: 'Father',
        occupation: 'Senior Systems Architect, Enterprise Computing',
      },
    },
    {
      gradeOrder: 8,
      name: 'Nusayba Binte Asad',
      email: 'nusayba.asad@sonargaon.edu.bd',
      identifier: 'STU-2026-021',
      admissionNumber: 'SIS-2026-1021',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2012-07-22'),
      bloodGroup: 'O+',
      address: 'House 15, Road 4, Sector 3, Uttara, Dhaka 1230',
      guardian: {
        name: 'Shamima Nasrin',
        email: 'shamima.nasrin@sonargaon.edu.bd',
        identifier: 'PAR021',
        phone: '+880 1717 123466',
        relationship: 'Mother',
        occupation: 'Assistant Professor of English Linguistics',
      },
    },

    // Grade 9
    {
      gradeOrder: 9,
      name: 'Ahnaf Tahmid',
      email: 'ahnaf.tahmid@sonargaon.edu.bd',
      identifier: 'STU-2026-022',
      admissionNumber: 'SIS-2026-1022',
      rollNumber: '01',
      gender: 'Male',
      dob: new Date('2011-03-10'),
      bloodGroup: 'A+',
      address: 'House 31, Road 7, Dhanmondi, Dhaka 1205',
      guardian: {
        name: 'Golam Sarwar',
        email: 'golam.sarwar@sonargaon.edu.bd',
        identifier: 'PAR022',
        phone: '+880 1613 123467',
        relationship: 'Father',
        occupation: 'Managing Partner, Supreme Court Law Chambers',
      },
    },
    {
      gradeOrder: 9,
      name: 'Ishrat Jahan',
      email: 'ishrat.jahan@sonargaon.edu.bd',
      identifier: 'STU-2026-023',
      admissionNumber: 'SIS-2026-1023',
      rollNumber: '02',
      gender: 'Female',
      dob: new Date('2011-09-05'),
      bloodGroup: 'AB+',
      address: 'House 102, Road 12, Block E, Banani, Dhaka 1213',
      guardian: {
        name: 'Sabina Yasmin',
        email: 'sabina.yasmin@sonargaon.edu.bd',
        identifier: 'PAR023',
        phone: '+880 1512 123468',
        relationship: 'Mother',
        occupation: 'Chief Operating Officer, Pharmaceutical Group',
      },
    },

    // Grade 10
    {
      gradeOrder: 10,
      name: 'Rohan Bin Sayeed',
      email: 'rohan.sayeed@sonargaon.edu.bd',
      identifier: 'STU-2026-024',
      admissionNumber: 'SIS-2026-1024',
      rollNumber: '06',
      gender: 'Male',
      dob: new Date('2010-02-14'),
      bloodGroup: 'O+',
      address: 'Apartment 9A, Rangs Fortune, Gulshan 1, Dhaka 1212',
      guardian: {
        name: 'Sayeedul Huq',
        email: 'sayeedul.huq@sonargaon.edu.bd',
        identifier: 'PAR024',
        phone: '+880 1718 123469',
        relationship: 'Father',
        occupation: 'Managing Director, FinTech Solutions',
      },
    },
    {
      gradeOrder: 10,
      name: 'Lamia Tabassum',
      email: 'lamia.tabassum@sonargaon.edu.bd',
      identifier: 'STU-2026-025',
      admissionNumber: 'SIS-2026-1025',
      rollNumber: '07',
      gender: 'Female',
      dob: new Date('2010-06-18'),
      bloodGroup: 'B+',
      address: 'Plot 88, Block C, Bashundhara R/A, Dhaka 1229',
      guardian: {
        name: 'Fatema Tuz Zohra',
        email: 'fatema.zohra@sonargaon.edu.bd',
        identifier: 'PAR025',
        phone: '+880 1914 123470',
        relationship: 'Mother',
        occupation: 'Senior Principal Scientist, Biotechnology',
      },
    },
  ];

  for (const item of newStudentsData) {
    const parent = await getOrCreateParent(item.guardian);
    const targetSection = sectionMap[item.gradeOrder];

    let user = await prisma.user.findFirst({
      where: { OR: [{ email: item.email }, { identifier: item.identifier }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: item.name,
          email: item.email,
          identifier: item.identifier,
          role: 'STUDENT',
          password: defaultPassword,
          avatar: '/images/people/student-tahmid.jpg',
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: item.name,
        },
      });
    }

    let profile = await prisma.studentProfile.findUnique({
      where: { admissionNumber: item.admissionNumber },
    });

    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          admissionNumber: item.admissionNumber,
          rollNumber: item.rollNumber,
          gender: item.gender,
          dateOfBirth: item.dob,
          bloodGroup: item.bloodGroup,
          address: item.address,
          sectionId: targetSection.id,
          parentId: parent.id,
        },
      });
      console.log(`Created student ${item.name} (${item.admissionNumber}) in Grade ${item.gradeOrder}`);
    } else {
      profile = await prisma.studentProfile.update({
        where: { id: profile.id },
        data: {
          rollNumber: item.rollNumber,
          gender: item.gender,
          dateOfBirth: item.dob,
          bloodGroup: item.bloodGroup,
          address: item.address,
          sectionId: targetSection.id,
          parentId: parent.id,
        },
      });
      console.log(`Updated student ${item.name} (${item.admissionNumber}) in Grade ${item.gradeOrder}`);
    }
  }

  // 5. Add Term Exam Marks for Farhan Ahmed, Maisha Tasnim, Abrar Al-Hasan, Rohan Bin Sayeed, Lamia Tabassum
  const examTerm = await prisma.examTerm.findFirst({
    where: { isPublished: true },
    include: { examSubjects: true },
  });

  if (examTerm && examTerm.examSubjects.length > 0) {
    const scoresToInsert = [
      {
        adm: 'SIS-2026-1003', // Farhan Ahmed (Roll 03)
        scores: [94, 89, 92, 90, 88, 95],
      },
      {
        adm: 'SIS-2026-1004', // Maisha Tasnim (Roll 04)
        scores: [98, 95, 96, 94, 91, 99],
      },
      {
        adm: 'SIS-2026-1005', // Abrar Al-Hasan (Roll 05)
        scores: [91, 93, 87, 89, 90, 92],
      },
      {
        adm: 'SIS-2026-1024', // Rohan Bin Sayeed (Roll 06)
        scores: [88, 85, 90, 86, 92, 89],
      },
      {
        adm: 'SIS-2026-1025', // Lamia Tabassum (Roll 07)
        scores: [95, 96, 93, 91, 94, 97],
      },
    ];

    for (const record of scoresToInsert) {
      const student = await prisma.studentProfile.findUnique({
        where: { admissionNumber: record.adm },
      });
      if (student) {
        for (let i = 0; i < examTerm.examSubjects.length; i++) {
          const es = examTerm.examSubjects[i];
          const score = record.scores[i % record.scores.length];
          const { grade, gpa } = getGradeInfo(score);

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
            },
            update: {
              obtainedMarks: score,
              grade,
              gpa,
            },
          });
        }
        console.log(`Saved exam marks for ${record.adm}`);
      }
    }
  }

  console.log('--- ALL STUDENT UPDATES SUCCESSFULLY APPLIED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
