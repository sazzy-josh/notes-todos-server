FROM node:14
WORKDIR /app

COPY package*.json ./
# COPY install.sh /install.sh 

ARG NODE_ENV

RUN if [ "$NODE_ENV" = 'development' ]; then \
        npm install -g nodemon; \
        fi

# RUN chmod +x /install.sh && /install.sh

RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install ;  else \ 
        npm install --only=production; \
        fi

RUN if [ "$NODE_ENV" = 'development' ]; then \
        npm install; else \ 
        npm install --only=production; \
        fi

COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]