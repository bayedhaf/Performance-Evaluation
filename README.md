# 🧭 Employee Performance Evaluation Dashboard

A full-stack performance management system built with **Next.js 15+ App Router**, enabling administrators and employees to manage and conduct evaluations including self-assessments, peer reviews, and admin evaluations.

---

## ✨ Features

### 🔒 Authentication
- Secure login/signup using **NextAuth.js**
- Role-based access: Admin & Employee views

### 📊 Admin Panel
- View organization-wide evaluation metrics
- Evaluate individual employees
- Monitor task completion and performance ratings

### 👤 Employee Dashboard
- View self, peer, and admin evaluations
- Complete self-evaluation forms
- Select peers for performance reviews

### 📈 Real-time Feedback & Summary
- Performance charts and evaluation summaries
- History of evaluations and progress tracking

---

## 🚀 Technologies Used

| Tech | Purpose |
|------|---------|
| **Next.js 15+ (App Router)** | Full-stack React framework |
| **Javascript**
| **NextAuth.js** | Authentication and session management |
| **MongoDB + Mongoose** | NoSQL database for storing evaluations |
| **Tailwind CSS / ShadCN** | UI styling and component library |
| **Radix UI** | Accessible UI primitives |
| **Chart.js or Recharts** | Performance data visualization |

---


## 🛠 Installation & Setup

### 1. Clone the Repo
```bash
git clone https://github.com/bayedhaf/employee-evaluation-dashboard.git
cd employee-evaluation-dashboard
```
### 2. Install Dependencies
```
cd
npm install next react react-dom
npm install next-auth
npm install mongoose
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card textarea separator dialog accordion tooltip table label avatar badge toast
npm install react-icons




```
### 3. Configure Environment Variables
```
.env

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```
### 4. Run the Dev Server
```
npm run dev
