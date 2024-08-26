const {createGroup,sendMessage}=require('../controller/user/group')
const Group = require('../models/schemas/Group')
const Message=require('../models/schemas/Message')

jest.mock('../models/schemas/Message', () => ({
    create: jest.fn(),
  }));

describe('Group Tests',()=>{
    let req,res
    beforeEach(()=>{
        req={body:{}}
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })
    
    afterEach(()=>{
        jest.clearAllMocks()
    })
    
    it('should test to create group',async()=>{
        req={
            body:{
                name:"dummy group",
                users:[
                    "66c8a81b40b1efa9a4645de3",
                    "66c8dfcef091fa1b56a22d29"
                ]
            },
            userData:{
                _id:"66c8dfd6f091fa1b56a22d2c"
            }
        }
        
        Group.prototype.save=jest.fn().mockResolvedValue()
        
        await createGroup(req,res)
        
        const data=res.json.mock.calls[0][0]
        console.log('this is data >>',data)
        
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(data)
        expect(data.result.data).toHaveProperty('users')
        expect(data.result.data.users).toHaveLength(3)
    })
    
    it('should throw error if user try to send message to the group he doesnt belong',async()=>{

        jest.mock('../models/schemas/Group')

        req={
            body:{
                groupId:"66c8a88840b1efa9a4645de9",
                content:"sample test message"
            },
            userData:{
                _id:"dummyId"
            }
        }

        Group.findOne=jest.fn().mockResolvedValue(null)

        await sendMessage(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const error=res.json.mock.calls[0][0]
        expect(error).toHaveProperty('error')
    })

    it('should send message to the user',async()=>{
        jest.clearAllMocks()
        const Group1=require('../models/schemas/Group')
        jest.mock('../models/schemas/Group')

        req={
            body:{
                groupId:"66c8a88840b1efa9a4645de9",
                content:"sample test message"
            },
            userData:{
                _id:"66c8a80c40b1efa9a4645de0"
            }
        }

        Group1.findOne.mockResolvedValue({_id:"66c8a88840b1efa9a4645de9"})

        const insertMsgMock = {
            populate: jest.fn().mockResolvedValue({
                "_id" : "66c9dfd7e8a83d497c114e25",
                "content" : "This is the third test message by second user.. this is to test ",
                "senderId" : "66c8a73740b1efa9a4645ddd",
                "groupId" : "66c8a88840b1efa9a4645de9",
                "likeCount" : 0
            }),
          };
      
          Message.create.mockResolvedValue(insertMsgMock);

          Group1.updateOne=jest.fn().mockResolvedValue({acknowledge:true})

          await sendMessage(req,res)
          expect(res.status).toHaveBeenCalledWith(200)
    })
})