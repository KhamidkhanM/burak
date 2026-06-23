import path from 'path';
import multer from 'multer';
import {v4} from 'uuid';

/** MULTER IMAGE UPLOADER **/
// builds a multer disk-storage config that saves files into ./uploads/<address>
// and renames each file to a random UUID (keeps the original extension) to avoid name clashes
function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./uploads/${address}`);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

// factory: makeUploader('products') -> a multer instance that saves to ./uploads/products, etc.
const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;

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