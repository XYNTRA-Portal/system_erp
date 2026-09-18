import os
import sys

# carga la configuracion de logging declarada en alembic.ini
from logging.config import fileConfig 
# pool -> configurar el tipo de conexiones SQLAlchemy || create_engine -> engine para conectarse a Postgres con alembic
from sqlalchemy import pool, create_engine
# objeto principal de alembix para controlar la ejecucion de las migraciones
from alembic import context

# path de los archivos
sys.path.insert(
    0,
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from core.config import settings
from core.database import Base
import models

# representacion de la configuracion de alembic
config = context.config

# verificamos si alembic tiene un archivo de configuracion
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# metadata para saber como deberia verse la BD, tiene las tablas definidas por los modelos
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    # obtenemos la url de conexion configurada para alembic
    url = settings.alembic_database_url

    # configuracion del contexto completo para alembic
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    # inicia la transaccion para ejecutar migraciones
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # creamos el engine para conectar a postgresql
    connectable = create_engine(
        settings.alembic_database_url,
        poolclass=pool.NullPool, #indicamos asi para mantener un pool de conexiones reusables
    )

    # se abre la conexion con postgres
    with connectable.connect() as connection:
        # configuramos el contexto de alembic para trabajar con esta conexion
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        # inicio de la transaccion
        with context.begin_transaction():
            context.run_migrations()

"""
ALEMBIC puede trabajar de dos modos, dependiendo de la configuracion que proporcionamos
y de si tenemos seteada una url disponible e indicada, estos son los modos:

OFFLINE -> No establece conexion directa con PostgreSQL
ONLINE -> Se conecta con PostgreSQL
"""
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()