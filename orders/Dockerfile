FROM nameko-examples-grpc-base

# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=891488
RUN mkdir -p /usr/share/man/man1/ /usr/share/man/man3/ /usr/share/man/man7/

RUN apt-get update && \
    apt-get install --yes postgresql-client

ADD wheelhouse /var/nameko/wheelhouse

COPY config.yaml /var/nameko/config.yaml
COPY alembic.ini /var/nameko/alembic.ini
ADD alembic /var/nameko/alembic

WORKDIR /var/nameko/

RUN . /appenv/bin/activate; \
    pip install --no-index -f wheelhouse nameko_examples_grpc_orders

RUN rm -rf /var/nameko/wheelhouse

EXPOSE 8000

CMD . /appenv/bin/activate && \
    while ! pg_isready -h postgresql; do echo "waiting for db"; sleep 5; done && \
    PGPASSWORD=${DB_PASSWORD} PGUSER=${DB_USER} PGHOST=${DB_HOST} \
    psql -tc "SELECT 1 FROM pg_database WHERE datname = 'orders'" | \
    grep -q 1 || PGPASSWORD=${DB_PASSWORD} PGUSER=${DB_USER} PGHOST=${DB_HOST} \
    psql -c "CREATE DATABASE orders" && \
    alembic upgrade head && \
    nameko run --config config.yaml orders.service --backdoor 3000
