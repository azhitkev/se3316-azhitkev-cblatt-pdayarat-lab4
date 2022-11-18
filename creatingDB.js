// //Modules
// const fs = require("fs");
// const sqlite3 = require("sqlite3").verbose();
// const filepath = "./db/playlists.db"

// //Connect to db
// function connectingToDatabase(){
//     if(fs.existsSync(filepath)){
//         return new sqlite3.Database(filepath);
//     }else {
//         const db = new sqlite3.Database(filepath, (error) => {
//             if(error){
//                 return console.error(error.message);
//             }
//             createTable(db)
//             console.log("Succesful connection to database");
//         });
//         return db;
//     }
// }

// //Creating table
// function createTable(db){
//     db.exec(`
//     CREATE TABLE Play_lists
//     (
//         List_name VARCHAR(20)
//         track_id INT
//     )
//     `);
// }

// module.exports = connectingToDatabase();

