require("./Config.js");
const express = require("express");
const cors = require("cors");
const con = require("./Config.js");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
app.use(cors());
app.use(express.json());



//This api is made for insert data in userrights table..........
app.post("/insert-userrights",(req,resp)=>{
    let data = req.body;
    con.query("INSERT INTO userrights SET ?",[data],(err,rlt)=>{
        if(err) throw err;
        resp.send("data enterd.....");
    });
});

//This api is made for get user details on given email and password.....
app.post("/get-userdetails",(req,resp)=>{
    let data = req.body;
    con.query("SELECT id,email,type FROM userrights WHERE email = ? AND pass = ?",[data.email,data.pass],(err,rlt)=>{
        if(err) throw err;
        if(rlt.length<=0){
            resp.send(false);
        }
        else{
            resp.send(rlt);
        }
    })
})

app.get("/user_details",(req,resp)=>{
    con.query("SELECT id,email,type,upd,del FROM userrights WHERE type='user' OR type='admin' ",(err,result)=>{
        if(err) throw err;
        resp.send(result);
    });
});




//It will us to store image with it's data.

let storage = multer.diskStorage({
    destination:(req,file,callBack)=>{
        callBack(null,'./public/images')
    },
    filename:(req,file,callBack)=>{
        callBack(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage:storage
})

app.post("/insert-imgdetails",upload.single("image"),(req,resp)=>{
    if(!req.upimg){
        console.log("No file upload");}
        else{
            var imgsrc = "/public/images"+req.upimg.filename;
            console.log(imgsrc);
        }
});







//Make table for user rights....
// con.query("CREATE TABLE userrights (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,email VARCHAR(140) NOT NULL,pass VARCHAR(8) NOT NULL,type VARCHAR(15) NOT NULL)",(err)=>{
//     if(err)throw err;
//     console.log("done.....");
// });

app.listen("3000",console.log("server connected......"))