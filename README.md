# Ghost Storage Cloudinary

[![npm version](https://badge.fury.io/js/ghost-storage-cloudinary.svg)](https://badge.fury.io/js/ghost-storage-cloudinary)
[![Build Status](https://travis-ci.org/eexit/ghost-storage-cloudinary.svg?branch=master)](https://travis-ci.org/eexit/ghost-storage-cloudinary)
[![Maintainability](https://api.codeclimate.com/v1/badges/f55e8c82a9a526fe9b2f/maintainability)](https://codeclimate.com/github/eexit/ghost-storage-cloudinary/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f55e8c82a9a526fe9b2f/test_coverage)](https://codeclimate.com/github/eexit/ghost-storage-cloudinary/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/eexit/ghost-storage-cloudinary/badge.svg)](https://snyk.io/test/github/eexit/ghost-storage-cloudinary)



A fully featured and deeply tested [Cloudinary](https://cloudinary.com/) [Ghost](https://github.com/TryGhost/Ghost) storage adapter.

### Features

- Compatible with all Ghost versions :rocket:
- Latest Cloudinary NodeJS [SDK](https://github.com/cloudinary/cloudinary_npm)
- Image upload, existence check & deletion (when Ghost will support it)
- Ability to upload in dated sub-directories (alike first Ghost default Local storage adapter `YYYY/MM`)
- Ability to upload images into a specific directory
- Ability to tag images
- Cool [plugins](plugins)!
- Should be compatible with [mmornati/ghost-cloudinary-store](https://github.com/mmornati/ghost-cloudinary-store) configuration

## Installation

### Install from Yarn

- Go into Ghost root directory
- Download the adapter:

```bash
$ yarn add ghost-storage-cloudinary@2
$ mv node_modules/ghost-storage-cloudinary core/server/adapters/storage
```

- Done, go configure

### Install on Docker

Here's an example of using this adapter with a containerized Ghost:

```Dockerfile
FROM ghost:3-alpine as cloudinary
WORKDIR $GHOST_INSTALL/current
RUN su-exec node yarn add ghost-storage-cloudinary@2

FROM ghost:3-alpine
COPY --chown=node:node --from=cloudinary $GHOST_INSTALL/current/node_modules $GHOST_INSTALL/current/node_modules
COPY --chown=node:node --from=cloudinary $GHOST_INSTALL/current/node_modules/ghost-storage-cloudinary $GHOST_INSTALL/current/core/server/adapters/storage/ghost-storage-cloudinary
RUN set -ex; \
    su-exec node ghost config storage.active ghost-storage-cloudinary; \
    su-exec node ghost config storage.ghost-storage-cloudinary.upload.use_filename true; \
    su-exec node ghost config storage.ghost-storage-cloudinary.upload.unique_filename false; \
    su-exec node ghost config storage.ghost-storage-cloudinary.upload.overwrite false; \
    su-exec node ghost config storage.ghost-storage-cloudinary.fetch.quality auto; \
    su-exec node ghost config storage.ghost-storage-cloudinary.fetch.cdn_subdomain true;
```

Here, we use the Ghost CLI to set some pre-defined values.

:information_source: For Ghost version `1.x`, use `ghost-storage-cloudinary@1` package version.

## Configuration

Check out [configuration.json.dist](configuration.json.dist) for a complete example.

- Ensure to disable Ghost [Image Optimisation](https://ghost.org/docs/concepts/config/#image-optimisation)
- The optional `useDatedFolder = false` to upload images in dated sub-directories (alike default Ghost Local storage adapter)
- The `auth` property is optional if you use the `CLOUDINARY_URL` environment variable [authentification method](https://cloudinary.com/documentation/node_additional_topics#configuration_options)
- The optional `upload` property contains Cloudinary API [upload options](https://cloudinary.com/documentation/image_upload_api_reference#upload)
- The optional `fetch` property contains Cloudinary API [image transformation options](https://cloudinary.com/documentation/image_transformations)

### Recommended configuration

- `upload.use_filename = true` in order use the original image name
- `upload.unique_filename = false` unlikely Ghost local storage adapter which auto-dedup an existing file name, Cloudinary will return the existing image URL instead of deduping the image
- `upload.overwrite = false ` goes along with previous option: returns existing image instead of overwriting it
- `upload.folder = "my-blog"` allows to upload all your images into a specific directory instead of Cloudinary media library root
- `upload.tags = ["blog", "photography"]` if you want to add some taxonomy to your uploaded images
- `fetch.quality = "auto"` equals `auto:good` (see [doc](https://cloudinary.com/documentation/image_transformation_reference#quality_parameter))
- `fetch.secure = false` set to true if you want to serve images over SSL (not recommended for performances)
- `fetch.cdn_subdomain = true` to really use the benefit of Cloudinary CDN


:heart: Don't forget to checkout the [plugins](plugins)!

## Development

Run `yarn install` without the `--production` flag.

Runs the tests and generate coverage:

	$ npm t

Runs the linter:

	$ npm run eslint

To enable debug logs, set the following environment variable:

	DEBUG=ghost-storage-cloudinary:*

---

Many thanks to @[mmornati](https://github.com/mmornati), @[sethbrasile](https://github.com/sethbrasile) and all other contributors for their work. In the continuation of this project, don't hesitate to fork, contribute and add more features.
