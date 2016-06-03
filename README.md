**IMPORTANT**: You **MUST** be running Ghost 0.6.0 or later. Previous versions of Ghost do not support external storage solutions.

**PLEASE** create an issue if you have any problems.

Cloudinary has some "advanced configuration options" for Pro users and etc.. that this module does not currently handle. If you would like support for these options added, please create an issue or submit a PR!

# To Use


## NPM Installation Method

*In Ghost's root directory*

1. Run `npm install ghost-cloudinary-store` (note the lack of `--save`)

2. Make the storage folder if it doesn't already exist `mkdir content/storage`

3. Copy `ghost-cloudinary-store` from `node_modules` to `content/storage`
  ```
  cp -r node_modules/ghost-cloudinary-store content/storage/ghost-cloudinary-store
  ```

4. Follow the instructions below for [editing config.js][1]


## Git Installation Method

Note: The `master` branch reflects what is published on NPM

1. Navigate to Ghost's `content` directory and create a directory called `storage`

2. Navigate into this new `storage` directory and run `git clone https://github.com/sethbrasile/ghost-cloudinary-store.git`

3. Navigate into `ghost-cloudinary-store` and run `npm install`

4. Follow the instructions below for [editing config.js][1]


## Editing config.js

You have two options for configuring Ghost to work with your Cloudinary account:

1. By using your Cloudinary credentials: `cloud_name`, `api_key`, and `api_secret`.
2. By setting a `CLOUDINARY_URL` environment variable.


#### With Cloudinary credentials

In Ghost's `config.js` (the file where you set your URL, mail settings, etc..) add a block to whichever environment you're using (`production`, `development`, etc...) as follows:

Note: These values can be obtained from your Cloudinary management console.

```javascript
storage: {
    active: 'ghost-cloudinary-store',
    'ghost-cloudinary-store': {
        cloud_name: 'yourCloudName',
        api_key: 'yourApiKey',
        api_secret: 'yourApiSecret'
    }
}
```

Further reading available [here][2].


#### With a `CLOUDINARY_URL` environment variable

**NOTE:** I haven't personally gotten this option to work, but it **should** according to Cloudinary's documentation.
Maybe stick with the credentials option above. If you make this option work, please let me know [here][4].

In Ghost's `config.js` (the file where you set your URL, mail settings, etc..) add a block to whichever environment you're using (`production`, `development`, etc...) as follows:

```javascript
storage: {
    active: 'ghost-cloudinary-store'
}
```

Then set the `CLOUDINARY_URL` environment variable, available from your Cloudinary management console.

It will look something like `CLOUDINARY_URL=cloudinary://874837483274837:a676b67565c6767a6767d6767f676fe1@sample`.

Further reading available [here][2].

If you don't know what an environment variable is, [read this][3].


## Using HTTPS Cloudinary URLs

If you set `secure` to `true` in `config.js`, your blog will use secure (https) URLs.

```javascript
storage: {
    active: 'ghost-cloudinary-store',
    'ghost-cloudinary-store': {
      secure: true
    }
}
```

[1]: #editing-configjs
[2]: http://cloudinary.com/documentation/node_additional_topics#configuration_options
[3]: https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps
[4]: https://github.com/sethbrasile/ghost-cloudinary-store/issues/1
