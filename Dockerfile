FROM node:16

RUN mkdir /market

WORKDIR /market

COPY ./pacage.json /market

RUN npm install

COPY . /market

RUN npm run build

CMD  ["npm ", "start"]