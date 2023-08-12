FROM python:3
WORKDIR /usr/src/app
ADD . .
RUN pip3 install --no-cache-dir -r requirements.txt
EXPOSE 8080
CMD pylsp --ws --host 0.0.0.0 --port 8080