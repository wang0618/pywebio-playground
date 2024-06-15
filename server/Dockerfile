FROM python:3
WORKDIR /usr/src/app
ADD . .
RUN pip3 install --no-cache-dir -r requirements.txt
EXPOSE 8080
CMD while true ; do timeout 1800 python pywebio_server.py; sleep 1; done 