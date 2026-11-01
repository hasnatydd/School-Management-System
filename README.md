# Sonargaon International School Management System (ERP)

> **"Building Character. Inspiring Excellence."**  
> An enterprise-grade, comprehensive K-12 School Management & Enterprise Resource Planning (ERP) platform tailored for institutional excellence in Bangladesh with Cambridge International & National curriculum compatibility.

---

## 🌟 Key Highlights & Modules

### 1. 🌐 Public Institutional Website
- **Modern Responsive Portal:** Hero section, mission/vision, facilities, administration, academic programs, notices, events, faculty roster, and campus gallery.
- **Online Admissions Workflow:** Digital student application form, document upload tracking, and administrative review pipeline.
- **Public Results Verification Portal:** Secure lookup of term examination transcripts by Official Admission ID and Roll Number.

### 2. 🔐 Authentication & Role-Based Access Control (RBAC)
- Multi-role support with strict server-side authorization:
  - **ADMIN:** Complete institutional sovereignty across academics, finance, inventory, HR, and configuration.
  - **TEACHER:** Section gradebook marks entry, attendance sheets, class timetable, and student tracking.
  - **STUDENT:** Personal academic transcript, fee invoice history, attendance records, homework assignments.
  - **PARENT:** Linked child progress monitoring, digital fee clearance receipts, and school announcements.

### 3. 📊 Academic Directorate & Gradebook
- Grade 1 through Grade 10 active student enrollments with Cambridge letter grades (A+, A, A-, B, C, D, F) and **GPA 5.0 scale**.
- Printable official student report card transcripts and honor certificates.
- Official student ID card generator with printable PDF layout and institutional branding.

### 4. 💳 Fee Management & Automated Ledger
- Grade-tiered tuition pricing with online & bank transfer transaction recording.
- Instant clearance receipts (`REC-2026-XXXX`) with automated balance and clearance tracking.

### 5. 👥 Human Resources & Payroll
- Complete faculty & administrative staff payroll directory with automated salary disbursement vouchers (`PAY-2026-XXXX`).
- Staff leave request and approval management.

### 6. 🔬 Campus Equipment & Inventory Assets
- 14 tracked academic apparatus categories:
  - Experimental Science Laboratories (Microscopes, Analytical Balances, Autoclaves, Sensor Interfaces).
  - STEM & Robotics Innovation Suites (Arduino kits, Raspberry Pi 5 workstations, Robotics Arenas).
  - Smart Classrooms & AV complexes (75-inch 4K touch panels, Digital Language Consoles).
  - Athletics & Physical Education facilities.

---

## 🔑 Default Demonstration Credentials

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sonargaon.edu.bd` / `ADM001` | `Sonargaon@2026` | Full ERP Administrative Access |
| **Teacher** | `teacher@sonargaon.edu.bd` / `EMP001` | `Sonargaon@2026` | Class Gradebook, Attendance & Timetable |
| **Student** | `student@sonargaon.edu.bd` / `STU-2026-001` | `Sonargaon@2026` | Scholar Portal & Transcripts |
| **Parent** | `parent@sonargaon.edu.bd` / `PAR001` | `Sonargaon@2026` | Child Academics, Fee Receipts & Progress |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom institutional design system (Navy `#0A192F`, Antique Gold `#D4AF37`, Ivory `#F8F9FA`)
- **Database ORM:** Prisma ORM with SQLite (`prisma/dev.db`)
- **Authentication:** NextAuth.js
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hasnatydd/School-Management-System.git
   cd School-Management-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database & seed demonstration data:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the portal:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
This project is proprietary and developed for **Sonargaon International School**. All rights reserved.
