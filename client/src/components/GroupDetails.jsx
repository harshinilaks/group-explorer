import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <h2>Cayley Table</h2>
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
  );
}

export default GroupDetails;