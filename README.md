# UKHSA Organisational Standards

Welcome to the UKHSA organisational standards. This repository contains standards, guidelines and best practices that define how we do engineering at UKHSA and what we expect from our teams and partners.

## Purpose

// TODO: Add more detail on the purpose of this repository and its contents

### When to use these guidelines

// TODO: Add more detail on when to use these guidelines

## Development container image

A container image for developing documentation is defined in this repository in the `Dockerfile`.
This image is designed to only be used in the development environment as an aid for creating documentation so that it
can be previewed before adding it to this repository's configuration for publication.
This also means documentation owners don't need to clone and use this repository to view their documentation, they can
just use the image.

### Usage

It is recommended that you use the `latest` tagged version of this image, although other commit specific tags exist as
well for testing purposes.

```bash
docker run -p "8080:8080" -v "./docs:/site/docs/<name>" ghcr.io/ukhsa-collaboration/standards-org
```

where `<name>` is the path you wish the docs to be made available under when viewing them.
This `<name>` must match the name of the `<name>.11tydata.json` data file in the documentation repo's docs/ dir.
It's recommended that you use the real path (e.g. `api-design-guidelines`) you will be publishing the docs under on the
standards org site as this means you can check everything will work when published, e.g. relative links.

When running the above `docker run ...` command, this runs Eleventy with the `--watch`, enabling you to just run the
command once and any updates will be picked up automatically.

### Building the Image

To build the image from the root of this repository:

```bash
docker build . -t ghcr.io/ukhsa-collaboration/standards-org
```

The image is created is a [distroless](https://github.com/GoogleContainerTools/distroless) image which has been
hardened.
If you need to debug something specific, it's recommended that you locally edit the `Dockerfile` to use the
`debug-nonroot` tag instead of `nonroot` for the second stage, this will allow you to then run a shell in the image.
See the [distroless](https://github.com/GoogleContainerTools/distroless?tab=readme-ov-file#debug-images) docs for more
information about this.
Of course make sure to remove the debug part of the tag before to avoid pushing it.

#### Linting the Dockerfile

The Dockerfile will be linted and validated after pushing using the `docs-container.yml` workflow, however, if you
want to run these checks locally you can:

```bash
# validate the dockerfile with docker
docker build --check .

# lint the dockerfile with hadolint
docker run --rm -i -v "./.hadolint.yaml:/.hadolint.yaml" hadolint/hadolint < Dockerfile
```

## Contributing

We welcome contributions to improve these guidelines. Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get involved.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][mit].
This covers both the codebase and any sample code in the documentation.

The documentation is [© Crown copyright][copyright] and available under the terms
of the [Open Government 3.0][ogl] licence.

## Contact

TODO

[mit]: LICENCE
[copyright]: https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
