import React, { useEffect, useState } from 'react';
import './Welcome.css';

function generateGroup(type, n) {
  let elements = [];
  let name = `${type}_${n}`;
  let description = '';
  let operation = () => '';
  let cayleyTable = [];

  if (type === 'Z') {
    elements = Array.from({ length: n }, (_, i) => i.toString());
    operation = (a, b) => ((parseInt(a) + parseInt(b)) % n).toString();
    description = `Integers modulo ${n}`;
  } else if (type === 'D') {
    for (let i = 0; i < n; i++) elements.push(`r${i}`);
    for (let i = 0; i < n; i++) elements.push(`s${i}`);
    operation = (a, b) => `${a}*${b}`;
    description = `Dihedral group of order ${2 * n}`;
  } else if (type === 'S') {
    const perms = getPermutations(n);
    elements = perms.map(p => p.join(''));
    operation = (a, b) => `${a}∘${b}`;
    description = `Symmetric group on ${n} elements`;
  }

  cayleyTable = elements.map(row =>
    elements.map(col => operation(row, col))
  );

  return {
    name,
    description,
    members: elements,
    cayleyTable
  };
}

function getPermutations(n) {
  if (n > 4) return [['too_big']];
  const nums = Array.from({ length: n }, (_, i) => i + 1);
  const results = [];
  const permute = (arr, m = []) => {
    if (arr.length === 0) results.push(m);
    else {
      for (let i = 0; i < arr.length; i++) {
        let rest = arr.slice(0, i).concat(arr.slice(i + 1));
        permute(rest, m.concat(arr[i]));
      }
    }
  };
  permute(nums);
  return results;
}

function formatGroupName(name) {
  const match = name.match(/^([A-Za-z]+)_([0-9]+)$/);
  if (!match) return name;
  const [_, base, sub] = match;
  const subscriptDigits = {
    0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
    5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉'
  };
  const subscript = sub.split('').map(d => subscriptDigits[d]).join('');
  return `${base}${subscript}`;
}

function Welcome() {
  const [groups, setGroups] = useState([]);
  const [groupType, setGroupType] = useState('Z');
  const [n, setN] = useState(4);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
    const groupData = generateGroup(groupType, n);
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData)
    });
    if (res.ok) {
      fetchGroups();
    } else {
      alert('Error creating group');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <h1 className="main-header">Group Explorer</h1>

      <form onSubmit={handleSubmit} className="group-form">
        <label>
          Group Type:
          <select value={groupType} onChange={(e) => setGroupType(e.target.value)}>
            <option value="Z">Zₙ (Cyclic)</option>
            <option value="D">Dₙ (Dihedral)</option>
            <option value="S">Sₙ (Symmetric)</option>
          </select>
        </label>
        <label>
          n:
          <input
            type="number"
            min="1"
            max="6"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            required
          />
        </label>
        <button type="submit">Create Group</button>
      </form>

      <h2 className="section-header">Groups</h2>

      <div className="group-grid">
        {groups.map((group) => (
          <div key={group._id} className="group-card">
            <h3 className="group-title">{formatGroupName(group.name)}</h3>
            <p className="group-desc">{group.description}</p>
            <table className="cayley-table">
              <thead>
                <tr>
                  <th></th>
                  {group.members.map((el, idx) => (
                    <th key={idx}>{el}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.cayleyTable.map((row, i) => (
                  <tr key={i}>
                    <th>{group.members[i]}</th>
                    {row.map((cell, j) => {
                      const identity = group.members[0];
                      const isIdentity = cell === identity;
                      return (
                        <td
                          key={j}
                          className={`cell ${isIdentity ? 'identity' : ''}`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Welcome;
