const mongoose = require('mongoose');
const {Schema} = mongoose

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linked list','tree','graph','dp','math','string'],
        required:true,
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                require:true,
            },
            output:{
                type:String,
                require:true,
            },
            explanation:{
                type:String,
                required:true,
            },
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                require:true,
            },
            output:{
                type:String,
                require:true,
            },
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                require:true,
            },
            initialCode:{
                type:String,
                require:true,
            }
        }
    ],
    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }   
})

const Problem = mongoose.model('problem',problemSchema)
module.exports = Problem