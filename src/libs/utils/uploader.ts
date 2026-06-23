import path from 'path'; // Node's path module, used to get file extensions
import multer from 'multer'; // middleware for handling multipart/form-data (file uploads)
import {v4} from 'uuid'; // generates random unique ids for file names

/** MULTER IMAGE UPLOADER **/
// builds a multer disk-storage config that saves files into ./uploads/<address>
// and renames each file to a random UUID (keeps the original extension) to avoid name clashes
function getTargetImageStorage(address: any) { // address = subfolder name, e.g. "members" or "products"
  return multer.diskStorage({ // configure where & how multer saves files on disk
    destination: function (req, file, cb) { // called once per uploaded file to pick the folder
      cb(null, `./uploads/${address}`); // null = no error, save into ./uploads/<address>
    },
    filename: function (req, file, cb) { // called once per uploaded file to pick the filename
      const extension = path.parse(file.originalname).ext; // keep the original file extension (.png, .jpg, etc.)
      const random_name = v4() + extension; // random UUID + extension avoids name collisions
      cb(null, random_name); // null = no error, use this generated name
    },
  });
}

// factory: makeUploader('products') -> a multer instance that saves to ./uploads/products, etc.
const makeUploader = (address: string) => { // address = which subfolder this uploader writes to
  const storage = getTargetImageStorage(address); // build the disk-storage config for that folder
  return multer({ storage: storage }); // return a ready-to-use multer middleware instance
};

export default makeUploader; // exported so routers can do makeUploader('x').single('image')

/* const product_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products');
  },
  filename: function (req, file, cb) {
    console.log(file);
    const extension = path.parse(file.originalname).ext;
    const random_name = v4() + extension;
    cb(null, random_name);
  },
})


export const uploadProductImage = multer({ storage: product_storage }); */
