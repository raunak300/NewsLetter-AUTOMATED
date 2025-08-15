const express=require("express");
const Router=express.Router()

const {fillNews,sendNews,getanalysis}=require('../Controller/PostController.js')

Router.get('/fnews',fillNews)
Router.get('/news',sendNews);
Router.post('/analyze',getanalysis);


module.exports= Router;