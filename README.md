[![Build Status](https://travis-ci.org/mmornati/ghost-cloudinary-store.svg?branch=master)](https://travis-ci.org/mmornati/ghost-cloudinary-store) [![Code Climate](https://codeclimate.com/github/mmornati/ghost-cloudinary-store/badges/gpa.svg)](https://codeclimate.com/github/mmornati/ghost-cloudinary-store) [![Test Coverage](https://codeclimate.com/github/mmornati/ghost-cloudinary-store/badges/coverage.svg)](https://codeclimate.com/github/mmornati/ghost-cloudinary-store/coverage) [![Issue Count](https://codeclimate.com/github/mmornati/ghost-cloudinary-store/badges/issue_count.svg)](https://codeclimate.com/github/mmornati/ghost-cloudinary-store)


**IMPORTANT**: You **MUST** be running Ghost 1.0.0 or later.

**PLEASE** create an issue if you have any problems.

Cloudinary has some "advanced configuration options" for Pro users and etc.. that this module does not currently handle. If you would like support for these options added, please create an issue or submit a PR!

# To Use

[![Greenkeeper badge](https://badges.greenkeeper.io/mmornati/ghost-cloudinary-store.svg)](https://greenkeeper.io/)


## NPM Installation Method

*In Ghost's root directory*

1. Run `npm install cloudinary-store` (note the lack of `--save`)

2. Make the storage folder if it doesn't already exist `mkdir versions/$GHOST_VERSION/core/server/adapters/storage/`

3. Copy `cloudinary-store` from `node_modules` to `versions/$GHOST_VERSION/core/server/adapters/storage`
  ```
  cp -r node_modules/cloudinary-store content/storage
  ```

4. Follow the instructions below for [editing config.js][1]


## Git Installation Method

Note: The `master` branch reflects what is published on NPM

1. Navigate to Ghost's base folder and create a directory called `versions/$GHOST_VERSION/core/server/adapters/storage`

2. Navigate into this new `storage` directory and run `git clone https://github.com/mmornati/ghost-cloudinary-store.git cloudinary-store`

3. Navigate into `cloudinary-store` and run `npm install`

4. Follow the instructions below for [editing config.js][1]


## Editing config.production.json

You have two options for configuring Ghost to work with your Cloudinary account:

1. By using your Cloudinary credentials: `cloud_name`, `api_key`, and `api_secret`.
2. By setting a `CLOUDINARY_URL` environment variable.


#### With Cloudinary credentials

In Ghost's `config.production.json` (the file where you set your URL, mail settings, etc..) as follows:

Note: These values can be obtained from your Cloudinary management console.

```json
"storage": {
    "active": "ghost-cloudinary-store",
    "ghost-cloudinary-store": {
        "cloud_name": "yourCloudName",
        "api_key": "yourApiKey",
        "api_secret": "yourApiSecret"
    }
}
```

Further reading available [here][2].


#### With a `CLOUDINARY_URL` environment variable

In Ghost's `config.production.json` (the file where you set your URL, mail settings, etc..) as follows:

```json
"storage": {
    "active": "cloudinary-store"
}
```

Then set the `CLOUDINARY_URL` environment variable, available from your Cloudinary management console.
It will look something like `CLOUDINARY_URL=cloudinary://874837483274837:a676b67565c6767a6767d6767f676fe1@sample`.
Further reading available [here][2].
If you don't know what an environment variable is, [read this][3].

## Using Cloudinary API

You can find the documentation of what you can configure, directly on the Cloudinary website: http://cloudinary.com/documentation/image_transformations

```json
"storage": {
    "active": "cloudinary-store",
    "cloudinary-store": {
        "cloud_name": "yourCloudName",
        "api_key": "yourApiKey",
        "api_secret": "yourApiSecret",
        "configuration": {
            "image": {
                "quality": "auto:good",
                "secure": "true"
            },
            "file": {
                "use_filename": "true", 
                "unique_filename": "false", 
                "phash": "true", 
                "overwrite": "false", 
                "invalidate": "true"
            }       
         }
    }
}
```
**NOTE:** The **cloud_name**, **api_key** and **api_secret** environment variables are not needed if you use the **CLOUDINARY_URL** environment variable.

The **file** part into the configuration json is used to define the filename to use. By default, without any configuration, cloudinary will select a random name for the uploaded image.
This can't allow you to block the same image to be uploaded plenty of times. Anytime you will upload the image it gets a new name.
Configuring this part you can, for example, force Cloudinary to use the name you are providing (it is up to you to be sure about the unicity of the name).

You can find more information about and the list of possible parameters directly on the official Cloudinary documentation: http://cloudinary.com/documentation/image_upload_api_reference#upload


[1]: #editing-configjs
[2]: http://cloudinary.com/documentation/node_additional_topics#configuration_options
[3]: https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps
