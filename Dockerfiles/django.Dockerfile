FROM ubuntu:22.04

ENV PYTHONBUFFERED 1

RUN apt-get -y update \
    && apt-get install -y locales curl python3-distutils ffmpeg \
    && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
    && python3 get-pip.py \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt
RUN pip3 install django-cleanup django-cors-headers django-filter opencv-python opencv-contrib-python requests beautifulsoup4 selenium ffmpeg-python

RUN mkdir /django_api

WORKDIR /django_api
COPY ./django_api /django_api