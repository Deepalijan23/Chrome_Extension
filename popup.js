alert("Capture your ideas and thoughts with a quick note!")

document.addEventListener('DOMContentLoaded', function() {
    var notes = document.getElementById('notes');
    var newNote = document.getElementById('new-note');
    var noteColor = document.getElementById('note-color');
    var addNoteBtn = document.getElementById('add-note');
    var removeNoteBtn = document.getElementById('remove-note');
  
    // Load existing notes from storage
    chrome.storage.sync.get(['notes'], function(result) {
      if (result.notes) {
        result.notes.forEach(function(note) {
          addNoteElement(note.text, note.color, note.pinned);
        });
      }
    });
  
    // Add a new note
    addNoteBtn.addEventListener('click', function() {
      var noteText = newNote.value.trim();
      if (noteText) {
        var note = {
          text: noteText,
          color: noteColor.value,
          pinned: false
        };
        addNoteElement(noteText, noteColor.value, false);
        newNote.value = '';
  
        // Save notes to storage
        chrome.storage.sync.get(['notes'], function(result) {
          var notes = result.notes || [];
          notes.push(note);
          chrome.storage.sync.set({ 'notes': notes });
        });
      }
    });

    // Remove a note
    removeNoteBtn.addEventListener('click', function() {
        var notesList = document.getElementsByClassName('note');
        var notes = [];
        for (var i = 0; i < notesList.length; i++) {
        if (!notesList[i].classList.contains('pinned')) {
            notesList[i].remove();
      }
    }
  
    // Update notes in storage
    chrome.storage.sync.set({ 'notes': notes });
  });
  
  
    // Function to add a note element to the DOM
    function addNoteElement(text, color, pinned) {
      var noteElement = document.createElement('div');
      noteElement.className = 'note';
      noteElement.textContent = text;
      noteElement.style.backgroundColor = color;
      if (pinned) {
        noteElement.classList.add('pinned');
      }
      notes.appendChild(noteElement);
  
      // Pin/unpin note on click
      noteElement.addEventListener('click', function() {
        noteElement.classList.toggle('pinned');
        // Update note in storage
        chrome.storage.sync.get(['notes'], function(result) {
          var notes = result.notes || [];
          var index = notes.findIndex(function(note) {
            return note.text === text && note.color === color;
        });
          if (index !== -1) {
            notes[index].pinned = !notes[index].pinned;
            chrome.storage.sync.set({ 'notes': notes });
          }
        });
      });
    }
  });