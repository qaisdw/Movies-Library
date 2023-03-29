"use strict";

const express = require('express');
const axios = require("axios");
require('dotenv').config()
const bodyParser = require('body-parser')
const app = express()
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.port;
//node-postgres
let url = process.env.url;
const { Client } = require('pg')
const client = new Client(url)


// routes 
app.get("/",SayHi);
app.post("/moviesSql",sqlMovies);
app.get("/getMovies",moviesData)


//functions
function SayHi(req,res){
console.log("response resived")
}

function sqlMovies(req,res,err){
    //console.log("hi");
    let sql = `INSERT INTO movies (movieName, overView)
    VALUES ($1,$2)  RETURNING *; `
    let {movieName,overView}= req.body;
    let values = [movieName,overView];
    client.query(sql,values).then(
        res.status(201).send("Data recived to the server")   
    ).catch(errorHandeler(err));
}

function moviesData(req,res,err){
    let sql = `SELECT * FROM movies; `
    client.query(sql).then((result)=>{
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