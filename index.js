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
app.use("/public",express.static(path.join(__dirname,"public")));

//This api is made for insert data in userrights table..........
app.post("/insert-userrights", (req, resp) => {
  let data = req.body;
  con.query("INSERT INTO userrights SET ?", [data], (err, rlt) => {
    if (err) throw err;
    resp.send("data enterd.....");
  });
});

//This api is made for get user details on given email and password.....
app.post("/get-userdetails", (req, resp) => {
  let data = req.body;
  con.query(
    "SELECT id,email,type FROM userrights WHERE email = ? AND pass = ?",
    [data.email, data.pass],
    (err, rlt) => {
      if (err) throw err;
      if (rlt.length <= 0) {
        resp.send(false);
      } else {
        resp.send(rlt);
      }
    }
  );
});

//Get user data.
app.get("/user_details", (req, resp) => {
  con.query(
    "SELECT id,email,type,upd,del FROM userrights WHERE type='user' OR type='admin' ",
    (err, result) => {
      if (err) throw err;
      resp.send(result);
    }
  );
});

//Updateing type by master admin.
app.put("/update-type", (req, resp) => {
  const { type } = req.body;
  const { id } = req.body;
  con.query(
    "UPDATE userrights SET type=? WHERE id=?",
    [type, id],
    (err, reult) => {
      if (err) throw err;
      resp.send(true);
    }
  );
});

//Updateing admin update rights by master admin.
app.put("/update-rights", (req, resp) => {
  const { upd } = req.body;
  const { id } = req.body;
  con.query(
    "UPDATE userrights SET upd=? WHERE id=?",
    [upd, id],
    (err, reult) => {
      if (err) throw err;
      resp.send(true);
    }
  );
});

//Updateing admin delete rights by master admin.
app.put("/delete-rights", (req, resp) => {
  const { del } = req.body;
  const { id } = req.body;
  con.query(
    "UPDATE userrights SET del=? WHERE id=?",
    [del, id],
    (err, reult) => {
      if (err) throw err;
      resp.send(true);
    }
  );
});

//It will us to store image with it's data.

let storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/image")) {
      fs.mkdirSync("public/image");
    }
    callBack(null, "public/image");
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + file.originalname);
  },
});

let upload = multer({
  storage: storage,
});

//This is user for store image details...
app.post(
  "/insert-imgdetails",
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, resp) => {
    const { prdname } = req.body;
    const { details } = req.body;
    const { price } = req.body;

    let imgpath ="";
    for(let img of req.files.image)
    {
        imgpath = `/${img.path}`;
        imgpath = imgpath.replace(/\\/g,'/');
    }

    const data = {
        name:prdname,
        details:details,
        price:price,
        imgsrc:imgpath
    }

    con.query("INSERT INTO prd SET ?",[data],(err,rsult)=>{
        if(err) throw err;
        resp.send(true);
    });
  }
);

//This is use for get image details...
app.get("/get-imagedetails",(req,resp)=>{
    con.query("SELECT * FROM prd",(err,result)=>{
        if(err) throw err;
        resp.send(result);
    });
});
app.listen("3000", console.log("server connected......"));
