# Plugins

## RetinaJS

This plugins allows to "auto-retinize" an uploaded image using Cloudinary for [RetinaJS](http://imulus.github.io/retinajs/) support.

If your Ghost theme displays post/page images with a predefined width of `600px` and you upload an image of `1800px` width, the plugin will automatically generate the RetinaJS image variants of your image:

- `image.jpg`
- `image@2x.jpg`
- `image@3x.jpg`

If you wish to integrate RetinaJS on your Ghost blog, [read this blog article](http://blog.eexit.net/ghost-retinajs-integration/).

### Features

- Uses the parent [upload and fetch Cloudinary options](https://github.com/eexit/ghost-storage-cloudinary#configuration)
- Could generate up to Retina 5K (`@5x`) image variants (Cloudinary limitation)
- Only generate available variants off the image (no scale up)
- Appends a tag to each created image variant (e.g., `dpr2` for `@2x` variant)
- *Fire&Forget* support
- Excellent [test coverage](https://codeclimate.com/github/eexit/ghost-storage-cloudinary) (100% as I write this)

### Caveat

It will generate Retina image variants for all images, including banners, author profile images and so on. Unfortunately, Ghost does not provide a contextualized storage adapter instance so for now, it's not possible to tell the adapter [the purpose of the image](https://forum.ghost.org/t/storage-adapter-context/1693).

### Configuration

Make sure to disable [Ghost optimization feature](https://ghost.org/docs/concepts/config/#image-optimisation).

In order to **activate** and configure the plugin, you need to add the `rjs` property in the [storage configuration](../configuration.sample.json):

```json
{
    "storage": {
        "active": "ghost-storage-cloudinary",
        "ghost-storage-cloudinary": {
            "auth": {
                "cloud_name": "",
                "api_key": "",
                "api_secret": ""
            },
            "upload": {
                "use_filename": true
            },
            "fetch": {},
            "rjs": {
                "baseWidth": 960,
                "fireForget": true
            }
        }
    }
}
```

:warning: The `upload`.`use_filename` option must be enabled as the plugin generates the variants *before* they are uploaded and thus cannot rely on a Cloudinary generated public ID.

#### Property `baseWidth`

- Required
- Is an `integer` or parseable number
- Value must be `>=1`

It should match the blog post/page image predefined width of your theme: if your theme displays images with a width of `800px`, this property value must be `800`.
The plugin will compute the available variants for your image off this number.

#### Property `fireForget`

- Optional, defaulted to `false`
- Should be [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) or [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

When truthy, the plugin will upload the first variant and return its URL while it will continue to create the subsequent variants in the background. This is useful when the RetinaJS is a *nice-to-have* asset to your blog.

**Gotchas:**

- If the first variant creation fails, an error will be returned and other variants will be discarded
- Each subsequent variant creation process is isolated and asynchronous
- When a subsequent variant creation error occurs, the error is logged then discarded
- It won't be *much faster* since the plugin won't upload the image for every variants: it reuses the first variant URL to generate subsequent variants

When falsy (default behavior), the plugin will wait for all variants to be successfully created to return the image URL.
