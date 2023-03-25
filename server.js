"use strict";

const express = require('express');
const axios = require("axios");
require('dotenv').config()
const cors = require("cors")
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const port = process.env.port;
//node-postgres
let url = process.env.url;
const { Client } = require('pg')
const client = new Client(url)


// routes 
app.post("/",sqlMovies);
app.get("/getMovies",moviesData)


//functions
function sqlMovies(err,req,res){
    //console.log(req.body);
    let sql = `INSERT INTO movies (movieName, overView)
    VALUES ($1,$2); `
    let {movieName,overView}= req.body;
    let values = [movieName,overView];
    client.query(sql,values).then(
        res.status(201).send("Data recived to the server")   
    ).catch(errorHandeler(err));
}

function moviesData(err,req,res){
    let sql = `SELECT * FROM movies; `
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }
    ).catch(errorHandeler(err));
}


// error handeler 
app.use((req,res)=>{
    res.status(404).send("sorry, somthing went wrong !");
})
  
app.use(errorHandeler);
  
function errorHandeler(err,req,res){
    res.status(500).send(err);
}

client.connect().then(()=>{
    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`);
    })
}).catch();