const path=require('path')
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../public/"))  // Uploads directory
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  });

  const fileFilter = (req, file, cb) => {
    // Accept only text files and PDFs
    if (path.extname(file.originalname) == '.png' || path.extname(file.originalname) == '.jpg' || path.extname(file.originalname) == '.JPEG') {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter:fileFilter 
});

  module.exports=upload