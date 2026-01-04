const CREATE_URL = 'https://prod-34.uksouth.logic.azure.com:443/workflows/25da0da831e1452c8e95b423541a8889/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=pkLwROr2CYhN8t9H2B3UkVKxCE9pZj6SAA99aJZRmJI';
const READ_URL   = 'https://prod-06.uksouth.logic.azure.com:443/workflows/2859e938844440f3a538b5e68c3be831/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=x5-6M4fxEc64eK7Uyo7D2bPv2U3vbFMU1OkoIwQ4pg4';
const UPDATE_URL = 'https://prod-20.uksouth.logic.azure.com:443/workflows/9a0e80708f4648f19ee4030827c1b6df/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=e12sE3xGtTQNUeApkQUovQd6o8JoKYr2E8FOQNUc-fI'; 
const DELETE_URL = 'https://prod-11.uksouth.logic.azure.com:443/workflows/8b2fd55789a94db6a0d70b5d2485e72f/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=RJ-OTox3Eae9Nsf7OHrs3fz4rn6r2Bl-jqbIodv5ZvU';

function loadContent() {
  fetch(READ_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('contentList');
      list.innerHTML = '';

      data.forEach(item => {
        list.innerHTML += `
          <div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p>Type: ${item.fileType}</p>
            <a href="${item.fileUri}" target="_blank">View file</a><br><br>
            <button onclick="deleteContent('${item.id}')">Delete</button>
            <hr>
          </div>
        `;
      });
    });
}

function createContent() {
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    fileType: document.getElementById('fileType').value,
    fileUri: document.getElementById('fileUri').value
  };

  fetch(CREATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(() => loadContent());
}

function deleteContent(id) {
  fetch(UPDATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, isDeleted: true })
  }).then(() => loadContent());
}

loadContent();
