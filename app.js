document.addEventListener('DOMContentLoaded', function () {
  const sevaList = document.getElementById('seva-list');
  const sevaForm = document.getElementById('seva-form');
  const messageDiv = document.getElementById('message');

  // Fetch all Sevas
  function fetchSevas() {
    fetch('https://telegram-seva-bot-16ec0e933bf1.herokuapp.com/sevas')
      .then(response => response.json())
      .then(data => {
        sevaList.innerHTML = ''; // Clear the list before appending new items
        data.forEach(seva => {
          const li = document.createElement('li');
          
          // Add Seva details and Volunteer list to the list item
          let volunteersList = seva.volunteers.length > 0 
            ? `<strong>Volunteers:</strong> ${seva.volunteers.join(', ')}`
            : '<strong>No volunteers yet.</strong>';
          
          li.innerHTML = `
            ${seva.seva_name} - ${seva.time_slot} on ${seva.date_slot} (${seva.description})
            <br> ${volunteersList}
            <button class="delete-btn" data-id="${seva.id}">Delete</button>
          `;
          sevaList.appendChild(li);
        });

        // Attach delete button event listeners
        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', function () {
            const sevaId = this.getAttribute('data-id');
            deleteSeva(sevaId);
          });
        });
      })
      .catch(error => {
        console.error('Error fetching sevas:', error);
        messageDiv.textContent = 'Error loading sevas. Please try again later.';
      });
  }

  // Call the fetch function initially to load all sevas
  fetchSevas();

  // Add a new Seva
  sevaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const seva_name = document.getElementById('seva_name').value;
    const time_slot = document.getElementById('time_slot').value;
    const date_slot = document.getElementById('date_slot').value; // Capture date_slot
    const description = document.getElementById('description').value;

    fetch('https://telegram-seva-bot-16ec0e933bf1.herokuapp.com/add_seva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seva_name, time_slot, date_slot, description }),
    })
      .then(response => response.json())
      .then(data => {
        messageDiv.textContent = data.message;
        // Optionally refresh the list or update it dynamically
        fetchSevas(); // Re-fetch all sevas to include the newly added one
        sevaForm.reset(); // Clear the form
      })
      .catch(error => {
        console.error('Error adding seva:', error);
        messageDiv.textContent = 'Error adding seva. Please try again.';
      });
  });

  // Function to delete a Seva
  function deleteSeva(sevaId) {
    fetch(`https://telegram-seva-bot-16ec0e933bf1.herokuapp.com/delete_seva/${sevaId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        messageDiv.textContent = data.message;
        fetchSevas(); // Refresh the list after deletion
      })
      .catch(error => {
        console.error('Error deleting seva:', error);
        messageDiv.textContent = 'Error deleting seva. Please try again.';
      });
  }
});

