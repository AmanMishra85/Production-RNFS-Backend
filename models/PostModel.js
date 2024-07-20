import mongoose from "mongoose";

//schema

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'please add post title'],
    },
    description:{
        type:String,
        required:[true,'please Add post description']
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

const PostModel = mongoose.model('post',PostSchema);

export default PostModel;