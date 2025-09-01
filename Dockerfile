# this image is for use during documentation development only and must not be used in production

FROM node:22-bookworm-slim AS builder

WORKDIR /build
COPY package.json .
# ignore scripts to avoid running the prepare script
RUN npm i --ignore-scripts

# create the directories we need in the builder and then we'll copy them in the second stage
RUN mkdir docs
RUN mkdir _site


FROM gcr.io/distroless/nodejs22-debian12:nonroot

# env var which tells our eleventy compute custom code not to attempt to create
# metadata about each published file, just use some sensible defaults. This avoids
# needing to install git, have a git repo available, and avoids needing some json
# meta files which are normally created during the standard site build process.
# Note that the value of this env var doesn't matter, just that it exists.
ENV SKIP_META=true

EXPOSE 8080
WORKDIR /site

COPY --chown=nonroot:nonroot --from=builder /build/node_modules node_modules
COPY --chown=nonroot:nonroot --from=builder /build/docs docs
COPY --chown=nonroot:nonroot --from=builder /build/_site _site
COPY --chown=nonroot:nonroot src src
COPY --chown=nonroot:nonroot .eleventyignore .
COPY --chown=nonroot:nonroot eleventy.config.js .
COPY --chown=nonroot:nonroot docs/_includes docs/_includes
COPY --chown=nonroot:nonroot docs/assets docs/assets
COPY --chown=nonroot:nonroot docs/*.njk docs/
COPY --chown=nonroot:nonroot docs/*.md docs/

CMD ["node_modules/.bin/eleventy", "--serve", "--watch"]
