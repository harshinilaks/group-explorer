import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Welcome.css';

function classifyCycleTypes(elements) {
  const cycleGroups = {};
  const cycleTypeMap = {};
  const pattern = /\(([^)]+)\)/g;

  for (const el of elements) {
    if (el === '()') {
      if (!cycleGroups.identity) cycleGroups.identity = [];
      cycleGroups.identity.push(el);
      cycleTypeMap[el] = 'identity';
    } else {
      const matches = [...el.matchAll(pattern)];
      const lengths = matches.map(m => m[1].split(/\s*/).filter(Boolean).length);
      const label = lengths.length === 1
        ? `${lengths[0]}-cycle`
        : `${lengths.join('+')}-cycle`;
      if (!cycleGroups[label]) cycleGroups[label] = [];
      cycleGroups[label].push(el);
      cycleTypeMap[el] = label;
    }
  }

  return { cycleGroups, cycleTypeMap };
}

function getColorForType(type) {
  // Use a reliable hash with seed to avoid collisions
  let hash = 5381;
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 33) ^ type.charCodeAt(i);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`/api/groups/${id}`);
      const data = await res.json();
      setGroup(data);
    };
    fetchGroup();
  }, [id]);

  if (!group) return <p>Loading...</p>;

  const { cycleGroups, cycleTypeMap } = classifyCycleTypes(group.members);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{group.name}</h1>
      <p>{group.description}</p>

      {Object.entries(cycleGroups).map(([type, els]) => (
        <div
          key={type}
          style={{
            marginBottom: '8px',
            fontSize: '0.85rem',
            padding: '6px 10px',
            borderRadius: '6px',
            backgroundColor: getColorForType(type),
            color: '#fff'
          }}
        >
          <strong>{type}:</strong> {els.join(', ')}
        </div>
      ))}

      <h2>Cayley Table</h2>
      <table className="cayley-table">
        <thead>
          <tr>
            <th></th>
            {group.members.map((el, idx) => (
              <th
                key={idx}
                style={{
                  backgroundColor: getColorForType(cycleTypeMap[el]),
                  color: '#fff',
                  border: '1px solid #ccc'
                }}
              >
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.cayleyTable.map((row, i) => (
            <tr key={i}>
              <th
                style={{
                  backgroundColor: getColorForType(cycleTypeMap[group.members[i]]),
                  color: '#fff',
                  border: '1px solid #ccc'
                }}
              >
                {group.members[i]}
              </th>
              {row.map((cell, j) => {
                const isIdentity = String(cell).trim() === String(group.identity).trim();
                return (
                  <td
                    key={j}
                    className={`cell ${isIdentity ? 'identity' : ''}`}
                    style={{
                      backgroundColor: getColorForType(cycleTypeMap[cell]),
                      color: '#fff',
                      border: '1px solid #ccc'
                    }}
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
  );
}

export default GroupDetails;