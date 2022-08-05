FROM node:14
WORKDIR /app

COPY package*.json ./
COPY install.sh /install.sh

ARG NODE_ENV
RUN if [ "$NODE_ENV" = 'development' ]; then \
        npm install -g nodemon; \
        fi
RUN chmod +x /install.sh && /install.sh


COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]