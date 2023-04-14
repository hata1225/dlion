FROM python:3.11.3-slim-bullseye

ENV PYTHONBUFFERED 1
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get -y update \
    && apt-get install -y locales curl build-essential zlib1g-dev libncurses5-dev \
    libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget \
    libsqlite3-dev libgl1-mesa-glx libglib2.0-0 ffmpeg \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

RUN mkdir /django_api

WORKDIR /django_api
COPY ./django_api /django_api
COPY ./.env /django_api/.env