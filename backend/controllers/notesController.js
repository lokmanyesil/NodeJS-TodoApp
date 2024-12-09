
const db = require("../models/firebaseConfig");


const getAllNotes = async (req, res) => {
  try {
    const notesRef = db.ref("notes"); 
    const snapshot = await notesRef.once("value");
    const notes = snapshot.val(); 
    res.json(notes); 
  } catch (error) {
    res.status(500).send("Notlar alınırken bir hata oluştu!"); 
  }
};


const addNote = async (req, res) => {
  try {
    const note = req.body; 
    const notesRef = db.ref("notes"); 
    const newNoteRef = notesRef.push(); 
    await newNoteRef.set(note);
    res.status(201).send("Not eklendi!");
  } catch (error) {
    res.status(500).send("Not eklenirken bir hata oluştu!"); 
  }
};


const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id; 
    const updatedNote = req.body;
    const noteRef = db.ref(`notes/${noteId}`);
    await noteRef.update(updatedNote); 
    res.send("Not güncellendi!"); 
  } catch (error) {
    res.status(500).send("Not güncellenirken bir hata oluştu!");
  }
};


const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id; 
    const noteRef = db.ref(`notes/${noteId}`); 
    await noteRef.remove(); 
    res.send("Not silindi!"); 
  } catch (error) {
    res.status(500).send("Not silinirken bir hata oluştu!"); 
  }
};

module.exports = {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
};
