const mysql = require("mysql2");


const db= mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"srinikadesk",
})



db.getConnection((err,connection)=>{
    if(err){
        console.error("Database Connection Failed:", err.message);
    }else{
        console.log("Mysql Databae Connected")
        connection.release()
    }
})

module.exports=db;