const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customers");
  },

  filename:(req,file,cb)=>{
    const extension = path.extname(file.originalname);
    const filename =`customar_${Date.now()} ${extension}`;
    cb(null,filename);
  }

});
 const upload = multer({
    storage,
 })


 module.exports=upload;