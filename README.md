# SPARK – Task Management Platform (Trello Clone)

SPARK is a **full-stack task management platform inspired by Trello** that helps teams organize tasks using an interactive Kanban-style board.

The platform allows users to **create, manage, and track tasks across different stages of a project**, improving productivity and collaboration.

![SPARK Preview](./trello-clone.png)

---

##  Key Features

- **Task Management**: Create, update, and delete tasks easily.
- **Kanban Board**: Interactive Kanban-style task board for workflow management.
- **Role-Based Access**: Specialized dashboards for Admin and Member roles.
- **Secure Authentication**: Robust secure authentication using JWT.
- **Organized Workflow**: Manage tasks using status columns (To Do, In Progress, Completed).
- **Modern UI**: Clean, responsive, and dynamic user interface design.

---

## Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT |
| **Tools** | Git, GitHub, VS Code |

---

##  Project Structure

```text
TrelloClone
│
├── frontend
│   ├── components
│   ├── pages
│   └── styles
│
├── backend
│   ├── models
│   ├── routes
│   └── controllers
│
└── README.md
```

---

## Overview

SPARK is designed to simplify **project and task management** by providing an intuitive Kanban-style interface similar to Trello.

Users can manage tasks across multiple stages:
- **To Do**
- **In Progress**
- **Completed**

This visual workflow helps teams **track progress efficiently and manage projects more effectively**.

---

## 📸 Screenshots

Here is a glimpse of the different views and components available in SPARK. *(Note: Ensure the images are placed in a `screenshots` folder in the root directory)*

###  Authentication
<img width="1920" height="1080" alt="Loginsignup" src="https://github.com/user-attachments/assets/7fd3ba79-4e19-4408-8b39-ef23a2d76c9e" />

###  Admin Views
<img width="1920" height="1080" alt="admin_dashboard" src="https://github.com/user-attachments/assets/88637f3b-9640-4b09-8baa-9037209be3c9" />
<img width="1920" height="1080" alt="users" src="https://github.com/user-attachments/assets/2c123229-ba52-417b-9478-3f8ec40cf8c2" />
<img width="1920" height="1080" alt="project" src="https://github.com/user-attachments/assets/186763f3-3166-4163-9878-7e1285e7b649" />
<img width="1920" height="1080" alt="pending_approvals" src="https://github.com/user-attachments/assets/6b13c586-bae6-40eb-91c8-8025462f2fa6" />
<img width="1920" height="1080" alt="task" src="https://github.com/user-attachments/assets/39816348-7f9b-4924-b53d-e51354c7d4fe" />

### Member Views
<img width="1920" height="1080" alt="mem_dashboard" src="https://github.com/user-attachments/assets/945cfabd-545d-4cd2-a4f2-a6042a6742f4" />
<img width="1920" height="1080" alt="mem_task" src="https://github.com/user-attachments/assets/d5061ce2-7a0a-4213-a159-82b38fdbbaaf" />

---

##  Installation and Setup

**1. Clone the repository:**
```bash
git clone https://github.com/imannaswini/TrelloClone.git
```

**2. Navigate to the project folder:**
```bash
cd TrelloClone
```

**3. Install dependencies (Root, Frontend, Backend):**
```bash
# Run this inside the backend directory
cd backend
npm install

# Run this inside the frontend directory
cd ../frontend
npm install
```

**4. Run backend server:**
```bash
cd ../backend
node server.js
```

**5. Run frontend:**
```bash
cd ../frontend
npm start
# or npm run dev depending on your package.json
```

**6. Open the application in browser:**
```text
http://localhost:3000
```

---

## 🔌 API Overview

Example backend endpoints:

| Method | Endpoint | Description |
|------|---------|-------------|
| `POST` | `/api/signup` | Register new user |
| `POST` | `/api/login` | User authentication |
| `GET` | `/api/tasks` | Fetch tasks |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

---

##  Future Improvements

- [ ] Real-time collaboration
- [ ] Drag-and-drop task cards
- [ ] Task deadlines and notifications
- [ ] Team collaboration features
- [ ] Cloud deployment

---

##  Author

**Mannaswini P A**

- **GitHub:** [imannaswini](https://github.com/imannaswini)
- **LinkedIn:** [mannaswini](https://www.linkedin.com/in/mannaswini)
