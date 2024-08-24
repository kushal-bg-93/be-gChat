
const query={

    findOne:async(collection,data={},project={})=>{
        try {
            const model=require(`../../models/schemas/${collection}`)
            const result=await model.findOne(data,project)
            return result;
            
        } catch (error) {
            console.log(error.message)
        }
    },
    find:async(collection,data={},project={})=>{
        try {
            
            const model=require(`../../models/schemas/${collection}`)
            const result=await model.find(data,project)
            return result;
        } catch (error) {
            console.log(error.message)
        }
    },
    insertOne:async(collection,insertData)=>{
        try {
            
            const model=require(`../../models/schemas/${collection}`)
            const data=new model(insertData)
            await data.save();
            return data
        } catch (error) {
            console.log(error.message)
        }
    },
    pagination:async(collection,query,sort,limit,pageNo,project={})=>{
        let skip=(pageNo-1)*limit
        const model=require(`../../models/schemas/${collection}`)

        let pipeline =[
            {
                $match:query
            },
            {
                $sort:sort
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
        ]

        if(Object.keys(project).length) pipeline.push({$project:project})

        const results=await model.aggregate(pipeline)

        const totalDocs=await model.countDocuments(query)

        return {result:results,pageData:{total:totalDocs,pageSize:limit,skip:skip}}
    },
    updateOne:async(collection,query,setData)=>{
        try {
            const model=require(`../schemas/${collection}`)
            const updateData=await model.updateOne(query,{$set:setData})

            return updateData
        } catch (error) {
            console.log(error)
        }
    },
    search:async(collection,searchField,searchTerm,project={},searchQuery={})=>{
        try {
            let projection={...project}
            projection[searchField]=1
            let model=require(`../schemas/${collection}`)
            let query={}
            query[searchField]={$regex:searchTerm,$options:'i'}
            let searchResults=await model.find(query,projection)
            return searchResults
        } catch (error) {
            console.log(error)
            
        }
    },
    pushOne:async(collection,query,updateData)=>{
        try {
            console.log("Thi is updatedata",updateData)
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.updateOne(query,{$push:updateData})
            return updateDocument;
        } catch (error) {
            console.log(error)
            
        }
        
    },

    pullOne:async(collection,query,updateData)=>{
        try {
            console.log("Thi is updatedata",updateData)
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.updateOne(query,{$pull:updateData})
            return updateDocument;
        } catch (error) {
            console.log(error)
            
        }
        
    },

    findOneUpdate:async(collection,query,updateData)=>{
        try {
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.findOneAndUpdate(query,{$set:updateData},{new:true})
            return updateDocument;
        } catch (error) {
            console.log(error.message)
        }
    },


    findOneUpdateIncrement:async(collection,query,updateData)=>{
        try {
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.findOneAndUpdate(query,{$inc:updateData},{new:true})
            return updateDocument;
        } catch (error) {
            console.log(error.message)
        }
    },

    findOneUpdatePush:async(collection,query,updateData)=>{
        try {
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.findOneAndUpdate(query,{$push:updateData},{new:true})
            return updateDocument;
        } catch (error) {
            console.log(error.message)
        }
    },

    findOneUpdatePull:async(collection,query,updateData)=>{
        try {
            const model=require(`../schemas/${collection}`)
            const updateDocument=await model.findOneAndUpdate(query,{$pull:updateData},{new:true})
            return updateDocument;
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports=query