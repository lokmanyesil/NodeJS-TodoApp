const API_URL = "http://127.0.0.1:8080/notes";
const notesContainer = document.getElementById("notes");
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

let isEditing = false;
let currentEditId = null;

async function fetchNotes() {
	try {
		const response = await fetch(API_URL);
		const notes = await response.json();
		renderNotes(notes);
	} catch (error) {
		console.error("Notlar yüklenirken bir hata oluştu:", error);
	}
}
// Tamamlandı ve Tamamlanmadılan notları gösteren fonksiyon
function renderNotes(notes) {
	notesContainer.innerHTML = `
        <div class="row p-3">
            <div class="col-md-6 p-3" id="notCompleted">
                <h4>Tamamlanmadı</h4>
            </div>
            <div class="col-md-6 p-3" id="completed">
                <h4>Tamamlandı</h4>
            </div>
        </div>
    `;
	const notCompletedContainer = document.getElementById("notCompleted");
	const completedContainer = document.getElementById("completed");

	for (const id in notes) {
		const note = notes[id];
		const noteCard = `
            <div class="card shadow mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${note.title}</h5>
                        <div class="d-flex align-items-center">						
						<input type="checkbox" 
                                   id="checkbox-${id}" 
                                   ${note.completed ? "checked" : ""} 
                                   onchange="toggleCompletion('${id}', ${
			note.completed
		})">
                            <label for="checkbox-${id}" class="me-2">${
			note.completed ? "Tamamlandı" : "Tamamlanmadı"
		}</label>                            
                        </div>
                    </div>
                    <p class="card-text">${note.content}</p>
                    <button class="btn btn-warning btn-sm mt-2" onclick="startEdit('${id}', '${
			note.title
		}', '${note.content}')">Düzenle</button>
                    <button class="btn btn-danger btn-sm mt-2" onclick="deleteNote('${id}')">Sil</button>
                </div>
            </div>
        `;
		if (note.completed) {
			completedContainer.insertAdjacentHTML("beforeend", noteCard);
		} else {
			notCompletedContainer.insertAdjacentHTML("beforeend", noteCard);
		}
	}
}

async function toggleCompletion(id, currentState) {
	try {
		await fetch(`${API_URL}/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ completed: !currentState }),
		});
		fetchNotes();
	} catch (error) {
		console.error("Durum güncellenirken bir hata oluştu:", error);
	}
}

noteForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const noteData = {
		title: titleInput.value,
		content: contentInput.value,
	};

	if (isEditing) {
		try {
			await fetch(`${API_URL}/${currentEditId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(noteData),
			});
			resetForm();
			fetchNotes();
		} catch (error) {
			console.error("Not güncellenirken bir hata oluştu:", error);
		}
	} else {
		try {
			await fetch(API_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(noteData),
			});
			resetForm();
			fetchNotes();
		} catch (error) {
			console.error("Not eklenirken bir hata oluştu:", error);
		}
	}
});

function startEdit(id, title, content) {
	isEditing = true;
	currentEditId = id;
	titleInput.value = title;
	contentInput.value = content;
	document.querySelector("button[type='submit']").innerText = "Güncelle";
}

function resetForm() {
	isEditing = false;
	currentEditId = null;
	titleInput.value = "";
	contentInput.value = "";
	document.querySelector("button[type='submit']").innerText = "Not Ekle";
}

async function deleteNote(id) {
	try {
		await fetch(`${API_URL}/${id}`, { method: "DELETE" });
		fetchNotes();
	} catch (error) {
		console.error("Not silinirken bir hata oluştu:", error);
	}
}

fetchNotes();
