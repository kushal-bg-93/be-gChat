const User=require('../models/schemas/User')
const cryptoJs=require('crypto-js')
const {createUser,updateUser}=require('../controller/admin/user')

jest.mock('crypto-js')
jest.mock('../models/schemas/User')

describe("Admin controller tests",()=>{
    let req,res,next

    beforeEach(() => {
        User.mockClear();
        // User.prototype.save = jest.fn();
        req = { body: {} };
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it("should add user",async()=>{
        req={
            body:{
                name:"Dummy User",
                email:"dummy@test.com",
                password:"test123"
            }
        }
        
        User.prototype.save = jest.fn().mockResolvedValue();
        cryptoJs.AES.encrypt.mockResolvedValue("U2FsdGVkX19dFDtLf5Qg6jPmGf6D1A30Gw1a3hPOBOM=")
        // User.prototype.save = mockSave;

        await createUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        
      })

      it("should update the user",async()=>{
        req={
            body:{
                email:"dummy@test.com",
                name:"dummy",
                id:"66c8dfd6f091fa1b56a22d2c"
            }
        }

        const updatedUser={
            "_id" : "66c8dfd6f091fa1b56a22d2c",
            "name" : "dummy",
            "email" : "dummy@test.com",
            "password" : "U2FsdGVkX19dFDtLf5Qg6jPmGf6D1A30Gw1a3hPOBOM=",
            "imageId" : "https://png.pngitem.com/pimgs/s/35-350426_profile-icon-png-default-profile-picture-png-transparent.png",
            "adminId" : "66c50c0590393373a050484e",
            "verificationStatus" : true,
            "isDeleted" : 0
        }

        User.findOneAndUpdate=jest.fn().mockResolvedValue(updatedUser)

        await updateUser(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","result":{"data":{
            "_id" : "66c8dfd6f091fa1b56a22d2c",
            "name" : "dummy",
            "email" : "dummy@test.com",
            "password" : "U2FsdGVkX19dFDtLf5Qg6jPmGf6D1A30Gw1a3hPOBOM=",
            "imageId" : "https://png.pngitem.com/pimgs/s/35-350426_profile-icon-png-default-profile-picture-png-transparent.png",
            "adminId" : "66c50c0590393373a050484e",
            "verificationStatus" : true,
            "isDeleted" : 0
        },message:"Success"},message:"Success"})

      })

})