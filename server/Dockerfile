FROM node:carbon

# Create app directory
WORKDIR /usr/src/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

ENV PGHOST=db
ENV PGUSER=postgres
ENV PGDATABASE=jamsel
ENV PORT=3001
RUN yarn install
CMD ["yarn", "run", "start"]