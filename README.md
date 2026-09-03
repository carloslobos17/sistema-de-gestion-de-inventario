# Sistema de Gestión de Inventario 

Repositorio oficial del ERP para el control de **inventarios, finanzas, ventas y sesiones de usuario**.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu equipo:
* **Node.js** (Versión 18 o superior recomendada)
* **npm**
* Servidor de base de datos **MySQL**

---

## ⚙️ Configuración Inicial

1. **Clonar el repositorio y cambiar a la rama de desarrollo:**
   ```bash
   git clone <url-del-repositorio>
   cd sistema-de-gestion-de-inventario
   git checkout dev
   ```

2. **Configurar las Variables de Entorno del Backend:**
   Crea un archivo `.env` dentro de la carpeta `backend/` con la siguiente estructura:

   Fragmento de código
   ```
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_de_tu_base_de_datos"
   PORT=4000
   JWT_SECRET="tu_clave_secreta_jwt"
   ```

   > ⚠️ **Importante:** Nunca subas el archivo `.env` al repositorio (está protegido por el `.gitignore`).

## 🗄️ Base de Datos y Migraciones

1. **Instalar dependencias del Backend:**

   Bash
   ```
   cd backend
   npm install
   ```

2. **Ejecutar migraciones de Prisma:**
   Sincroniza todas las tablas, enums e índices hacia tu MySQL local ejecutando:

   Bash
   ```
   npx prisma migrate dev --name init_erp
   ```

3. **Prisma Studio (Opcional):**
   Si necesitas visualizar o administrar los datos de forma gráfica:

   Bash
   ```
   npx prisma studio
   ```

## ▶️ Cómo Levantar el Proyecto

### 🔵 Backend (Modo Desarrollo)

Bash

```
cd backend
npm run dev
```

*(El servidor se iniciará en* *`http://localhost:4000`* *o en el puerto que hayas configurado en tu* *`.env`**).*

### 🟢 Frontend (Modo Desarrollo)

Abre una **nueva terminal**, dirígete al frontend e instálalo:

Bash

```
cd frontend
npm install
npm run dev
```

*(El cliente web se iniciará en* *`http://localhost:5173`**).*

## 📁 Estructura del Proyecto

Plaintext

```
sistema-de-gestion-de-inventario/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, MySQL, JWT.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS.

## 📌 Resumen de Comandos Principales

### Backend (`/backend`)

Bash

```
npm install              # Instalar dependencias
npm run dev              # Levantar servidor en desarrollo
npx prisma migrate dev   # Aplicar migraciones
npx prisma studio        # Interfaz gráfica de base de datos
```

### Frontend (`/frontend`)

Bash

```
npm install              # Instalar dependencias
npm run dev              # Levantar entorno de desarrollo
```