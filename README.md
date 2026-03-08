
---

```markdown
# SPARK – Task Management Platform (Trello Clone)

SPARK is a **full-stack task management platform inspired by Trello** that helps teams organize tasks using an interactive Kanban-style board.

The platform allows users to **create, manage, and track tasks across different stages of a project**, improving productivity and collaboration.

---

# Key Features

- Create, update, and delete tasks  
- Kanban-style task board for workflow management  
- Admin and Member role-based dashboards  
- Secure authentication using JWT  
-  Organized task workflow using columns (To Do, In Progress, Completed)  
-  Clean and responsive UI design  

---

# Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Tools | Git, GitHub, VS Code |

---

#  Project Structure

```

## 📂 Project Structure
 TrelloClone
│
├── frontend
│ ├── components
│ ├── pages
│ └── styles
│
├── backend
│ ├── models
│ ├── routes
│ └── controllers
│
└── README.md


```

---

#  Overview

SPARK is designed to simplify **project and task management** by providing an intuitive Kanban-style interface similar to Trello.

Users can manage tasks across multiple stages:

- To Do  
- In Progress  
- Completed  

This visual workflow helps teams **track progress efficiently and manage projects more effectively**.

---

#  Installation and Setup

Clone the repository:

```

git clone [https://github.com/imannaswini/TrelloClone.git](https://github.com/imannaswini/TrelloClone.git)

```

Navigate to the project folder:

```

cd TrelloClone

```

Install dependencies:

```

npm install

```

Run backend server:

```

node server.js

```

Run frontend:

```

npm start

```

Open the application in browser:

```

[http://localhost:3000](http://localhost:3000)

```

---

#  API Overview

Example backend endpoints:

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/signup | Register new user |
| POST | /api/login | User authentication |
| GET | /api/tasks | Fetch tasks |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

# Future Improvements

- Real-time collaboration  
- Drag-and-drop task cards  
- Task deadlines and notifications  
- Team collaboration features  
- Cloud deployment  

---

#  Author

**Mannaswini P A**

GitHub: https://github.com/imannaswini  
LinkedIn: https://www.linkedin.com/in/mannaswini  


```

---
