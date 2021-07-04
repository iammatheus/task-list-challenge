const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const { isUser } = require('../helpers/isUser')

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
   .sort({date: 'desc'})
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
         texto: "Nome inválido!" //inserindo msg dentro do array erros.
      })
   }

   if(!description || typeof description == undefined || description == null){
      erros.push({
         texto: "Descrição inválida!"  //inserindo msg dentro do array erros.
      })
   }
   
   if(erros.length > 0){
      res.render("addtask", {erros}) //se existir algum erro, renderiza a página junto com a msg
   }else{ 
      const novaTask = { 
         taskName: req.body.taskName, //pegando os valores digitados
         description: req.body.description,
         status: false
        
      }
   
      new Task(novaTask) //se não existir erros, crie a tarefa.
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
   Task.findOne({ _id:req.params.id })
   .lean()
   .then((task) => {
      res.render("edittask", { task })
   }).catch((err) => {
      req.flash("errorMsg", "Essa tarefa não existe!")
      res.redirect("/tasks")
   })
})

router.post("/task/edit", isUser, (req, res) => {
   Task.findOne({ _id: req.body.id })
   .then((task) => {
      
      task.taskName = req.body.taskName
      task.description = req.body.description
      task.status = req.body.status

      task.save().then(() => {
         req.flash("successMsg", "Tarefa editada com sucesso!")
         res.redirect("/tasks")
      }).catch((err) => {
         req.flash("errorMsg", "Erro ao editar tarefa!")
         res.redirect("/task/edit")
      })
   }).catch((err) => {
      req.flash("errorMsg", "Houve um erro ao editar a tarefa.")
      res.redirect("/task/edit")
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
      task.concludedDate = Date.now()

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