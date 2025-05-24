import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function generateGroup(type, n) {
  let elements = [];
  let name = `${type}_${n}`;
  let description = '';
  let operation = () => '';
  let cayleyTable = [];
  let identity = '';

  if (type === 'Z') {
    elements = Array.from({ length: n }, (_, i) => i.toString());
    operation = (a, b) => ((parseInt(a) + parseInt(b)) % n).toString();
    description = `Integers modulo ${n}`;
    identity = '0';
    cayleyTable = elements.map(row => elements.map(col => operation(row, col)));
  } else if (type === 'D') {
    const rot = Array.from({ length: n }, (_, i) => i === 0 ? 'e' : `r${i}`);
    const refl = Array.from({ length: n }, (_, i) => i === 0 ? 's' : `sr${i}`);
    elements = [...rot, ...refl];
    identity = 'e';

    const parse = (x) => {
      if (x === 'e') return ['r', 0];
      if (x === 's') return ['sr', 0];
      if (/^r\d+$/.test(x)) return ['r', parseInt(x.slice(1))];
      if (/^sr\d+$/.test(x)) return ['sr', parseInt(x.slice(2))];
      return ['invalid', 0];
    };

    const operation = (a, b) => {
      const [t1, i] = parse(a);
      const [t2, j] = parse(b);

      if (a === 'e') return b;
      if (b === 'e') return a;

      if (t1 === 'r' && t2 === 'r') return (i + j) % n === 0 ? 'e' : `r${(i + j) % n}`;
      if (t1 === 'r' && t2 === 'sr') return (j - i + n) % n === 0 ? 's' : `sr${(j - i + n) % n}`;
      if (t1 === 'sr' && t2 === 'r') return (i + j) % n === 0 ? 's' : `sr${(i + j) % n}`;
      if (t1 === 'sr' && t2 === 'sr') return (j - i + n) % n === 0 ? 'e' : `r${(j - i + n) % n}`;

      return 'e';
    };

    description = `Dihedral group Dₙ with ${2 * n} elements`;
    cayleyTable = elements.map(row => elements.map(col => operation(row, col)));
  } else if (type === 'S') {
    const perms = getPermutations(n);
    const permToCycle = (perm) => {
      const visited = Array(perm.length).fill(false);
      const cycles = [];
      for (let i = 0; i < perm.length; i++) {
        if (!visited[i]) {
          let j = i;
          const cycle = [];
          while (!visited[j]) {
            visited[j] = true;
            cycle.push(j + 1);
            j = perm[j] - 1;
          }
          if (cycle.length > 1) cycles.push(cycle);
        }
      }
      if (cycles.length === 0) return '()';
      return cycles.map(c => `(${c.join('')})`).join('');
    };
    const composePerm = (a, b) => a.map(i => b[i - 1]);
    const cycles = perms.map(p => ({ perm: p, cycleStr: permToCycle(p) }));
    const permsStr = cycles.map(c => c.cycleStr);
    const sortedPerms = cycles.map(c => c.perm);
    cayleyTable = sortedPerms.map(a => sortedPerms.map(b => permToCycle(composePerm(a, b))));
    elements = permsStr;
    identity = '()';
    description = `Symmetric group on ${n} elements`;
  }

  return { name, description, members: elements, cayleyTable, identity };
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    const button = document.querySelector('.group-form button');
    const groupName = `${groupType}_${n}`;

    if (groupType === 'S' && n > 4) {
      setError('SnTooBig');
      if (button) {
        button.classList.add('shake');
        setTimeout(() => button.classList.remove('shake'), 500);
      }
      return;
    }

    if (groups.some(g => g.name === groupName)) {
      setError('GroupExists');
      if (button) {
        button.classList.add('shake');
        setTimeout(() => button.classList.remove('shake'), 500);
      }
      return;
    }

    setError('');
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
        <button
          type="submit"
          className={error ? 'error-button' : ''}
        >
          Create Group
        </button>
        {error === 'SnTooBig' && (
          <p style={{ color: '#f28b82', fontSize: '0.85rem', marginTop: '6px' }}>
            Sorry! Sₙ groups with n ≥ 5 are too large to visualize.
          </p>
        )}
        {error === 'GroupExists' && (
          <p style={{ color: '#f28b82', fontSize: '0.85rem', marginTop: '6px' }}>
            That group already exists.
          </p>
        )}
      </form>

      <h2 className="section-header">Groups</h2>

      <div className="group-grid">
        {groups.map((group) => (
          <div
            key={group._id}
            className="group-card"
            onClick={() => {
              const match = group.name.match(/^([A-Za-z]+)_/);
              const type = match ? match[1] : 'Z';
              navigate(`/groups/${type}/${group._id}`);
            }}
            style={{ cursor: 'pointer' }}
          >
            <h3 className="group-title">{formatGroupName(group.name)}</h3>
            <p className="group-desc">{group.description}</p>
            <div className="table-container">
              <table className="cayley-table">
                <thead>
                  <tr>
                    <th></th>
                    {group.members.slice(0, 6).map((el, idx) => (
                      <th key={idx}>{el}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.cayleyTable.slice(0, 6).map((row, i) => (
                    <tr key={i}>
                      <th>{group.members[i]}</th>
                      {row.slice(0, 6).map((cell, j) => {
                        const isIdentity = String(cell).trim() === String(group.identity).trim();
                        return (
                          <td key={j} className={`cell ${isIdentity ? 'identity' : ''}`}>
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {group.members.length > 6 && (
              <p style={{ fontSize: '0.8rem', marginTop: '10px', color: 'gray' }}>
                Preview only — click to explore full group
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Welcome;
