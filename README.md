# CRM/XYNTRA-BALAMDEV

Este es el repositorio principal para el sistema tipo ERP/CRM de BalamDev. En este repositorio se almacenan los archivos y ficheros iniciales para comenzar con el desarrollo del proyecto.

El sistema se manejara bajo una arquitectura modular monolita, sujeta a modificaciones dependiendo las situaciones que se presenten.

El proyecto cuenta con la configuracion necesaria para ser montado usando Docker, cualquier cambio esta sujeto a revisiones y mejoras. A continuacion esta la ruta exacta de cada archivo.

```cmd
- ./backend/docker-compose.yml
- ./backend/app/Dockerfile
```

Ademas los archivos de requirements.txt y configuración de Alembic se encuentras en la ruta de:

```cmd
- ./backend/app/...
```

## Configuración inicial

El contenedor de Docker, cuenta con tres imagenes principales:

- Backend -> Contiene los archivos principales de la aplicacion en cuanto a funcionalidad y manejo de la información.

- Postgress -> Arquitectura principal de la base de datos.

- Redis -> Servicio a futuro para manejar todas las tareas asincronas. [no implementado aun]

A continuacion, especificamos los comandos y configuracion de arranque para los servicios de *backend* y el cliente *frontend*.

### Backend

Ejecutar los siguientes comandos e instrucciones para inicializar el proyecto y montar el contenedor en Docker. 

- Arrancar el entorno virtual de Python (en caso de requerirlo)
```cmd
cd backend

python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
- Montar el contenedor de Docker, el cual debemos tener previamente instalado desde: https://docs.docker.com/desktop/setup/install/windows-install/
```cmd
cd backend

docker compose up --d
```
- Ahora ya que tenemos montado el contenedor con las imagenes, solo faltara que iniciemos con el proceso de las migraciones. El cual consta de los siguientes comandos en orden.
```cmd
cd backend/app

alembic init migrations

cd ..

docker compose exec backend alembic revision --autogenerate -m "initial_schema"   
(este comando genera de forma automatica la version inicial de la base de datos)

docker compose exec backend alembic upgrade head   
(con este comando bastara para montar la arquitectura de la BD en nuestra imagen de Docker, con las tablas correspondientes al proyecto)
```
- Los siguientes son algunos comandos utiles para evitar tener problemas con las migraciones y las versiones que llegemos a generar. Automaticamente Alembic estara revisando el estado de nuestra BD, pero es de gran utilidad revisarlo manualmente para evitar problemas mas grandes a futuro.
```cmd
docker compose exec backend alembic current   
(revisa la version que tenemos montada en nuestro sistema de BD)

docker compose exec postgres psql -U postgres -d "nombre de BD" -c "\dt"  
(muestra el estado actual de la base de datos y los cambios recientes)
```

### Frontend
- El cliente frontend incluido en este repositorio esta desarrollado con Vite/React, basta con seguir las siguientes instrucciones para poder visualizarlo:

```cmd
cd frontend

npm install

npm run dev
```

### Consideraciones

El proyecto se encuentra en etapa de desarrollo, sujeto a cualquier tipo de cambio en arquitectura, patrones de diseño y modelado de datos, por lo que se tomo la decision de usar herramientas como:

- Docker: Para la virtualizacion y manejo de dependencias.

- Alembic: Para las migraciones y configuracion ORM de la base de datos.

- Arquitectura modular monolita: Sujeta a ser remplazada por una arquitectura por repositorios a futuro para mejorar el manejo de los datos o cualquier otra arquitectura/patron de diseño. Queda completamente abierto a la siguiente revisión.
