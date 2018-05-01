# Don't use this dockerfile in production. It's useful for getting a
# development environment working quickly. It's not a good way to serve the
# editor files.
#
# To run a container using this image first build the image:
#
# $ docker build -t pythoneditor .
#
# Then run the image:
#
# $ docker run --interactive --tty --publish 8000:8000 pythoneditor
#
# Now open your browser at http://localhost:8000
#
FROM python:3.6

WORKDIR /usr/src/app

EXPOSE 8000

COPY . /usr/src/app/

CMD python -m http.server --bind 0.0.0.0
