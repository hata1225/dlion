FROM ubuntu:22.10

ENV PYTHONBUFFERED 1
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update \
    && apt-get install -y locales curl build-essential zlib1g-dev libncurses5-dev \
    libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget \
    libsqlite3-dev libgl1-mesa-glx libglib2.0-0 ffmpeg tzdata \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
RUN wget https://www.python.org/ftp/python/3.11.2/Python-3.11.2.tgz \
    && tar -xzf Python-3.11.2.tgz \
    && cd Python-3.11.2 \
    && ./configure --enable-optimizations \
    && make altinstall \
    && cd ..
RUN rm -rf Python-3.11.2 \
    && rm Python-3.11.2.tgz \
    && rm -f /usr/bin/python3 \
    && ln -s /usr/local/bin/python3.11 /usr/bin/python3 \
    && python3 -m ensurepip \
    && rm -f /usr/bin/pip3 \
    && ln -s /usr/local/bin/pip3.11 /usr/bin/pip3 \
    && pip3 install --upgrade pip

COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

RUN mkdir /django_api

WORKDIR /django_api
COPY ./django_api /django_api
COPY ./.env /django_api/.env