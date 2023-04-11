"use strict";

// to kill a port => sudo kill -9 $(sudo lsof -t -i:portnumber)
const express = require('express');
const cors = require("cors")
const corsOptions ={ 
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
    }
require('dotenv').config()
const axios = require("axios");
const bodyParser = require('body-parser')
const app = express()
app.use(cors(corsOptions))
// app.use(cors())
const Api_Key=process.env.api_key;
// parse application/json
app.use(bodyParser.json())
const jasonData = require('./Movie Data/data.json');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT;
//node-postgres
let url = process.env.url;
const { Client } = require('pg')
const client = new Client(url)


// routes 
// lab-11
app.get("/",firstfunction);
app.get("/favorite",welcomingFun);
// lab-12
app.get("/trending",movieFun);
app.get("/search",movieSearch)
app.get("/TV-Popularity",tvPopularity)
app.get("/MovieLanguage",movieLanguage)
// Lab-13
app.post("/moviesSql",sqlMovies);
app.get("/getMovies",moviesData);
// lab-14
app.put("/updateMpvies/:id",updateHandler);
app.delete("/deleteMovies/:id",movieDeleted);
app.get("/getMovies/:id",getData);



//functions
function firstfunction(req,res){
    let result1 =[];
      
    let newJsonData=new JasonCon(jasonData.title,jasonData.poster_path,jasonData.overview)
    result1.push(newJsonData);
    res.json(result1);
  }
  function welcomingFun(req,res){
    res.send("welcome to favorite page");
  }
  
function movieFun(req,res){
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${Api_Key}&language=en-US`;
    axios.get(url)
    .then((result)=>{
    //console.log(result.data);
    let dataMovie = result.data.results.map((movie)=>{
            return new ConMovie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
        })
            res.json(dataMovie);
        })
    .catch((err)=>{
        errorHandeler(err);
    })
}

function movieSearch(req,res){
    let movieName = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${Api_Key}&query=${movieName}&page=2`
    axios.get(url)
    .then((result)=>{
        let dataMovie = result.data.results.map((movie)=>{
            return new JasonCon(movie.title,movie.poster_path,movie.overview)
        })
            res.json(dataMovie);
        })
    .catch((err)=>{
        errorHandeler(err);
    })
    
}

function tvPopularity(req,res){
    let url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${Api_Key}&language=en-US&page=1`;
    axios.get(url)
    .then((result)=>{
        //console.log(result.data.results);
        let dataTV = result.data.results.map((TV)=>{
            return new TvCon(TV.id,TV.name,TV.first_air_date,TV.popularity,TV.overview)
        })
            res.json(dataTV);
         })
    .catch((err)=>{
        errorHandeler(err);
    })
    
}

function movieLanguage(req,res){
    let movieLanguage = req.query.original_language;
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${Api_Key}&query=${movieLanguage}`
    axios.get(url)
    .then((result)=>{
        //console.log(result.data.results); 
        let dataMovie = result.data.results.map((movie)=>{
            return new LanguageCon(movie.title,movie.original_language,movie.overview)
        })
            res.json(dataMovie);
        })
    .catch((err)=>{
      errorHandeler(err);
    })
    
}



function sqlMovies(req,res){
    let {movieName,overView}= req.body;
    let values = [movieName,overView];
    let sql = `INSERT INTO movies (movieName, overView)
    VALUES ($1,$2) RETURNING *; `
    client.query(sql,values).then(
        res.status(201).send("Data recived to the server")   
        ).catch((err)=>{errorHandeler(err)});
}
    
function moviesData(req,res){
    let sql = `SELECT * FROM movies; `
    client.query(sql).then((result)=>{
        res.json(result.rows);
    }
    ).catch((err)=>{errorHandeler(err)});
}
    
function updateHandler(req,res){
    let ID = req.params.id;
    let {overView}=req.body
    let values = [overView,ID];
    let sql = `UPDATE movies SET overView = $1 WHERE ID = $2 ; `;
    client.query(sql,values).then((result)=>{
        res.json("DONE");
    }
    ).catch((err)=>{errorHandeler(err)});
    
}

function movieDeleted(req,res){
    let ID=req.params.id;
    let sql = `DELETE FROM movies WHERE ID= $1; `;
    let values = [ID];
    client.query(sql,values).then((result)=>{
        res.status(204).send("DONE");
    }
    ).catch((err)=>{errorHandeler(err)});
    
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
    }).catch((err)=>{errorHandeler(err)});
    
}

// constructors
function TvCon(id,name,first_air_date,popularity,overview){
    this.id=id;
    this.name=name;
    this.first_air_date=first_air_date;
    this.popularity=popularity;
    this.overview=overview;
}

function ConMovie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}

function LanguageCon(title,original_language,overview){
    this.title=title;
    this.original_language=original_language;
    this.overview=overview;
  }

function JasonCon(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
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