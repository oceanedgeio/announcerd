# TODO: Rewrite/Replace announcerd with Androgee or basically anything less insane
FROM node:lts
RUN git clone https://github.com/egee-irl/announcerd.git

WORKDIR /announcerd
RUN npm ci
CMD npm start
