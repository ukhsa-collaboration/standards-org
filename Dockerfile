# this image is for use during documentation development only and must not be used in production

FROM node:22-alpine

# env var which tells our eleventy compute custom code not to attempt to create
# metadata about each published file, just use some sensible defaults. This avoids
# needing to install git, have a git repo available, and avoids needing some json
# meta files which are normally created during the standard site build process.
ENV SKIP_META=true

EXPOSE 8080

WORKDIR /site

COPY package.json .
# ignore scripts to avoid running the prepare script
RUN npm i --ignore-scripts

COPY src src
COPY .eleventyignore .
COPY eleventy.config.js .

RUN mkdir docs
COPY docs/_includes docs/_includes
COPY docs/assets docs/assets
COPY docs/*.njk docs/
COPY docs/*.md docs/

CMD ["npx", "eleventy", "--serve", "--watch"]
