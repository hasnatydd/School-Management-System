'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// --- STUDENT ACTIONS ---
export async function createStudent(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = (formData.get('email') as string)?.trim() || null;
    const identifier = (formData.get('identifier') as string)?.trim();
    const admissionNumber = (formData.get('admissionNumber') as string)?.trim();
    const rollNumber = (formData.get('rollNumber') as string)?.trim();
    const sectionId = formData.get('sectionId') as string;
    const gender = formData.get('gender') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string || 'student123';

    if (!name || !identifier || !admissionNumber || !rollNumber || !sectionId) {
      return { success: false, error: 'Please fill in all required fields' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email || undefined,
        identifier,
        password: hashedPassword,
        role: 'STUDENT',
        phone,
      },
    });

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        admissionNumber,
        rollNumber,
        sectionId,
        gender,
        address,
      },
    });

    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create student' };
  }
}

// --- ATTENDANCE ACTIONS ---
export async function saveAttendanceBatch(records: Array<{ studentId: string; sectionId: string; date: string; status: string; remarks?: string }>) {
  try {
    for (const r of records) {
      const attDate = new Date(r.date);
      attDate.setHours(8, 0, 0, 0);

      await prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date: attDate,
          },
        },
        update: {
          status: r.status,
          remarks: r.remarks || null,
        },
        create: {
          studentId: r.studentId,
          sectionId: r.sectionId,
          date: attDate,
          status: r.status,
          remarks: r.remarks || null,
        },
      });
    }

    revalidatePath('/dashboard/attendance');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record attendance' };
  }
}

// --- EXAM MARKS ACTIONS ---
export async function saveMarksBatch(records: Array<{ examSubjectId: string; studentId: string; marks: number; remarks?: string }>) {
  try {
    for (const r of records) {
      let grade = 'F';
      let gpa = 0.0;

      if (r.marks >= 90) { grade = 'A+'; gpa = 5.0; }
      else if (r.marks >= 80) { grade = 'A'; gpa = 4.5; }
      else if (r.marks >= 70) { grade = 'A-'; gpa = 4.0; }
      else if (r.marks >= 60) { grade = 'B'; gpa = 3.5; }
      else if (r.marks >= 50) { grade = 'C'; gpa = 3.0; }
      else if (r.marks >= 40) { grade = 'D'; gpa = 2.0; }
      else { grade = 'F'; gpa = 0.0; }

      await prisma.markRecord.upsert({
        where: {
          examSubjectId_studentId: {
            examSubjectId: r.examSubjectId,
            studentId: r.studentId,
          },
        },
        update: {
          obtainedMarks: r.marks,
          grade,
          gpa,
          remarks: r.remarks || null,
        },
        create: {
          examSubjectId: r.examSubjectId,
          studentId: r.studentId,
          obtainedMarks: r.marks,
          grade,
          gpa,
          remarks: r.remarks || null,
        },
      });
    }

    revalidatePath('/dashboard/exams');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save marks' };
  }
}

// --- FEE INVOICE & PAYMENT ACTIONS ---
export async function createFeeInvoice(formData: FormData) {
  try {
    const studentId = formData.get('studentId') as string;
    const title = formData.get('title') as string;
    const totalAmount = parseFloat(formData.get('totalAmount') as string);
    const dueDateStr = formData.get('dueDate') as string;

    if (!studentId || !title || !totalAmount) {
      return { success: false, error: 'Student, title and amount are required' };
    }

    const count = await prisma.feeInvoice.count();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(4, '0')}`;

    await prisma.feeInvoice.create({
      data: {
        invoiceNumber,
        studentId,
        title,
        totalAmount,
        dueDate: dueDateStr ? new Date(dueDateStr) : new Date(Date.now() + 15 * 86400000),
        status: 'UNPAID',
      },
    });

    revalidatePath('/dashboard/fees');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create invoice' };
  }
}

export async function recordFeePayment(formData: FormData) {
  try {
    const invoiceId = formData.get('invoiceId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const paymentMethod = (formData.get('paymentMethod') as string) || 'CASH';
    const notes = formData.get('notes') as string;
    const transactionRef = formData.get('transactionRef') as string;

    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    const count = await prisma.feePayment.count();
    const receiptNumber = `REC-2026-${String(count + 1).padStart(4, '0')}`;

    await prisma.feePayment.create({
      data: {
        receiptNumber,
        invoiceId,
        amount,
        paymentMethod,
        notes,
        transactionRef,
      },
    });

    const newPaidAmount = invoice.paidAmount + amount;
    const newStatus = newPaidAmount >= invoice.totalAmount ? 'PAID' : 'PARTIAL';

    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    revalidatePath('/dashboard/fees');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record payment' };
  }
}

// --- ANNOUNCEMENT ACTIONS ---
export async function createAnnouncement(formData: FormData, authorId: string) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = (formData.get('category') as string) || 'General';
    const targetRole = (formData.get('targetRole') as string) || 'ALL';

    if (!title || !content) {
      return { success: false, error: 'Title and content are required' };
    }

    await prisma.announcement.create({
      data: {
        title,
        content,
        category,
        targetRole,
        authorId,
      },
    });

    revalidatePath('/dashboard/notices');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post announcement' };
  }
}

// --- SETTINGS ACTIONS ---
export async function updateSchoolSettings(formData: FormData) {
  try {
    const schoolName = formData.get('schoolName') as string;
    const tagline = formData.get('tagline') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const academicYear = formData.get('academicYear') as string;
    const currency = formData.get('currency') as string;
    const timeZone = (formData.get('timeZone') as string) || 'Asia/Dhaka';
    const country = (formData.get('country') as string) || 'Bangladesh';

    await prisma.schoolSetting.upsert({
      where: { id: 'default' },
      update: { schoolName, tagline, email, phone, address, academicYear, currency, timeZone, country },
      create: { id: 'default', schoolName, tagline, email, phone, address, academicYear, currency, timeZone, country },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update settings' };
  }
}

// --- ADMISSION INQUIRY ACTIONS ---
export async function submitAdmissionInquiry(formData: FormData) {
  try {
    const studentName = (formData.get('studentName') as string)?.trim();
    const gender = formData.get('gender') as string;
    const gradeApplying = formData.get('gradeApplying') as string;
    const parentName = (formData.get('parentName') as string)?.trim();
    const parentEmail = (formData.get('parentEmail') as string)?.trim();
    const parentPhone = (formData.get('parentPhone') as string)?.trim();
    const previousSchool = (formData.get('previousSchool') as string)?.trim();
    const address = (formData.get('address') as string)?.trim();
    const dobStr = formData.get('dateOfBirth') as string;
    const documents = (formData.get('documents') as string)?.trim() || 'Birth Certificate, Academic Transfer Slip';

    if (!studentName || !gradeApplying || !parentName || !parentPhone) {
      return { success: false, error: 'Please fill in all required applicant details' };
    }

    const count = await prisma.admissionInquiry.count();
    const applicationNumber = `SIS-ADM-2026-${(101 + count).toString()}`;

    const inquiry = await prisma.admissionInquiry.create({
      data: {
        applicationNumber,
        studentName,
        gender: gender || 'Male',
        gradeApplying,
        parentName,
        parentEmail: parentEmail || 'not-provided@example.com',
        parentPhone,
        previousSchool,
        address,
        documents,
        dateOfBirth: dobStr ? new Date(dobStr) : null,
        status: 'PENDING',
      },
    });

    revalidatePath('/dashboard/admissions');
    revalidatePath('/admissions');
    revalidatePath('/');
    return { success: true, applicationNumber: inquiry.applicationNumber };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit admission inquiry' };
  }
}

export async function trackAdmissionApplication(query: string) {
  try {
    const clean = query.trim();
    if (!clean) return { success: false, error: 'Please enter an Application Number or Contact Phone' };

    const inquiry = await prisma.admissionInquiry.findFirst({
      where: {
        OR: [
          { applicationNumber: clean },
          { parentPhone: clean },
          { id: clean },
        ],
      },
    });

    if (!inquiry) {
      return { success: false, error: 'No matching application found. Please verify your reference number or registered phone.' };
    }

    return {
      success: true,
      data: {
        applicationNumber: inquiry.applicationNumber || `SIS-ADM-${inquiry.id.slice(-6).toUpperCase()}`,
        studentName: inquiry.studentName,
        gradeApplying: inquiry.gradeApplying,
        parentName: inquiry.parentName,
        status: inquiry.status,
        createdAt: inquiry.createdAt.toISOString(),
        notes: inquiry.notes || 'Your application has been logged and is under academic review by the Directorate of Admissions.',
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Tracking service unavailable' };
  }
}

export async function updateAdmissionInquiryStatus(inquiryId: string, status: string, notes?: string) {
  try {
    await prisma.admissionInquiry.update({
      where: { id: inquiryId },
      data: {
        status,
        notes: notes || undefined,
      },
    });

    revalidatePath('/dashboard/admissions');
    revalidatePath('/admissions');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

// --- CONTACT INQUIRY ACTIONS ---
export async function submitContactMessage(formData: FormData) {
  try {
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || null;
    const subject = (formData.get('subject') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || !email || !subject || !message) {
      return { success: false, error: 'Please provide name, email, subject, and message.' };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'UNREAD',
      },
    });

    revalidatePath('/dashboard/messages');
    revalidatePath('/contact');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit contact message' };
  }
}

export async function updateContactMessageStatus(messageId: string, status: string, notes?: string) {
  try {
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: {
        status,
        notes: notes || undefined,
      },
    });

    revalidatePath('/dashboard/messages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update message status' };
  }
}

// --- SAFE PUBLIC RESULT LOOKUP ---
export async function lookupPublicResult(admissionNumber: string, rollNumber: string) {
  try {
    const admClean = admissionNumber.trim();
    const rollClean = rollNumber.trim();

    if (!admClean || !rollClean) {
      return { success: false, error: 'Please provide both Admission ID and Roll Number.' };
    }

    const student = await prisma.studentProfile.findFirst({
      where: {
        admissionNumber: admClean,
        rollNumber: rollClean,
      },
      include: {
        user: { select: { name: true } },
        section: { include: { classLevel: true } },
        marks: {
          include: {
            examSubject: {
              include: {
                subject: true,
                examTerm: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return {
        success: false,
        error: 'No scholastic record found matching this Admission ID and Roll Number. Please check your credentials.',
      };
    }

    // Obfuscate / protect privacy: format name like "T. Mahmud" or "Tahmid M."
    const nameParts = student.user.name.split(' ');
    const maskedName =
      nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
        : student.user.name;

    const marksData = student.marks.map((m) => ({
      subjectName: m.examSubject.subject.name,
      subjectCode: m.examSubject.subject.code,
      termName: m.examSubject.examTerm.name,
      obtainedMarks: m.obtainedMarks,
      maxMarks: m.examSubject.maxMarks,
      grade: m.grade,
      gpa: m.gpa,
    }));

    const totalGPA = marksData.reduce((acc, curr) => acc + curr.gpa, 0);
    const avgGPA = marksData.length > 0 ? (totalGPA / marksData.length).toFixed(2) : '5.00';

    return {
      success: true,
      data: {
        maskedName,
        className: student.section.classLevel.name,
        sectionName: student.section.name,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber,
        avgGPA,
        marks: marksData,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Result lookup currently unavailable.' };
  }
}

// --- LMS & ASSIGNMENT ACTIONS ---
export async function createAssignment(formData: FormData, teacherId: string) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDateStr = formData.get('dueDate') as string;
    const totalMarks = parseFloat((formData.get('totalMarks') as string) || '100');
    const subjectId = formData.get('subjectId') as string;
    const sectionId = formData.get('sectionId') as string;
    const attachments = (formData.get('attachments') as string) || null;

    if (!title || !subjectId || !sectionId || !dueDateStr) {
      return { success: false, error: 'Please fill in all required assignment details.' };
    }

    const dueDate = new Date(dueDateStr);

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate,
        totalMarks,
        subjectId,
        sectionId,
        teacherId,
        attachments,
      },
    });

    revalidatePath('/dashboard/assignments');
    return { success: true, assignmentId: assignment.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create assignment' };
  }
}

export async function submitAssignment(formData: FormData, studentId: string) {
  try {
    const assignmentId = formData.get('assignmentId') as string;
    const textAnswer = (formData.get('textAnswer') as string) || '';
    const fileUrl = (formData.get('fileUrl') as string) || null;

    if (!assignmentId) {
      return { success: false, error: 'Assignment identifier missing.' };
    }

    await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      create: {
        assignmentId,
        studentId,
        textAnswer,
        fileUrl,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      update: {
        textAnswer,
        fileUrl,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/assignments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit assignment' };
  }
}

export async function gradeAssignmentSubmission(formData: FormData) {
  try {
    const submissionId = formData.get('submissionId') as string;
    const marks = parseFloat(formData.get('marks') as string);
    const feedback = formData.get('feedback') as string;

    if (!submissionId || isNaN(marks)) {
      return { success: false, error: 'Please provide valid marks.' };
    }

    await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marks,
        feedback,
        status: 'GRADED',
      },
    });

    revalidatePath('/dashboard/assignments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record grading' };
  }
}

// --- STUDY MATERIALS ACTIONS ---
export async function createLearningMaterial(formData: FormData, teacherName: string) {
  try {
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || null;
    const subjectId = formData.get('subjectId') as string;
    const sectionId = (formData.get('sectionId') as string) || null;
    const fileUrl = formData.get('fileUrl') as string;
    const fileType = (formData.get('fileType') as string) || 'PDF';
    const chapter = (formData.get('chapter') as string) || null;

    if (!title || !subjectId || !fileUrl) {
      return { success: false, error: 'Title, Subject and File link are required.' };
    }

    await prisma.learningMaterial.create({
      data: {
        title,
        description,
        subjectId,
        sectionId: sectionId || undefined,
        fileUrl,
        fileType,
        chapter,
        uploadedBy: teacherName,
      },
    });

    revalidatePath('/dashboard/materials');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload material' };
  }
}

// --- LIBRARY ACTIONS ---
export async function issueLibraryBook(formData: FormData) {
  try {
    const bookId = formData.get('bookId') as string;
    const borrowerName = formData.get('borrowerName') as string;
    const borrowerId = formData.get('borrowerId') as string;
    const dueDays = parseInt((formData.get('dueDays') as string) || '14', 10);

    const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
    if (!book || book.availableCopies <= 0) {
      return { success: false, error: 'Book copy currently unavailable in catalog.' };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);

    await prisma.$transaction([
      prisma.libraryLoan.create({
        data: {
          bookId,
          borrowerName,
          borrowerId,
          dueDate,
          status: 'ISSUED',
        },
      }),
      prisma.libraryBook.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 },
      }),
    ]);

    revalidatePath('/dashboard/library');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to issue book' };
  }
}

export async function returnLibraryBook(loanId: string) {
  try {
    const loan = await prisma.libraryLoan.findUnique({ where: { id: loanId } });
    if (!loan) return { success: false, error: 'Loan record not found.' };

    await prisma.$transaction([
      prisma.libraryLoan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnDate: new Date(),
        },
      }),
      prisma.libraryBook.update({
        where: { id: loan.bookId },
        data: { availableCopies: { increment: 1 } },
      }),
    ]);

    revalidatePath('/dashboard/library');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to return book' };
  }
}

// --- TRANSPORT ACTIONS ---
export async function createTransportRoute(formData: FormData) {
  try {
    const routeName = formData.get('routeName') as string;
    const vehicleNumber = formData.get('vehicleNumber') as string;
    const driverName = formData.get('driverName') as string;
    const driverPhone = formData.get('driverPhone') as string;
    const capacity = parseInt((formData.get('capacity') as string) || '30', 10);
    const monthlyFare = parseFloat((formData.get('monthlyFare') as string) || '3500');

    if (!routeName || !vehicleNumber || !driverName) {
      return { success: false, error: 'Required fields missing.' };
    }

    await prisma.transportRoute.create({
      data: {
        routeName,
        vehicleNumber,
        driverName,
        driverPhone,
        capacity,
        monthlyFare,
      },
    });

    revalidatePath('/dashboard/transport');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create route' };
  }
}

// --- HR & LEAVE ACTIONS ---
export async function submitStaffLeave(formData: FormData, userId: string, userName: string) {
  try {
    const leaveType = formData.get('leaveType') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const reason = formData.get('reason') as string;

    if (!leaveType || !reason || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { success: false, error: 'Please provide valid leave duration and reason.' };
    }

    await prisma.staffLeave.create({
      data: {
        userId,
        userName,
        leaveType,
        startDate,
        endDate,
        reason,
        status: 'PENDING',
      },
    });

    revalidatePath('/dashboard/payroll');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit leave request' };
  }
}

export async function updateStaffLeaveStatus(leaveId: string, status: string, approverName: string) {
  try {
    await prisma.staffLeave.update({
      where: { id: leaveId },
      data: {
        status,
        approvedBy: approverName,
      },
    });

    revalidatePath('/dashboard/payroll');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update leave status' };
  }
}

// --- INVENTORY ACTIONS ---
export async function createInventoryItem(formData: FormData) {
  try {
    const itemName = formData.get('itemName') as string;
    const category = formData.get('category') as string;
    const quantity = parseInt((formData.get('quantity') as string) || '0', 10);
    const unit = (formData.get('unit') as string) || 'Units';
    const unitPrice = parseFloat((formData.get('unitPrice') as string) || '0');
    const location = (formData.get('location') as string) || 'Central Store';

    if (!itemName || !category) {
      return { success: false, error: 'Item name and category required.' };
    }

    await prisma.inventoryItem.create({
      data: {
        itemName,
        category,
        quantity,
        unit,
        unitPrice,
        location,
      },
    });

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add item' };
  }
}

// --- CMS ACTIONS ---
export async function updateWebsiteCMS(sectionKey: string, title: string, content: string, subtitle?: string) {
  try {
    await prisma.websiteCMS.upsert({
      where: { sectionKey },
      create: {
        sectionKey,
        title,
        subtitle: subtitle || null,
        content,
        isPublished: true,
      },
      update: {
        title,
        subtitle: subtitle || null,
        content,
      },
    });

    revalidatePath('/dashboard/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update CMS' };
  }
}
