const express=require("express");
const Router=express.Router()

const {fillNews,sendNews}=require('../Controller/PostController.js')

Router.get('/fnews',fillNews)
Router.get('/news',sendNews);


module.exports= Router;