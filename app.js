const CREATE_URL = 'https://prod-34.uksouth.logic.azure.com:443/workflows/25da0da831e1452c8e95b423541a8889/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=pkLwROr2CYhN8t9H2B3UkVKxCE9pZj6SAA99aJZRmJI';
const READ_URL   = 'https://prod-06.uksouth.logic.azure.com:443/workflows/2859e938844440f3a538b5e68c3be831/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=x5-6M4fxEc64eK7Uyo7D2bPv2U3vbFMU1OkoIwQ4pg4';
const UPDATE_URL = 'https://prod-20.uksouth.logic.azure.com:443/workflows/9a0e80708f4648f19ee4030827c1b6df/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=e12sE3xGtTQNUeApkQUovQd6o8JoKYr2E8FOQNUc-fI';
const DELETE_URL = 'https://prod-11.uksouth.logic.azure.com:443/workflows/8b2fd55789a94db6a0d70b5d2485e72f/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=RJ-OTox3Eae9Nsf7OHrs3fz4rn6r2Bl-jqbIodv5ZvU';
/* ---------------- GLOBAL STATE ---------------- */

let currentItems = [];
let editingId = null;

/* ---------------- LOAD CONTENT ---------------- */

function loadContent() {
  fetch(READ_URL)
    .then(res => res.json())
    .then(data => {
      currentItems = data;
      const list = document.getElementById('contentList');
      list.innerHTML = '';

      data.forEach(item => {
        const tagsHtml = item.tags && item.tags.length
          ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')
          : `<span class="tag">untagged</span>`;

        list.innerHTML += `
          <div class="content-item">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p><strong>Type:</strong> ${item.fileType}</p>

            <a href="${item.fileUri}" target="_blank">View file</a>

            <div class="tags">${tagsHtml}</div>

            <br>
            <button onclick="editContent('${item.id}')">Edit</button>
            <button onclick="deleteContent('${item.id}')">Delete</button>
            <hr>
          </div>
        `;
      });
    })
    .catch(err => console.error('Error loading content:', err));
}

/* ---------------- CREATE / UPDATE ---------------- */

function createContent() {
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    fileType: document.getElementById('fileType').value,
    fileUri: document.getElementById('fileUri').value
  };

  let url = CREATE_URL;

  if (editingId) {
    body.id = editingId;
    url = UPDATE_URL;
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(() => {
      editingId = null;
      clearForm();
      loadContent();
      updateButtonLabel();
    })
    .catch(err => console.error('Error saving content:', err));
}

/* ---------------- EDIT ---------------- */

function editContent(id) {
  const item = currentItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description;
  document.getElementById('fileType').value = item.fileType;
  document.getElementById('fileUri').value = item.fileUri;

  editingId = id;
  updateButtonLabel();
}

/* ---------------- DELETE (SOFT DELETE) ---------------- */

function deleteContent(id) {
  fetch(UPDATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, isDeleted: true })
  })
    .then(() => loadContent())
    .catch(err => console.error('Error deleting content:', err));
}

/* ---------------- UI HELPERS ---------------- */

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('fileType').value = 'image';
  document.getElementById('fileUri').value = '';
}

function updateButtonLabel() {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;
  btn.innerText = editingId ? 'Update Content' : 'Share Content';
}

/* ---------------- INIT ---------------- */

loadContent();
