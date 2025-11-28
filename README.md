# 🏢 IT Management System (IOCL)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📖 Overview

This **IT Management System** is a full-stack web application developed to streamline IT operations, asset tracking, and complaint management within an enterprise environment (specifically designed during an internship at **Indian Oil Corporation Limited**).

The application provides a centralized dashboard for IT administrators and engineers to manage hardware assets, track service calls/complaints, and generate preventive maintenance (PM) reports.

---

## ✨ Key Features

* **📊 Interactive Dashboard:** Real-time visual overview of assets and complaints using **Recharts**.
* **💻 Asset Management:**
    * CRUD operations for IT assets.
    * **Bulk Upload:** Support for uploading assets via Excel (`.xlsx`) using templates.
* **📞 Complaint & Call Logging:** System for users to log IT issues and for admins to track resolution status.
* **csv/Excel Reports:** Generate and upload Preventive Maintenance (PM) reports.
* **🔐 Authentication:** Secure login system for authorized personnel.
* **⚡ Modern UI/UX:** Built with **React (Vite)** and **Tailwind CSS** for a responsive and fast user interface.

---

## 🛠️ Tech Stack

### **Frontend (`/client`)**
* **Framework:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS + clsx
* **State/Routing:** React Router DOM, Context API
* **Visualization:** Recharts
* **Utilities:** Lucide React (Icons), XLSX (SheetJS), React Toastify

### **Backend (`/backend`)**
* **Server:** Node.js + Express.js
* **Database:** MySQL
* **Security:** Bcrypt (Password hashing)
* **Utilities:** Dotenv, Cors

---

## 📂 Project Structure

```text
├── backend/                # Node.js & Express Server
│   ├── routes/             # API Routes (assets, complaints, etc.)
│   ├── db.js               # Database connection logic
│   ├── hash-users.js       # Utility for user creation
│   └── index.js            # Server entry point
│
├── client/                 # React + Vite Frontend
│   ├── public/             # Static assets & Templates
│   │   └── templates/      # Excel templates (bulk_asset_template.xlsx)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, Header)
│   │   ├── context/        # Auth & Theme contexts
│   │   ├── pages/          # Application Views
│   │   │   ├── AssetManagement.tsx
│   │   │   ├── CallLogging.tsx
│   │   │   ├── ComplaintManagement.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── PMReportUpload.tsx
│   │   └── types/          # TypeScript interfaces
│   └── vite.config.ts      # Vite configuration
└── ...

🚀 Getting Started

Prerequisites

    Node.js (v16 or higher)

    MySQL Server installed and running

1. Database Setup

Create a MySQL database and import the necessary schema (not included in repo, ensure tables for users, assets, and complaints exist).

2. Backend Setup

Navigate to the backend folder and install dependencies:
Bash

cd backend
npm install

Create a .env file in the backend directory:
Code snippet

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=iocl_db
PORT=8800

Start the server:
Bash

npm start
# or
node index.js

3. Client Setup

Navigate to the client folder and install dependencies:
Bash

cd ../client
npm install

Start the development server:
Bash

npm run dev

Open your browser and navigate to http://localhost:5173.

📸 Screenshots

Login Page:

Dashboard Overview:

Asset Management Page:

🤝 Contributing

    Fork the repository.

    Create a new branch (git checkout -b feature/NewFeature).

    Commit your changes (git commit -m 'Add some NewFeature').

    Push to the branch (git push origin feature/NewFeature).

    Open a Pull Request.

📄 License

This project is open-source and available under the MIT License.
