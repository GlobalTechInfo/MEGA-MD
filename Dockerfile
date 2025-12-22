FROM quay.io/qasimtech/mega-bot:latest

RUN git clone https://github.com/GlobalTechInfo/MEGA-MD /root/mega-md && \
    rm -rf /root/mega-md/.git

WORKDIR /root/mega-md

RUN npm install

EXPOSE 5000
CMD ["npm", "start"]
