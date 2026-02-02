FROM node:22.16.0


COPY package*.json ./



RUN npm install



COPY . .


EXPOSE 3000

WORKDIR /dist


CMD ["server.js","node"]