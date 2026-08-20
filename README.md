# Sistema ERP

Este es el repositorio principal para el sistema tipo ERP/CRM de BalamDev. En este repositorio se almacenan los archivos y ficheros iniciales para comenzar con el desarrollo del proyecto.

El sistema se manejara bajo una arquitectura modular monolita, sujeta a modificaciones dependiendo las situaciones que se presenten.

El repositorio de momento solo cuenta con los archivos en su etapa de inicio con configuraciones basicas para el arranque, las cuales se modificaran una vez se inicie con el desarrollo de lleno.

Ademas, el sistema pornto contara con las configuraciones necesarias para ejecutarse desde Docker.

De momento aqui estaran las indicaciones para arracarlo desde un entorno seguro de desarrollo.

## Configuracion inicial

Para inicializar el proyecto se necesita contar con las siguientes tecnologias instaladas:

- Python 3.13.5 +
- Node 22.7.0 +

El siguiente paso es una vez clonando el repositorio de forma local:

- Ejecutar los siguientes comandos para inicializar y hacer la prueba con el endpoint de /health:

```cmd
cd backend

python -m venv .venv
.\.venv\Scripts\Activate.ps1

cd app
pip install -r requirements.txt

uvicorn main:app --reload
```

- Ejecutar los siguientes comandos para inicializar el cliente frontend del sistema:

```cmd
cd frontend

npm install

npm start
```

Con los comandos anteriormente ejecutados el proyecto quedara inicializado.
