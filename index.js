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
app.use("/public", express.static(path.join(__dirname, "public")));

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
    "SELECT id,email,type,upd,del FROM userrights WHERE email = ? AND pass = ?",
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
    const { uid } = req.body;
    let imgpath = "";
    for (let img of req.files.image) {
      imgpath = `/${img.path}`;
      imgpath = imgpath.replace(/\\/g, "/");
    }

    const data = {
      name: prdname,
      details: details,
      price: price,
      imgsrc: imgpath,
      uid: uid,
    };

    con.query("INSERT INTO prd SET ?", [data], (err, rsult) => {
      if (err) throw err;
      resp.send(true);
    });
  }
);

//This is use for get image details...
app.get("/get-imagedetails", (req, resp) => {
  con.query("SELECT * FROM prd", (err, result) => {
    if (err) throw err;
    resp.send(result);
  });
});

//This is for update image data...
app.put(
  "/update-imgData",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  (req, resp) => {
    const { name } = req.body;
    const { details } = req.body;
    const { price } = req.body;
    const { id } = req.body;
    const { imgsrc } = req.body;

    fs.rmSync(__dirname + imgsrc);

    let imgpath = "";
    for (let img of req.files.image) {
      imgpath = `/${img.path}`;
      imgpath = imgpath.replace(/\\/g, "/");
    }

    con.query(
      "UPDATE prd SET name=?,details=?,price=?,imgsrc=? WHERE id=?",
      [name, details, price, imgpath, id],
      (err, rsult) => {
        if (err) throw err;
        resp.send(rsult);
      }
    );
  }
);

//This is use for delete image and it's data..
app.delete("/delete-imgData", (req, resp) => {
  const { imgsrc } = req.body;
  const { id } = req.body;
  fs.rmSync(__dirname + imgsrc);
  con.query("DELETE FROM prd WHERE id = ?", [id], (err, rsult) => {
    if (err) throw err;
    resp.send(true);
  });
});

//This is use for add product in add cart...
app.post("/addIN-cart", (req, resp) => {
  con.query("INSERT INTO cart SET ? ", [req.body], (err, rsult) => {
    if (err) throw err;
    resp.send(true);
  });
});

//This is for get add cart product list..
app.get("/get-cartlist", (req, resp) => {
  con.query("SELECT * FROM cart", (err, rsult) => {
    if (err) throw err;
    resp.send(rsult);
  });
});

//This is for delete product from cart..
app.delete("/delete-prdCart", (req, resp) => {
  const {id} = req.body;
  con.query("DELETE FROM cart WHERE id=?", [id], (err, rsult) => {
    if (err) throw err;
    resp.send(true);
  });
});

//This is will give total sum of user add cart product...
app.post("/get-sumtotal",(req,resp)=>{
  const {id} = req.body; 
  con.query("SELECT SUM(price) as totalsum FROM cart WHERE uid=?",[id],(err,rsult)=>{
    if (err) throw err;
    resp.send(rsult);
  })
})
app.listen("3000", console.log("server connected......"));
