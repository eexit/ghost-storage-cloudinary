var Promise = require('bluebird'),
    cloudinary = require('cloudinary');

// TODO: Add support for private_cdn
// TODO: Add support for secure_distribution
// TODO: Add support for cname
// TODO: Add support for secure
// TODO: Add support for cdn_subdomain
// TODO: Add support for CLOUDINARY_URL
// http://cloudinary.com/documentation/node_additional_topics#configuration_options

function store(config) {
    cloudinary.config(config);
}

store.prototype.save = function(image) {
    return new Promise(function(resolve) {
        cloudinary.uploader.upload(image.path, function(result) {
            resolve(result.url);
        });
    });
};

store.prototype.serve = function() {
    return function (req, res, next) {
        next();
    };
};

module.exports = store;
