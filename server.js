"use strict";

const express = require('express');
const axios = require("axios");
require('dotenv').config()
const app = express()
const port = process.env.port;
const Api_Key=process.env.api_key;

app.get("/movie",movieFun);
app.get("/search",movieSearch)

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
        console.log(err);
    })
}

function movieSearch(req,res){
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${Api_Key}&language=en-US&query=${movieName}&The&page=2`
    axios.get(url)
    .then((result)=>{
        res.json(result.data.results);
    })
    .catch((err)=>{
        console.log(err);
    })

}

function ConMovie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})