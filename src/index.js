document.addEventListener('DOMContentLoaded', () => {
  const dogUrl = 'http://localhost:3000/dogs';
  const dogForm = document.querySelector('#dog-form');
  const tableBody = document.querySelector('#table-body');

  fetch(dogUrl)
    .then(resp => resp.json())
    .then(dogs => {
      dogs.forEach(dog => {
        tableBody.innerHTML += `
          <tr>
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit" data-id="${dog.id}">Edit</button></td>
          </tr>
        `;
      });
    });

  tableBody.addEventListener('click', event => {
    if (event.target.className === 'edit') {
      const id = event.target.dataset.id;

      fetch(`${dogUrl}/${id}`)
        .then(resp => resp.json())
        .then(dog => {
          dogForm.name.value = dog.name;
          dogForm.breed.value = dog.breed;
          dogForm.sex.value = dog.sex;
          dogForm.dataset.id = dog.id;
        });
    }
  });

  dogForm.addEventListener('submit', event => {
    event.preventDefault();

    const id = dogForm.dataset.id;

    let url;
    let method;

    if (id) {
      url = `${dogUrl}/${id}`;
      method = 'PATCH';
    }

    else {
      url = dogUrl;
      method = 'POST';
    }

    const configObj = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: dogForm.elements.name.value,
        breed: dogForm.elements.breed.value,
        sex: dogForm.elements.sex.value
      })
    };

    fetch(url, configObj)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        return resp.json();
      })
      .then(dog => {
        if (method === 'PATCH') {
          const row = document.querySelector(`button[data-id="${dog.id}"]`).parentNode.parentNode;
          row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit" data-id="${dog.id}">Edit</button></td>
          `;
        } else {
          tableBody.innerHTML += `
            <tr>
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button class="edit" data-id="${dog.id}">Edit</button></td>
            </tr>
          `;
        }
      })
      .catch(e => {
        console.log('There was a problem with your fetch operation: ' + e.message);
      });

    dogForm.reset();
    delete dogForm.dataset.id;
  });
});
