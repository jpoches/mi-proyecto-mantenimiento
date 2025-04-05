
markdown
Copiar
Editar
# 🏗️ Sistema de Gestión de Mantenimiento de Edificaciones

Este es un sistema web desarrollado para gestionar el mantenimiento de edificaciones de manera eficiente. Incluye funcionalidades como solicitudes de servicio, órdenes de trabajo, gestión de tareas, facturación, calendario, notificaciones, adjuntos y estadísticas.

---

## 🚀 Tecnologías utilizadas

### Frontend (`client`)
- React
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- React Icons
- React Toastify

### Backend (`server`)
- Node.js
- Express.js
- Sequelize (ORM)
- MySQL
- JWT (JSON Web Tokens)

---

## 🛠️ Requisitos para desarrollo local

- Node.js v14+ y npm
- XAMPP (MySQL)
- Git

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/jpoches/mi-proyecto-mantenimiento.git
cd mi-proyecto-mantenimiento
2. Instalar dependencias
Frontend
bash
Copiar
Editar
cd client
npm install
Backend
bash
Copiar
Editar
cd ../server
npm install
3. Configurar archivos .env
Crear el archivo .env en client/ y server/ con tus variables necesarias.

Ver ejemplos en .env.example si están disponibles.

4. Iniciar el proyecto
Backend
bash
Copiar
Editar
cd server
npm run dev
Frontend
En otra terminal:

bash
Copiar
Editar
cd client
npm run dev
📂 Estructura del Proyecto
bash
Copiar
Editar
client/         # Frontend (React)
server/         # Backend (Node.js + Express)
init.sql        # Script para base de datos MySQL
📌 Funcionalidades principales
Autenticación y autorización de usuarios

Registro de solicitudes de mantenimiento

Generación y seguimiento de órdenes de trabajo

Gestión de clientes, tareas, personal y facturas

Subida y descarga de archivos adjuntos

Notificaciones y eventos en calendario

📥 Base de datos
El archivo init.sql contiene la estructura inicial de la base de datos.

🧑‍💻 Autor
Jpoches
GitHub

