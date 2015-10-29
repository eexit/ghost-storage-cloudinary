**IMPORTANT**: You **MUST** be running Ghost 0.6.0 or later. Previous versions of Ghost do not support external storage solutions.

**PLEASE** create an issue if you have any problems.

Fancy stuff** is not currently supported

<span style="font-size: 0.6em;">
**Cloudinary has some "advanced configuration options" for Pro users and etc.. that this module does not currently handle.

# To Use

## NPM Installation Method

1. Run `npm install ghost-cloudinary-store --save`

2. Create file `content/storage/ghost-cloudinary-store/index.js`

3. Put `module.exports = require('ghost-cloudinary-store');` into this file

4. Follow the instructions below for [editing config.js][1]


## Git Installation Method

Note: The `master` branch reflects what is published on NPM

1. Navigate to Ghost's `content` directory and create a directory called `storage`

2. Navigate into this new `storage` directory and run `git clone https://github.com/sethbrasile/ghost-cloudinary-store.git`

3. Navigate into `ghost-cloudinary-store` and run `npm install`

4. Follow the instructions below for [editing config.js][1]

## Editing config.js

In Ghost's `config.js` (the file where you set your URL, mail settings, etc..) add a block to whichever environment you're using (`production`, `development`, etc...) as follows:

<span style="font-size: 0.6em;">
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

Here's a full example:

```javascript
development: {
    url: 'http://localhost:2368',
    storage: {
        active: 'ghost-cloudinary-store',
        'ghost-cloudinary-store': {
            cloud_name: 'xxxxxxx',
            api_key: 'xxxxxxx',
            api_secret: 'xxxxxxxx'
        }
    },
    database: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '/content/data/ghost-dev.db')
        },
        debug: false
    },
    server: {
        // Host to be passed to node's `net.Server#listen()`
        host: '127.0.0.1',
        // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
        port: '2368'
    },
    paths: {
        contentPath: path.join(__dirname, '/content/')
    }
},
```

[1]: #editing-configjs
