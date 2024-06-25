
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_ADRESS,
        pass: process.env.NODEMAILER_PASS
    }
});


export const confirmAccountEmail = async (email,token)=>{
    let verificationLink = `${process.env.BACKEND_URL}/auth/account-confirmed/${token}`

    const mailBody = `
    <p style="font-size:20px, font-weight:bold">Hesabinizi təsdiqləmək üçün butona klikləyin.</p>
    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
    Hesabımı Təsdiqlə</a>`
    const mailOptions = {
        from: process.env.NODEMAILER_ADRESS,
        to: email,
        subject: 'Email Verification',
        html: mailBody
    };
    try {
        const result = await transporter.sendMail(mailOptions);
        return {result:result,status:true}
    } catch (error) {
        return {error:error,status:false}
    }
}


export const resePasswordMail = async (email,token)=>{
    let verificationLink = `${process.env.BACKEND_URL}/auth/reset-password/${token}`

    const mailBody = ` 
    <p style="font-size:20px, font-weight:bold">Sifreni enilemek ucun linke gedin. </p>
    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
    Yenile</a>`
    const mailOptions = {
        from: process.env.NODEMAILER_ADRESS,
        to: email,
        subject: 'Reset Password',
        html: mailBody
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return {result:result,status:true}
    } catch (error) {
        return {error:error,status:false}
    }

}

export const salesAgreementEmail = async({user,saleAgreement,lot ,type})=>{
    let  salesAgreement = `http://localhost:9000/agreements/getsales-agreement/${user.id}/${saleAgreement.id}`
    let mailBody =''
    if(type == 'saler'){

        mailBody = `<p>${user.first_name} ${user.last_name} sahibi oldugunuz ${lot.lotNumber} nomreli ${lot.lotName} lot ${saleAgreement.endPrice} mebleginde sona ermisdir. Satisi tesdiqlemek ucun linke gedin</p>\n\n
        <a href="${salesAgreement}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
        Muqavileye baxin 
        </a>
        `
    }else {
        mailBody = `<p>${user.first_name} ${user.last_name} teklif verdiyiniz ${lot.lotNumber} nomreli ${lot.lotName} lot ${saleAgreement.endPrice} mebleginde sizin qalibliyinizle bitmisdir. Alisi tesdiqlemek ucun linke gedin</p>\n\n
        <a href="${salesAgreement}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
        Muqavileye baxin 
        </a>
        `
    }
      const mailOptions = {
         from: process.env.NODEMAILER_ADRESS,
         to: user.email,
         subject: 'Sales Agreement',
         html: mailBody
     }
     try {
         const result = await transporter.sendMail(mailOptions);
         console.log("Gonderildi");
         return true
     } catch (error) {
         console.log("Hata oldu");
         return false
     }
 }

export const sendEmailStartLotToLotBidders = async({lot,user})=>{
   let  verificationLink = `http://localhost:9000/lot/getlot-byid/${lot.id}`
     const mailBody = `<p>${user.first_name} ${user.last_name} qosuldugunuz ${lot.lotNumber} nomreli ${lot.lotName} lotu activ olmusdur</p>\n\n
     <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
      Posta gedin 
     </a>
     `
     const mailOptions = {
        from: process.env.NODEMAILER_ADRESS,
        to: user.email,
        subject: 'Reminder',
        html: mailBody
    }
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("Gonderildi");
        return true
    } catch (error) {
        console.log("Hata oldu");
        return false
    }
}