const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Task = new Schema({
   taskName: {
      type: String,
      required: true
   },
   description: {
      type: String
   },
   status: {
      type: Boolean
   }
})

mongoose.model("task", Task)