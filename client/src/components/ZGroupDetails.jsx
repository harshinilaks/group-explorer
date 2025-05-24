import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Welcome.css';

function ZGroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`/api/groups/${id}`);
      const data = await res.json();
      setGroup(data);
    };
    fetchGroup();
  }, [id]);

  if (!group) return <p>Loading...</p>;

  const orderedElements = group.members;

  const handleDrop = () => {
    if (draggedElement) {
      setSelectedElements((prev) => [...prev, draggedElement]);
      setDraggedElement(null);
    }
  };

  const computeSteps = () => {
    const steps = [];
    if (selectedElements.length === 0) return [];

    let current = selectedElements[0];
    steps.push({ step: 1, value: current });

    for (let i = 1; i < selectedElements.length; i++) {
      const left = current;
      const right = selectedElements[i];
      const iIdx = group.members.indexOf(left);
      const jIdx = group.members.indexOf(right);
      const result = group.cayleyTable[iIdx][jIdx];
      steps.push({
        step: i + 1,
        value: result,
        left,
        right,
      });
      current = result;
    }

    return steps;
  };

  const steps = computeSteps();
  const finalProduct = steps.length ? steps[steps.length - 1].value : '?';

  const makeDraggable = (el) => ({
    draggable: true,
    onDragStart: (e) => e.dataTransfer.setData('text/plain', el),
    onDragEnd: () => setDraggedElement(null),
    onDrag: () => setDraggedElement(el)
  });

  const removeElement = (index) => {
    setSelectedElements((prev) => prev.filter((_, i) => i !== index));
  };

  const defaultColor = '#444';

  return (
    <div style={{ padding: '20px' }}>
      <h1>
  {group.name.startsWith('Z_')
    ? <span>Z<sub>{group.name.slice(2)}</sub></span>
    : group.name}
</h1>
      <p>{group.description}</p>

      <h2>Cayley Table</h2>
      <table className="cayley-table">
        <thead>
          <tr>
            <th></th>
            {orderedElements.map((el, idx) => (
              <th
                key={idx}
                {...makeDraggable(el)}
                style={{
                  backgroundColor: defaultColor,
                  color: '#f1f1f1',
                  border: '1px solid #444'
                }}
              >
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedElements.map((rowEl, i) => (
            <tr key={i}>
              <th
                {...makeDraggable(rowEl)}
                style={{
                  backgroundColor: defaultColor,
                  color: '#f1f1f1',
                  border: '1px solid #444'
                }}
              >
                {rowEl}
              </th>
              {orderedElements.map((colEl, j) => {
                const product = group.cayleyTable[group.members.indexOf(rowEl)][group.members.indexOf(colEl)];
                const isIdentity = product === group.identity;
                return (
                  <td
                    key={j}
                    className={`cell ${isIdentity ? 'identity' : ''}`}
                    style={{
                      backgroundColor: defaultColor,
                      color: '#f1f1f1',
                      border: '1px solid #444'
                    }}
                  >
                    {product}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Group Element Composer</h2>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px',
          border: '2px dashed #777',
          borderRadius: '8px',
          background: '#333',
          color: '#f1f1f1',
          minHeight: '60px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {selectedElements.length === 0
          ? 'Drag elements here to compose'
          : selectedElements.map((el, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ fontSize: '1.2rem' }}>+</span>}
                <span
                  onClick={() => removeElement(i)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: '#666',
                    cursor: 'pointer'
                  }}
                  title="Click to remove"
                >
                  {el}
                </span>
              </React.Fragment>
            ))}
      </div>

      {steps.length > 0 && (
        <div style={{ marginTop: '20px', fontSize: '0.95rem', color: '#ddd' }}>
          <h3>Step-by-step Computation</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {steps.map((s, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>
                {s.step === 1
                  ? `Step 1: ${s.value}`
                  : `Step ${s.step}: ${s.left} + ${s.right} = ${s.value}`}
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: '12px',
              fontSize: '1.1rem',
              color: '#90ee90',
              background: '#222',
              padding: '8px 12px',
              borderRadius: '6px',
              display: 'inline-block',
              border: '1px solid #555'
            }}
          >
            Final product: {finalProduct}
          </div>
        </div>
      )}
    </div>
  );
}

export default ZGroupDetails;
