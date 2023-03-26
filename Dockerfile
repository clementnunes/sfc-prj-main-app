FROM node:alpine

WORKDIR /sfc-prj-main-app

COPY package.json .
RUN npm install
COPY . .
RUN npm install -g typescript
RUN tsc
CMD ["node", "./dist/index.js"]
