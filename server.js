//Add 
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

//Asynchronous Handling 
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//PORT Designation and app expression
const app = express();
const PORT = process.env.PORT || 5000;

//Express Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Static Middleware
app.use(express.static("./develop2/public"));



//API Routes
//GET Request
app.get("/api/notes",(req, res) => {
    readFileAsync("./develop2/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes)
    })
});

//POST Request
app.post("/api/notes", (req, res) => {
    const note = req.body;
    readFileAsync("./develop2/db/db.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes){
        writeFileAsync("./develop2/db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});



//DELETE request - find all notes that shouldn't be deleted and add to a new array 
app.delete("/api/notes/:id", (req, res) => {
    const idDelete = parseInt(req.params.id);
    readFileAsync("./develop2/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      const newNotes = []
      for (let i = 0; i<notes.length; i++) {
        if(idDelete !== notes[i].id) {
          newNotes.push(notes[i])
        }
      }
      return newNotes
    }).then((notes) => {
      writeFileAsync("./develop2/db/db.json", JSON.stringify(notes))
      res.send('Delete Successfull');
    })
  });

//HTML Routes
app.get("/notes",(req, res) => {
    res.sendFile(path.join(__dirname, "./notes.html"));
});
  
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

//Listener

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));



