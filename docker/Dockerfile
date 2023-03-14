FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install \
    && adduser \
        --disabled-password \
        --gecos "" \
        --shell "/bin/sh" \
        --uid 10001 \
        appuser \
    && chown -R \
        appuser:appuser \
        /usr/src/app

USER appuser

CMD ["yarn", "start"]
