const {searchUser,getMyGroups}=require('../controller/user/user')
const User=require('../models/schemas/User')
const Group=require('../models/schemas/Group')

jest.mock('../models/schemas/User')
jest.mock('../models/schemas/Group')

describe('User test',()=>{
    let req,res 
    beforeEach(()=>{
        req={
            body:{}
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('should search the given user',async()=>{
        req={
            query:{
                search:'du',
                page:1
            }
        }

        const mockUser=[{
            "_id" : "66c8dfd6f091fa1b56a22d2c",
            "name" : "dummy",
            "email" : "test5@test.com",
        }]

        User.aggregate=jest.fn().mockResolvedValue(mockUser)
        User.countDocuments=jest.fn().mockResolvedValue(10)

        await searchUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({"devInfo": "© Kushal API's","message": "Success","result":{"messages":"Success",result:{pageData:{"pageSize": 5,"skip": 0,total:10},result:[{"_id": "66c8dfd6f091fa1b56a22d2c","email": "test5@test.com","name": "dummy",}]}}})
    })

    it('should return the groups of the user',async()=>{
        req={
            userData:{
                _id:"66c8dfd6f091fa1b56a22d2c"
            }
        }

        const mockGroups = [
            {
              _id: 'group1',
              name: 'Group 1',
              latestMessage: {
                content: 'Hello',
                senderId: { name: 'User 1', email: 'user1@example.com', imageId: 'img123' },
              },
              adminId: 'admin1',
            },
          ];
      
          const findMock = jest.fn().mockReturnThis();
          const populateMock = jest.fn().mockReturnThis(); 
      
          // Mock the final .exec() method to resolve with the mock data
          Group.find = findMock;
          Group.find.mockImplementation(() => ({
            populate: populateMock,
            exec: jest.fn().mockResolvedValue(mockGroups),
          }));
      
          // Act
          await getMyGroups(req, res);

          expect(res.status).toHaveBeenCalledWith(200)
    })
})