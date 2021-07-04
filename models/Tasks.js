const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Task = new Schema({
   taskName: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now()
   },
   concludedDate: {
      type: Date,
      default: Date.now()
   },
   status: {
      type: Boolean
   }
})

mongoose.model("task", Task)