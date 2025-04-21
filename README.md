# 📝 Proyecto: Gestor de Tareas

Este es un proyecto de gestión de tareas desarrollado con **Django (usando Django REST Framework)** para el backend y **Next.js (React), utilizando TypeScript y Tailwind CSS** para el frontend. Permite crear, listar, editar y eliminar tareas.

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend

- Python 3
- asgiref==3.8.1
- Django==5.2
- django-cors-headers==4.7.0
- djangorestframework==3.16.0
- drf-yasg==1.21.10
- inflection==0.5.1
- numpy==2.2.2
- packaging==25.0
- pandas==2.2.3
- python-dateutil==2.9.0.post0
- pytz==2025.1
- PyYAML==6.0.2
- six==1.17.0
- sqlparse==0.5.3
- tzdata==2025.1
- uritemplate==4.1.1
- xlrd==2.0.1

### 🎨 Frontend

- Next.js
- React
- TypeScript 
- Tailwind CSS
- Dark Mode – Implementación de modo oscuro usando clases de Tailwind

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue una arquitectura **Full Stack separada**, compuesta por dos capas principales:

- **Backend**: Desarrollado con **Django REST Framework**, expone una API RESTful para manejar la lógica de negocio, gestión de datos, etc.
- **Frontend**: Construido con **Next.js (React)**, consume la API proporcionada por el backend y presenta una interfaz moderna al usuario final. Aprovecha las capacidades de Server-Side Rendering (SSR) que ofrece Next.js para mejorar el rendimiento inicial y la indexación por motores de búsqueda.

Comunicación entre ambas capas mediante la librería `django-cors-headers`.

---

## ⚙️ Decisiones Técnicas
- **django-cors-headers** se utiliza para permitir la comunicación entre el frontend (puerto diferente) y el backend (evitando errores CORS).
- **Tailwind CSS** se usa en el frontend para agilizar el diseño responsivo y mantener un estilo moderno.
- El proyecto está estructurado para facilitar la escalabilidad y separación de responsabilidades.

---

## 🚀 Instalación y ejecución

### 🔙 Backend (Django)

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Crear y activar entorno virtual
python -m venv env
source env/bin/activate  
# En Windows: 
env\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar migraciones
python manage.py migrate

# 5. Correr el servidor
python manage.py runserver
```

📍 El backend estará disponible en:  
`http://127.0.0.1:8000/api/gestion_de_tareas/`

---

### 🔜 Frontend (Next.js)

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Correr la app
npm run dev
```

📍 El frontend estará disponible en:  
`http://localhost:3000/`

---

## 🌐 API - Endpoints

Base URL: `http://127.0.0.1:8000/api/gestion_de_tareas/`

### 🔄 Obtener todas las tareas
- **GET** `/api/gestion_de_tareas/`

### 🔎 Obtener una tarea por ID
- **GET** `/api/gestion_de_tareas/<id>/`

### 🆕 Crear una nueva tarea
- **POST** `/api/gestion_de_tareas/`
```json
{
  "titulo": "Prueba 1",
  "descripcion": "Esto es la primera prueba",
  "fecha_limite": "2025-04-22",
  "estado": "pendiente"
}
```

### ✏️ Actualizar una tarea
- **PUT** `/api/gestion_de_tareas/<id>/`

### 🗑️ Eliminar una tarea
- **DELETE** `/api/gestion_de_tareas/<id>/`

---

## 🔐 CORS y comunicación

Es necesario configurar `django-cors-headers` en el backend para permitir el acceso del frontend:

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

## 🧾 Licencia

Este proyecto es de uso educativo y puede ser adaptado libremente para fines personales o académicos.

---