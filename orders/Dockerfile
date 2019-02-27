FROM python:3.7.2-slim-stretch AS base

RUN apt-get update && \
    apt-get install --yes curl

RUN pip3 install --upgrade pip
RUN pip3 install virtualenv

RUN virtualenv -p python3 /appenv

RUN . /appenv/bin/activate; pip install -U pip

# ------------------------------------------------------------------------

FROM base AS wheels

RUN apt-get update && \
    apt-get install --yes build-essential autoconf libtool pkg-config \
    libgflags-dev libgtest-dev clang libc++-dev automake git

RUN . /appenv/bin/activate; \
    pip install auditwheel

COPY . /application

ENV PIP_WHEEL_DIR=/application/wheelhouse
ENV PIP_FIND_LINKS=/application/wheelhouse

RUN . /appenv/bin/activate; \
    cd /application; \
    pip wheel ".[dev]"

# ------------------------------------------------------------------------

FROM base AS install

COPY --from=wheels /application/wheelhouse /wheelhouse

RUN . /appenv/bin/activate && \
    pip install --no-index -f /wheelhouse nameko_examples_grpc_orders

# ------------------------------------------------------------------------

FROM base AS service

# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=891488
RUN mkdir -p /usr/share/man/man1/ /usr/share/man/man3/ /usr/share/man/man7/

RUN apt-get update && \
    apt-get install --yes postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=install /appenv /appenv

COPY config.yaml /var/nameko/config.yaml
COPY alembic.ini /var/nameko/alembic.ini
ADD alembic /var/nameko/alembic

WORKDIR /var/nameko/

EXPOSE 8000

CMD . /appenv/bin/activate && \
    while ! pg_isready -h postgresql; do echo "waiting for db"; sleep 5; done && \
    PGPASSWORD=${DB_PASSWORD} PGUSER=${DB_USER} PGHOST=${DB_HOST} \
    psql -tc "SELECT 1 FROM pg_database WHERE datname = 'orders'" | \
    grep -q 1 || PGPASSWORD=${DB_PASSWORD} PGUSER=${DB_USER} PGHOST=${DB_HOST} \
    psql -c "CREATE DATABASE orders" && \
    alembic upgrade head && \
    nameko run --config config.yaml orders.service --backdoor 3000
