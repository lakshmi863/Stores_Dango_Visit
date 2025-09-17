# Store Visit Django + React Project

web site link frontend( https://storevisitdjangoproject-front-demo.onrender.com )

web site link backend ( [ https://storevisitdjangoproject-backend-demo.onrender.com/admin/login/?next=/admin/](https://stores-dango-visit-backend.onrender.com/admin/accounts/store/) )


This is a **full-stack web application** built with:

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Django + Django REST Framework (DRF)
- **Database:** SQLite / PostgreSQL (configurable)
- **Deployment:** Render / Docker
- **Version Control:** Git + GitHub

---

## 🚀 Project Architecture




Dashboard view
<img width="1277" height="287" alt="image" src="https://github.com/user-attachments/assets/445cf65e-6b09-4da3-a853-3b6dc1f5d055" />

create new activities 

<img width="712" height="610" alt="create activity" src="https://github.com/user-attachments/assets/60151586-11ff-463f-880d-298d7d125fa9" />

complete activity

<img width="1132" height="417" alt="complete activity" src="https://github.com/user-attachments/assets/81335360-f7d6-4577-b8df-637d7f400b9b" />

todays plan

<img width="1256" height="375" alt="today plan " src="https://github.com/user-attachments/assets/39d13489-ccae-4890-9575-b17669a3588d" />

Live map update:

<img width="1077" height="767" alt="image" src="https://github.com/user-attachments/assets/e672efdd-0fdf-4b84-b23f-ae1ad82931ef" />


out of range

<img width="837" height="792" alt="out of range" src="https://github.com/user-attachments/assets/e3fe5c89-4b96-4793-b35f-a281081e912d" />



```mermaid
flowchart LR
    A[Frontend\nReact + Tailwind] <--> B[Backend\nDjango + DRF]
    B --> C[Database\nSQLite / PostgreSQL]
    D[GitHub Repo] --> A
    D[GitHub Repo] --> B
    A --> E[Deployment\nRender / Docker]
    B --> E[Deployment\nRender / Docker]
```

---

## 📂 Project Structure

```
React and Django/
│── backend/ (Django Project)
│   ├── manage.py
│   ├── storevisitdjangoproject/ (Django settings, urls, wsgi/asgi)
│   ├── apps/ (custom Django apps)
│   └── requirements.txt
│
│── frontend/ (React Project)
│   ├── src/
│   │   ├── components/ (Navbar, Footer, etc.)
│   │   ├── pages/ (Home, Shop, etc.)
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
│── .git/ (Git repository)
│── venv/ (Python Virtual Environment - ignored)
│── node_modules/ (React dependencies - ignored)
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/lakshmi863/storevisitdjangoproject.git
cd storevisitdjangoproject
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

---

## 🔑 Features
- JWT Authentication (Login/Register)
- REST API with Django REST Framework
- Responsive UI with Tailwind CSS
- State management in React (Hooks/Context)
- GitHub integration for version control
- Docker/Render deployment ready

---

## 📌 Deployment
- **Render:** Automatic deploys from GitHub
- **Docker:** Containerized setup with Docker Compose

---

## 👨‍💻 Author
**Lakshmi863**  
GitHub: [lakshmi863](https://github.com/lakshmi863)
