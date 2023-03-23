"use strict";

const express = require('express');
const jasonData = require('./Movie Data/data.json');
const app = express();
const port = 3000;

app.get("/",firstfunction);
app.get("/favorite",welcomingFun);

function firstfunction(req,res){
  let result1 =[];
    
  let newJsonData=new JasonCon(jasonData.title,jasonData.poster_path,jasonData.overview)
  result1.push(newJsonData);

  res.json(result1);
}

function welcomingFun(req,res){
  res.send("welcome to favorite page");
}

function JasonCon(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
}

app.use((req,res)=>{
  res.status(404).send("sorry, somthing went wrong !");
})

app.use((err,req,res)=>{
  res.status(500).send("somthing broke!");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

