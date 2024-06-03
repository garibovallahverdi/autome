import fs  from 'fs';
import multer from 'multer';
import path from 'path';

// const uploadDir = path.join(__dirname,'/public/blog/images')
const storage =  multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'upload/images')
    },
     val : 0,
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + "-"+Math.round(Math.random()*1E9)
        const fileExt = path.extname(file.originalname)
        cb(null,file.fieldname + "-" + uniqueSuffix + fileExt)
    }
})

const fileFilter = function(req,file,cb){
    const allowedFileTypesImages = ['image/jpeg','image/jpg','image/png'];
    if (allowedFileTypesImages.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Desteklenmeyen dosya türü'));
      }
}

const limits = {
    fileSize: 10 * 1024 * 1024 // 10 MB
  };
export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
  }).fields([
    {name:"lotImages"},
  ]);

 
  export  const fileUploadMiddleware=(req, res, next)=> {
    uploadFile(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Dosya yükleme hatası' });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}


  
export const fileDelete = (files)=>{
    files.forEach(file=>{
         let path ='upload/images/'
        let dirName = path+file
        fs.unlink(dirName,(err)=>{
            if(err){
               
                return err
            }
            console.log("File has deleted..");
        })
    })

}