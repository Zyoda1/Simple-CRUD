const form = document.getElementById('teamForm');
const teamsList = document.getElementById('teamsList');
let editingId = null;
const BASE_URL = 'https://simple-crud-gj58.onrender.com/teams';

// Load all teams
async function loadTeams() {
  const res = await fetch(BASE_URL);
  const teams = await res.json();

  teamsList.innerHTML = '';
  teams.forEach(team => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${team.name}</h3>
      <p>Coach: ${team.coach}</p>
      <p>League: ${team.league}</p>
      <p>Stadium: ${team.stadium}</p>
      <p>Founded: ${team.foundedYear}</p>
    `;

    if (team.players && team.players.length > 0) {
      div.innerHTML += '<h4>Players:</h4><ul>';
      team.players.forEach(p => {
        const jersey = typeof p.number === 'number' ? `#${p.number}` : '';
        div.innerHTML += `<li>${p.name} (${p.position}) ${jersey}</li>`;
      });
      div.innerHTML += '</ul>';
    }

    div.innerHTML += `
      <button onclick="editTeam('${team._id}')">Edit</button>
      <button onclick="deleteTeam('${team._id}')">Delete</button>
    `;
    teamsList.appendChild(div);
  });
}

// Add another player input field
function addPlayerField() {
  const section = document.getElementById('playersSection');
  const div = document.createElement('div');
  div.classList.add('player');
  div.innerHTML = `
    <input type="text" placeholder="Player Name" class="player-name">
    <input type="text" placeholder="Position" class="player-position">
    <input type="number" placeholder="Jersey Number" class="player-number">
  `;
  section.insertBefore(div, section.querySelector('button'));
}

// Collect players from form
function collectPlayers() {
  const playerDivs = document.querySelectorAll('.player');
  const players = [];

  playerDivs.forEach(div => {
    const name = div.querySelector('.player-name').value.trim();
    const position = div.querySelector('.player-position').value.trim();
    const numberValue = div.querySelector('.player-number').value.trim();
    const number = numberValue !== '' ? parseInt(numberValue) : null;

    if (name && position && number !== null && !isNaN(number)) {
      players.push({ name, position, number });
    } else {
      console.warn('Skipping incomplete player:', { name, position, numberValue });
    }
  });

  return players;
}

// Reset form and player section
function resetForm() {
  form.reset();
  document.getElementById('playersSection').innerHTML = `
    <h4>Players</h4>
    <div class="player">
      <input type="text" placeholder="Player Name" class="player-name">
      <input type="text" placeholder="Position" class="player-position">
      <input type="number" placeholder="Jersey Number" class="player-number">
    </div>
    <button type="button" onclick="addPlayerField()">Add Another Player</button>
  `;
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const players = collectPlayers();

  const team = {
    name: document.getElementById('name').value.trim(),
    coach: document.getElementById('coach').value.trim(),
    league: document.getElementById('league').value.trim(),
    stadium: document.getElementById('stadium').value.trim(),
    foundedYear: parseInt(document.getElementById('foundedYear').value),
    players
  };

  try {
    if (editingId) {
      const res = await fetch(`${BASE_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team)
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Team updated!');
      editingId = null;
      document.querySelector('button[type="submit"]').textContent = 'Create Team';
    } else {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team)
      });
      if (!res.ok) throw new Error('Create failed');
      alert('Team created!');
    }

    resetForm();
    loadTeams();
  } catch (err) {
    console.error('Error submitting form:', err);
    alert('Something went wrong.');
  }
});

// Edit a team
async function editTeam(id) {
  console.log('Editing team with ID:', id);

  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch team: ${res.status}`);
    const team = await res.json();

    document.getElementById('name').value = team.name || '';
    document.getElementById('coach').value = team.coach || '';
    document.getElementById('league').value = team.league || '';
    document.getElementById('stadium').value = team.stadium || '';
    document.getElementById('foundedYear').value = team.foundedYear || '';

    const section = document.getElementById('playersSection');
    section.innerHTML = '<h4>Players</h4>';
    team.players.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('player');
      div.innerHTML = `
        <input type="text" value="${p.name}" class="player-name">
        <input type="text" value="${p.position}" class="player-position">
        <input type="number" value="${p.number}" class="player-number">
      `;
      section.appendChild(div);
    });

    section.innerHTML += `<button type="button" onclick="addPlayerField()">Add Another Player</button>`;

    editingId = id;
    document.querySelector('button[type="submit"]').textContent = 'Update Team';
  } catch (err) {
    console.error('Error fetching team:', err);
    alert('Failed to load team for editing.');
  }
}

// Delete a team
async function deleteTeam(id) {
  const confirmed = confirm('Are you sure you want to delete this team?');
  if (!confirmed) return;

  try {
    const res = await fetch(`https://simple-crud-gj58.onrender.com/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Delete failed');
    alert('Team deleted!');
    loadTeams();
  } catch (err) {
    console.error('Error deleting team:', err);
    alert('Failed to delete team.');
  }
}

// Initial load
loadTeams();
