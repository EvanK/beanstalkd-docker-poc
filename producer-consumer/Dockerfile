FROM mhart/alpine-node:5.6.0

WORKDIR /app
ADD . /app

RUN npm install --production

CMD ["npm", "start"]
