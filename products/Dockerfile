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
    pip install --no-index -f /wheelhouse nameko_examples_grpc_products

# ------------------------------------------------------------------------

FROM base AS service

COPY --from=install /appenv /appenv

COPY config.yaml /var/nameko/config.yaml

WORKDIR /var/nameko/

RUN rm -rf /var/nameko/wheelhouse

EXPOSE 8000

CMD . /appenv/bin/activate; \
    nameko run --config config.yaml products.service --backdoor 3000;
