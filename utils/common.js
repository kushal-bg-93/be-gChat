const cryptoJs=require('crypto-js')

const common={
    encryptData:async(data)=>{
        return await cryptoJs.AES.encrypt(data,process.env.CRYPTO_SECRET).toString()
    },
    decryptData:async(data)=>{
        const byte=await cryptoJs.AES.decrypt(data,process.env.CRYPTO_SECRET)
        return await byte.toString(cryptoJs.enc.Utf8)
    }
}

module.exports=common;