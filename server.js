"use strict";

const express = require('express');
const jasonData = require('./Movie Data/data.json');
const app = express();
const port = 3000;

app.get("/",firstfunction);

function firstfunction(req,res){
  let result1 =[];
    
  let newJsonData=new JasonCon(jasonData.title,jasonData.poster_path,jasonData.overview)
  result1.push(newJsonData);

  res.json(result1);
}

function JasonCon(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
}

//app.get("/favorite",favFun);

fetch('http://some-site.com/favorite')  
  .then(function(response) {                      // first then()
      if(response.ok)
      {
        return response.text();         
      }

      throw new Error('Something went wrong.');
  })  
  .then(function(text) {                          // second then()
    console.log('Request successful', text);  
  })  
  .catch(function(error) {                        // catch
    console.log('Request failed', error);
  });

// function favFun(res,req) {

//     res => {
//       const data = res.data;
//       console.log(data);
//     })
//     .catch(err => {
//       if (err.response) {
//         console.log(`status : ${err.response.status}  ${err.response.statusText}`);
       
//       }
//     });
// }


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

