#download base image ubuntu 22.04.2
FROM ubuntu:22.04


#update
RUN apt-get update

#configure place
RUN mkdir myPlace
WORKDIR /myPlace

#install node.js
RUN apt install -y nodejs

#install wget
RUN apt install -y wget

#install mongodb
RUN apt install -y gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" |  tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt-get update
RUN  apt-get install -y mongodb-org
WORKDIR /
RUN mkdir data
WORKDIR /data
RUN mkdir db
WORKDIR /myPlace

#install git
RUN apt-get install -y git

# get repo with app
RUN mkdir endlessRunner
WORKDIR /myPlace/endlessRunner
RUN git init
RUN git branch -m master main
RUN git pull https://github.com/Dakaro/IO-Endless-Runner

# install nano
RUN apt install -y nano

#create .env
RUN touch .env

#install npm
RUN apt install -y npm

#install ngrok
WORKDIR /myPlace
RUN mkdir ngrok
WORKDIR /myPlace/ngrok
RUN wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
RUN tar xvzf ngrok-v3-stable-linux-amd64.tgz

WORKDIR /myPlace/endlessRunner
