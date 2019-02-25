FROM nameko-examples-grpc-base

ADD wheelhouse /var/nameko/wheelhouse

COPY config.yaml /var/nameko/config.yaml

WORKDIR /var/nameko/

RUN . /appenv/bin/activate; \
    pip install --no-index -f wheelhouse nameko_examples_grpc_products

RUN rm -rf /var/nameko/wheelhouse

EXPOSE 8000

CMD . /appenv/bin/activate; \
    nameko run --config config.yaml products.service --backdoor 3000;
