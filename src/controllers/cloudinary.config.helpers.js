const cloudinary = require('cloudinary').v2;

    cloudinary.config({ 
        cloud_name: 'dpy5kwico', 
        api_key: '936983747678275', 
        api_secret: '${process.env.CLOUDINARY_URL}',
    });

    module.exports = cloudinary;

