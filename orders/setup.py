#!/usr/bin/env python
from setuptools import find_packages, setup

setup(
    name="nameko-examples-grpc-orders",
    version="0.0.1",
    description="Store and serve orders",
    packages=find_packages(exclude=["test", "test.*"]),
    install_requires=[
        "nameko==2.11.0",
        "nameko-grpc==1.0.1",
        "nameko-sqlalchemy==1.4.0",
        "alembic==1.0.7",
        "psycopg2-binary==2.7.7",
    ],
    extras_require={
        "dev": [
            "pytest==4.3.0",
            "coverage==4.5.2",
            "flake8==3.7.6",
            "grpcio-tools==1.18.0",
        ]
    },
    zip_safe=True,
)
