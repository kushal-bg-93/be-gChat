const jwt=require('jsonwebtoken')
const validateAdminJwtToken=require('../middlewares/auth/validateAdminJwtToken')
const Admin=require('../models/schemas/Admin')
const User=require('../models/schemas/User')
const {login}=require('../controller/auth/auth')
const cryptoJs=require('crypto-js')

jest.mock('jsonwebtoken')
jest.mock('crypto-js')
jest.mock('../models/schemas/Admin')
jest.mock('../models/schemas/User')

describe("Auth tests",()=>{
    let req,res,next
    describe("Admin token check middleware tests",()=>{

        beforeEach(() => {
            req = { body: {} };
            res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };
          });

          afterEach(() => {
            res.status.mockClear();
            jest.clearAllMocks();
          });

        it("should throw an error without authorization token",async()=>{            
            await validateAdminJwtToken(req,res,()=>{})
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "token required", devInfo: "© Kushal API's" });
        })

        it("should throw and error if authorization token in not admin",async()=>{
            req={...req,
                headers:{
                    authorization:'mockToken'
                }
            }

            let mockDecoded={userData:{role:'user'}}

            jwt.verify.mockReturnValue(mockDecoded);

            await validateAdminJwtToken(req,res,()=>{})

            expect(res.status).toHaveBeenCalledWith(400)

            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","error": "Unauthorised Access"})
        })

        it("should throw an error if extracted admin is not there in the DB",async()=>{

            req={...req,
                headers:{
                    authorization:'mockToken'
                }
            }

            let mockDecoded={userData:{role:'admin',email:"dummy@test.com"}}

            let mockUser=null

            jwt.verify.mockReturnValue(mockDecoded);

            Admin.findOne.mockResolvedValue(mockUser)

            await validateAdminJwtToken(req,res,()=>{})

            expect(Admin.findOne).toHaveBeenCalledWith({"email": "dummy@test.com"}, {"email": 1, "role": 1});
            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's", "error": "User not found"})
            expect(res.status).toHaveBeenCalledWith(400)
        })

        it("should allow the user if correct token is given",async()=>{
            next=jest.fn()

            req={...req,
                headers:{
                    authorization:'mockToken'
                }
            }

            let mockDecoded={userData:{role:'admin',email:"dummy@test.com"}}

            let mockUser={_id:"66c50c0590393373a050484e",email:mockDecoded?.userData?.email,role:mockDecoded?.userData?.role}

            jwt.verify.mockReturnValue(mockDecoded);

            Admin.findOne.mockResolvedValue(mockUser)

            await validateAdminJwtToken(req,res,next)

            expect(req).toHaveProperty('adminData')
            expect(next).toHaveBeenCalled()

        })


    })

    describe("Auth controller tests",()=>{
        beforeEach(() => {
            req = { body: {} };
            res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };
          });

          afterEach(() => {
            res.status.mockClear();
          });

        it("should throw an error if no admin is found",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"admin"
                }
            }
            const mockAdmin=null

            Admin.findOne.mockResolvedValue(mockAdmin)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","error": "User not found"})

        })

        it("should throw error for invalid password",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"admin"
                }
            }
            const mockAdmin={
                email:"dummy@email.com",
                password:"dummypassword3",
                role:"admin",
                name:"dummy",
                _id:"66c50c0590393373a050484e"
            }

            Admin.findOne.mockResolvedValue(mockAdmin)
            cryptoJs.AES.decrypt.mockResolvedValue(mockAdmin?.password)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","error": "Invalid credentials"})
        })

        it("should allow the user to login by generating token",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"admin"
                }
            }
            const mockAdmin={
                email:"dummy@email.com",
                password:"dummypassword",
                role:"admin",
                name:"dummy",
                _id:"66c50c0590393373a050484e"
            }

            Admin.findOne.mockResolvedValue(mockAdmin)
            cryptoJs.AES.decrypt.mockResolvedValue(mockAdmin?.password)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(200)
        })



        it("should throw an error if no user is found",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"user"
                }
            }
            const mockUser=null

            User.findOne.mockResolvedValue(mockUser)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","error": "User not found"})

        })

        it("should throw error for invalid password for user",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"user"
                }
            }
            const mockUser={
                email:"dummy@email.com",
                password:"dummypassword3",
                name:"dummy",
                _id:"66c50c0590393373a050484e"
            }

            User.findOne.mockResolvedValue(mockUser)
            cryptoJs.AES.decrypt.mockResolvedValue(mockUser?.password)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","error": "Invalid credentials"})
        })

        it("should allow the user to login by generating token",async()=>{
            req={
                body:{
                    email:"dummy@email.com",
                    password:"dummypassword",
                    role:"user"
                }
            }
            const mockUser={
                email:"dummy@email.com",
                password:"dummypassword",
                name:"dummy",
                _id:"66c50c0590393373a050484e"
            }

            User.findOne.mockResolvedValue(mockUser)
            cryptoJs.AES.decrypt.mockResolvedValue(mockUser?.password)

            await login(req,res)

            expect(res.status).toHaveBeenCalledWith(200)
        })
    })
})