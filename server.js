//Add Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

//Asynchronous Handling 
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Server Setup 
const app = express();
const PORT = process.env.PORT || 8000;

//Sets up the Express app to handle data parsing 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Static Middleware
app.use(express.static("./develop/public"));

//API Routes
//GET Request
app.get("/api/notes", function(req, res){
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes)
    })
});

//POST Request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes){
        writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

//DELETE request - find all notes that shouldn't be deleted and add to a new array 
app.delete("/api/notes/:id", function(req, res) {
    const idDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      const newNotes = []
      for (let i = 0; i<notes.length; i++) {
        if(idDelete !== notes[i].id) {
          newNotes.push(notes[i])
        }
      }
      return newNotes
    }).then(function(notes) {
      writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
      res.send('Notes Saved!');
    })
  });

//HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./develop/public/notes.html"));
});
  
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});

//Listener

app.listen(PORT, function(){
    console.log(`App listening on PORT ${PORT}`);
})


