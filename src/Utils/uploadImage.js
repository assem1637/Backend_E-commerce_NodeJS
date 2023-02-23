import multer from 'multer';






const coreUpload = () => {

    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {

        if (file.mimetype.startsWith("image")) {

            cb(null, true);

        } else {

            cb({ message: "Upload Image Only" }, false);

        };

    };

    const upload = multer({ storage, fileFilter });


    return upload;

};






// Upload Single Image

export const uploadSingleImage = (path) => {

    return coreUpload().single(path);

};




// Upload Fields Image

export const uploadFieldsImage = (path) => {

    return coreUpload().fields(path);

};