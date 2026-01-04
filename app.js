const CREATE_URL = 'https://prod-34.uksouth.logic.azure.com:443/workflows/25da0da831e1452c8e95b423541a8889/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=pkLwROr2CYhN8t9H2B3UkVKxCE9pZj6SAA99aJZRmJI';
const READ_URL   = 'https://prod-06.uksouth.logic.azure.com:443/workflows/2859e938844440f3a538b5e68c3be831/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=x5-6M4fxEc64eK7Uyo7D2bPv2U3vbFMU1OkoIwQ4pg4';
const UPDATE_URL = 'https://prod-20.uksouth.logic.azure.com:443/workflows/9a0e80708f4648f19ee4030827c1b6df/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=e12sE3xGtTQNUeApkQUovQd6o8JoKYr2E8FOQNUc-fI'; // soft delete
const DELETE_URL = 'https://prod-11.uksouth.logic.azure.com:443/workflows/8b2fd55789a94db6a0d70b5d2485e72f/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=RJ-OTox3Eae9Nsf7OHrs3fz4rn6r2Bl-jqbIodv5ZvU'
// Load content when page loads
document.addEventListener('DOMContentLoaded', loadContent);

function loadContent() {
  fetch(READ_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('contentList');
      list.innerHTML = '';

      data.forEach(item => {
        list.appendChild(renderItem(item));
      });
    })
    .catch(err => {
      console.error('Error loading content:', err);
    });
}

function createContent() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const fileType = document.getElementById('fileType').value;
  const fileUri = document.getElementById('fileUri').value.trim();

  if (!title || !description || !fileUri) {
    alert('Please fill in all fields');
    return;
  }

  const body = {
    title,
    description,
    fileType,
    fileUri
  };

  fetch(CREATE_URL, {
    method: 'POST',
    headers: {},
    body: JSON.stringify(body)
  })
    .then(() => {
      clearForm();
      loadContent();
    })
    .catch(err => {
      console.error('Error creating content:', err);
    });
}

function deleteContent(id) {
  fetch(UPDATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: id,
      isDeleted: true
    })
  })
    .then(() => loadContent())
    .catch(err => {
      console.error('Error deleting content:', err);
    });
}

function renderItem(item) {
  const div = document.createElement('div');
  div.className = 'content-item';

  let mediaHtml = '';

  if (item.fileType === 'image') {
    mediaHtml = `<img src="${item.fileUri}" alt="${item.title}">`;
  } else if (item.fileType === 'video') {
    mediaHtml = `
      <video controls>
        <source src="${item.fileUri}">
        Your browser does not support video.
      </video>`;
  } else if (item.fileType === 'audio') {
    mediaHtml = `
      <audio controls>
        <source src="${item.fileUri}">
        Your browser does not support audio.
      </audio>`;
  }

  div.innerHTML = `
    <h3>${item.title}</h3>
    <span class="file-type">${item.fileType}</span>
    <p>${item.description}</p>
    ${mediaHtml}
    <br>
    <button class="delete" onclick="deleteContent('${item.id}')">Delete</button>
  `;

  return div;
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('fileUri').value = '';
  document.getElementById('fileType').value = 'image';
}
