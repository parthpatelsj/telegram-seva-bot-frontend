document.addEventListener('DOMContentLoaded', function () {
  const sevaList = document.getElementById('seva-list');
  const sevaForm = document.getElementById('seva-form');
  const messageDiv = document.getElementById('message');

  // Fetch all Sevas
  fetch('https://telegram-seva-bot-16ec0e933bf1.herokuapp.com/sevas')
    .then(response => response.json())
    .then(data => {
      data.forEach(seva => {
        const li = document.createElement('li');
        li.textContent = `${seva.seva_name} - ${seva.time_slot} (${seva.description})`;
        sevaList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching sevas:', error);
      messageDiv.textContent = 'Error loading sevas. Please try again later.';
    });

  // Add a new Seva
  sevaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const seva_name = document.getElementById('seva_name').value;
    const time_slot = document.getElementById('time_slot').value;
    const description = document.getElementById('description').value;

    fetch('https://telegram-seva-bot-16ec0e933bf1.herokuapp.com/add_seva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seva_name, time_slot, description }),
    })
      .then(response => response.json())
      .then(data => {
        messageDiv.textContent = data.message;
        // Optionally refresh the list or update it dynamically
        const li = document.createElement('li');
        li.textContent = `${seva_name} - ${time_slot} (${description})`;
        sevaList.appendChild(li);
        sevaForm.reset(); // Clear the form
      })
      .catch(error => {
        console.error('Error adding seva:', error);
        messageDiv.textContent = 'Error adding seva. Please try again.';
      });
  });
});

