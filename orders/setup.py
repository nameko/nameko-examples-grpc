#!/usr/bin/env python
from setuptools import find_packages, setup

setup(
    name="nameko-examples-grpc-orders",
    version="0.0.1",
    description="Store and serve orders",
    packages=find_packages(exclude=["test", "test.*"]),
    install_requires=[
        "nameko==2.11.0",
        "nameko-sqlalchemy==0.0.4",
        "alembic==0.8.7",
        "marshmallow==2.15.1",
        "psycopg2==2.7.4",
    ],
    extras_require={"dev": ["pytest==4.3.0", "coverage==4.4.1", "flake8==3.3.0"]},
    zip_safe=True,
)
