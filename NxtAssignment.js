let editNoteId = null;
let isDarkMode = false;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const category = document.getElementById('noteCategory').value;
    const timestamp = new Date().toLocaleString();
    if (!title || !content) return alert("Both title and content are required.");

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const noteObj = {
        title,
        content,
        category,
        timestamp,
        pinned: false
    };
    if (editNoteId !== null) {
        notes[editNoteId] = {
            ...noteObj,
            timestamp: notes[editNoteId].timestamp,
            pinned: notes[editNoteId].pinned
        };
        editNoteId = null;
    } else {
        notes.push(noteObj);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteCategory').value = '';
    loadNotes();
}

function loadNotes() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = '';

    const pinnedNotes = notes.filter(n => n.pinned);
    const otherNotes = notes.filter(n => !n.pinned);

    const filteredNotes = [...pinnedNotes, ...otherNotes].filter(note =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search) ||
        note.category.toLowerCase().includes(search)
    );

    filteredNotes.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.innerHTML = `
          <h3>${note.title}</h3>
          <p>${marked.parse(note.content)}</p>
          <p><strong>Category:</strong> ${note.category || 'None'} | <strong>Created:</strong> ${note.timestamp}</p>
          <div class="note-buttons">
            <button onclick="editNote(${index})">Edit</button>
            <button class="delete" onclick="deleteNote(${index})">Delete</button>
            <button class="pin" onclick="togglePin(${index})">${note.pinned ? 'Unpin' : 'Pin'}</button>
          </div>
        `;
        notesContainer.appendChild(noteEl);
    });
}

function editNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    document.getElementById('noteTitle').value = notes[index].title;
    document.getElementById('noteContent').value = notes[index].content;
    document.getElementById('noteCategory').value = notes[index].category;
    editNoteId = index;
}

function deleteNote(index) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function togglePin(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes[index].pinned = !notes[index].pinned;
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

window.onload = () => {
    loadNotes();
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
};