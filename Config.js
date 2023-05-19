const mysql = require("mysql");

const con = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"ecommerce"
    }
);

con.connect((err)=>{
    if (err) throw err;
    console.log("Database connected......");
    // con.query("CREATE DATABASE ecommerce",(err,rlt)=>{
    //     if(err)throw err;
    //     console.log("Created......");
    // });
});

module.exports = con;