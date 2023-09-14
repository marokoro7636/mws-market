FROM python:3.10.13-slim-bullseye

WORKDIR /app

# Python dependencies

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

CMD ["/bin/sh"]