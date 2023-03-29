"use strict";

// to kill a port => sudo kill -9 $(sudo lsof -t -i:portnumber)
const express = require('express');
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
app.get("/getMovies",moviesData);
app.put("/updateMpvies/:id",updateHandler);
app.delete("/deleteMovies/:id",movieDeleted);
app.get("/getMovies/:id",getData);



//functions
function SayHi(req,res){
console.log("response resived")
}

function sqlMovies(req,res){
    //console.log("hi");
    let {movieName,overView}= req.body;
    let values = [movieName,overView];
    let sql = `INSERT INTO movies (movieName, overView)
    VALUES ($1,$2) RETURNING *; `
    client.query(sql,values).then(
        res.status(201).send("Data recived to the server")   
    ).catch();
}

function moviesData(req,res){
    let sql = `SELECT * FROM movies; `
    client.query(sql).then((result)=>{
        res.json(result.rows);
    }
    ).catch();
}

function updateHandler(req,res){
    let ID = req.params.id;
    let {movieName,overView}=req.body
    let values = [movieName,overView,ID];
    let sql = `UPDATE movies SET movieName = $1, overView = $2 WHERE ID = $3 ; `;
    client.query(sql,values).then((result)=>{
        res.json("DONE");
    }
    ).catch();

}

function movieDeleted(req,res){
    let ID=req.params.id;
    let sql = `DELETE FROM movies WHERE ID= $1; `;
    let values = [ID];
    client.query(sql,values).then((result)=>{
        res.status(204).send("DONE");
    }
    ).catch();

}

function getData(req,res){
    let ID = req.params.id;
    let values = [ID];
    let sql = `SELECT * FROM movies WHERE ID = $1; `;
    client.query(sql,values).then((result)=>{
        if(result.rows.length===0){
            res.send("this movie dose not exist");
        }else{
            res.json(result.rows);
        }
    }).catch();

}


// error handeler 
app.use((req,res)=>{
    res.status(404).send("sorry, somthing went wrong !");
})

app.use(errorHandeler);

function errorHandeler(req,res,err){
    res.status(500).send(err);
}

client.connect().then(()=>{
    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`);
    })
}).catch();