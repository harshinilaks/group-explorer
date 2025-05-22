import React, { useEffect, useState } from 'react';

function Welcome() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchGroups = async () => {
    const res = await fetch('/api/groups');
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGroup = {
      name,
      description,
      members: []
    };

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGroup)
    });

    if (res.ok) {
      setName('');
      setDescription('');
      fetchGroups(); // Refresh group list
    } else {
      alert('Error creating group');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Group Explorer</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Group description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">Create Group</button>
      </form>

      <h2>Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group._id}>
              <strong>{group.name}</strong>: {group.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Welcome;
