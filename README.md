# 💰 Expense Tracker App

A full-stack expense tracking web application with observability, containerization, and deployment using Docker Compose and Terraform on AWS EC2.

---

## 🚀 Features

### 👨‍💻 Frontend (React + TypeScript)
- Add, edit, and delete expenses
- Filter by category/date
- Dashboard with analytics (e.g., charts)
- Role-based access (admin vs employee)

### 🔧 Backend (Node.js + TypeScript)
- RESTful API with JWT authentication
- PostgreSQL database
- Redis caching for performance
- OpenTelemetry instrumentation for tracing

### 📊 Observability Stack (Optional)
- Grafana, Prometheus, Loki
- Logs, metrics, and distributed tracing support

---

## 📦 Tech Stack

| Layer       | Tech |
|------------|------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript |
| Database   | PostgreSQL |
| Cache      | Redis |
| Observability | Grafana, Prometheus, Loki, OpenTelemetry |
| DevOps     | Docker Compose, Terraform, AWS EC2 |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/dubey-supriya-270/expenses.git
cd expense-tracker
