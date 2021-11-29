# 1. specify a base image (node)

FROM node:latest

# 2. set a working directory

WORKDIR /app

# 3. copy package.json to the working directory

COPY package.json .

# 4. install dependencies

# RUN npm install

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

# 5. copy current dir to the container

COPY . ./

# EXPOSE 3000

ENV PORT 3000

EXPOSE $PORT

CMD ["node", "index.js"]


