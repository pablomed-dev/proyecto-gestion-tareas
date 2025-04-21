# 📝 Proyecto: Gestor de Tareas

Este es un proyecto de gestión de tareas desarrollado con **Django (usando Django REST Framework)** para el backend y **Next.js (React), utilizando TypeScript y Tailwind CSS** para el frontend. Permite crear, listar, editar y eliminar tareas.

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend

- Python 3
- Django 4
- Django REST Framework
- SQLite (base de datos por defecto)
- django-cors-headers

### 🎨 Frontend

- React 18
- Vite
- Axios
- Bootstrap (opcional para estilos)

---

## 🚀 Instalación y ejecución

### 🔙 Backend (Django)

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Crear y activar entorno virtual
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar migraciones
python manage.py migrate

# 5. Correr el servidor
python manage.py runserver
```

📍 El backend estará disponible en:  
`http://localhost:8000/api/tareas/`

---

### 🔜 Frontend (React)

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Correr la app
npm run dev
```

📍 El frontend estará disponible en:  
`http://localhost:5173/`

---

## 🌐 API - Endpoints

Base URL: `http://localhost:8000/api/tareas/`

### 🔄 Obtener todas las tareas
- **GET** `/api/tareas/`

### 🔎 Obtener una tarea por ID
- **GET** `/api/tareas/<id>/`

### 🆕 Crear una nueva tarea
- **POST** `/api/tareas/`
```json
{
  "titulo": "Aprender Django",
  "descripcion": "Estudiar serializers y views",
  "fecha_limite": "2025-04-30",
  "estado": "pendiente"
}
```

### ✏️ Actualizar una tarea
- **PUT** `/api/tareas/<id>/`

### 🗑️ Eliminar una tarea
- **DELETE** `/api/tareas/<id>/`

---

## 🔐 CORS y comunicación

La app frontend se comunica con la API mediante Axios. Es necesario configurar `django-cors-headers` en el backend para permitir el acceso del frontend:

```python
# settings.py
INSTALLED_APPS = [
    ...
    "corsheaders",
    ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
```

---


## 🖼️ Capturas de pantalla (opcional)

### Lista de tareas

![Lista de tareas](docs/lista-tareas.png)

### Formulario de nueva tarea

![Formulario nueva tarea](docs/formulario-tarea.png)

> 📸 Colocá las imágenes en la carpeta `/docs` o ajustá las rutas según donde guardes las capturas.

---

## 🧾 Licencia

Este proyecto es de uso educativo y puede ser adaptado libremente para fines personales o académicos.

---