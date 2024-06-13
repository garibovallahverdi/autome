import   {promises as fs} from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import express from 'express'
import Jimp from 'jimp';

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

    uploadFile(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Dosya yükleme hatası' });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next()
    
    });
}
 
export const resizeFiles = async (files)=>{
  let logoPath = path.join('upload/logo','logo.png')
  let outputFiles =[]
for(const file of files){
    let inputFilePath = path.join('upload/images',file)
    let outImage = 'processed-'+file
    const outFile = path.join('upload/images',outImage)

    const image = await Jimp.read(inputFilePath);
    const watermark = await Jimp.read(logoPath);
    image.resize(300,300, Jimp.AUTO);
    image.contain(300,300);
    image.composite(watermark, image.bitmap.width - watermark.bitmap.width, image.bitmap.height - watermark.bitmap.height, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5
    });
    await image.writeAsync(outFile);
    await fs.unlink(inputFilePath);

    outputFiles.push(outImage)
     } 
     return outputFiles

}

export const fileDelete =  (files)=>{
  let path ='upload/images/'
  if(Array.isArray(files)){
 
    files.forEach(file=>{
      
      let dirName = path+file
 
      fs.unlink(dirName,(err)=>{
         if(err){
             console.log(err);
             return err
         }
         console.log("File has deleted..");
     })
 })
  }else {
    let dirName = path+files
    fss.unlink(dirName,(err)=>{
      if(err){
          console.log(err);
          return err
      }
      console.log("File has deleted..");
  })
  }

}
