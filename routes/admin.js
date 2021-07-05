const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const { isUser } = require('../helpers/isUser')

const warningNameTask = "O nome da tarefa deve conter no mínimo 5 caractere e máximo 30."

//model tarefa
require("../models/Tasks")
const Task = mongoose.model("task")

//Listar tarefas
router.get('/', (req, res) => {
   res.render('login')
})

router.get('/tasks', isUser, (req, res) => {
   Task.find()
   .lean()
   .sort({status: 'asc'})
   .sort({taskName: 'asc'})
   .then((tasks) => {
      res.render("tasks", { tasks })
   }).catch((err) => {
      req.flash("errorMsg", "Houve um erro ao listar as tarefas!")
   })
})

router.get('/task/add', isUser, (req, res) => {
   res.render("addtask")
})
//Adicionar nova tarefa
router.post('/task/new', isUser, (req, res) => {
   const erros = []
   const { taskName, description } = req.body

   if(!taskName || typeof taskName == undefined || taskName == null){
      erros.push({
         texto: "Nome inválido! Insira um nome para a tarefa."
      })
   }else if(taskName.length < 5 || taskName.length > 30) {
      erros.push({
         texto: warningNameTask
      })
   }

   if(erros.length > 0){
      res.render("addtask", {erros})
   }else{ 
      const novaTask = { 
         taskName,
         description,
         status: false
      }
   
      new Task(novaTask)
      .save()
      .then(() => {
         req.flash("successMsg", "Tarefa criada com sucesso!")
         res.redirect("/tasks")
      }).catch((err) => {
         req.flash("errorMsg", "Houve um erro ao salvar a tarefa, tente novamente!")
      })
   }
})


//Editar tarefa
router.get("/task/edit/:id", isUser, (req, res) => {
   Task.findOne({ _id: req.params.id })
   .lean()
   .then((task) => {
      res.render("edittask", { task })
   }).catch((err) => {
      req.flash("errorMsg", "Essa tarefa não existe!")
      res.redirect("/tasks")
   })
})

router.post("/task/edit", isUser, (req, res) => {
   const { taskName, status, description, id } = req.body

   Task.findOne({ _id: id })
   .then((task) => {

      task.taskName = taskName
      task.description = description
      task.status = status

      if(taskName.length < 5 || taskName.length > 30){
         req.flash("errorMsg", warningNameTask)
         res.redirect(`/task/edit/${id}`)
      }else{
         task.save().then(() => {
            req.flash("successMsg", "Tarefa editada com sucesso!")
            res.redirect("/tasks")
         }).catch((err) => {
            req.flash("errorMsg", "Erro ao editar tarefa!")
            res.redirect(`/task/edit/${id}`)
         })
      }
      }).catch((err) => {
         req.flash("errorMsg", "Houve um erro ao editar a tarefa.")
         res.redirect(`/task/edit/${id}`)
      })
})

//Deletar tarefa
router.post("/task/delete", isUser, (req, res) => {
   Task.deleteOne({ _id: req.body.id })
   .then(() => {
      req.flash("successMsg", "Tarefa deletada com sucesso!")
      res.redirect("/tasks")
   }).catch((err) => {
      req.flash("errorMsg", "Erro ao deletar tarefa.")
      res.redirect("/tasks")
   })
})

//Concluir tarefa
router.post("/task/concluded", isUser, (req, res) => {
   Task.findOne({ _id: req.body.id })
   .then((task) => {
      task.status = true

      task.save().then(() => {
         req.flash("successMsg", "Tarefa finalizada com sucesso!")
         res.redirect("/tasks")
      }).catch((err) => {
         req.flash("errorMsg", "Erro ao finalizar tarefa!")
         res.redirect("/tasks")
      })

   }).catch((err) => {
      req.flash("errorMsg", "Erro ao finalizar tarefa!")
      res.redirect("/tasks")
   })
})

module.exports = router