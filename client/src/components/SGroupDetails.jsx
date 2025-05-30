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
  if (type === 'identity') return 'var(--identity-bg)';
  let hash = 5381;
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 33) ^ type.charCodeAt(i);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 40%, 50%)`;
}

function SGroupDetails() {
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

  const { cycleGroups, cycleTypeMap } = classifyCycleTypes(group.members);
  const orderedElements = Object.values(cycleGroups).flat();

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

  return (
    <div className="details-container">
      <h1 className="details-header">
        {group.name.startsWith('S_') ? <span>S<sub>{group.name.slice(2)}</sub></span> : group.name}
      </h1>
      <p className="details-description">{group.description}</p>

      {Object.entries(cycleGroups).map(([type, els]) => (
        <div
          key={type}
          className="cycle-type-label"
          style={{ backgroundColor: getColorForType(type) }}
        >
          <strong>{type}:</strong> {els.join(', ')}
        </div>
      ))}

      <h2>Cayley Table</h2>
      <table className="cayley-table">
        <thead>
          <tr>
            <th></th>
            {orderedElements.map((el, idx) => (
              <th
                key={idx}
                {...makeDraggable(el)}
                className="table-header-cell"
                style={{ backgroundColor: getColorForType(cycleTypeMap[el]) }}
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
                className="table-header-cell"
                style={{ backgroundColor: getColorForType(cycleTypeMap[rowEl]) }}
              >
                {rowEl}
              </th>
              {orderedElements.map((colEl, j) => {
                const product = group.cayleyTable[group.members.indexOf(rowEl)][group.members.indexOf(colEl)];
                const productType = product === group.identity ? 'identity' : cycleTypeMap[product];
                return (
                  <td
                    key={j}
                    className={`table-cell ${product === group.identity ? 'identity' : ''}`}
                    style={{ backgroundColor: getColorForType(productType) }}
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
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="drop-zone">
        {selectedElements.length === 0
          ? 'Drag elements here to compose'
          : selectedElements.map((el, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ fontSize: '1.2rem' }}>→</span>}
                <span
                  onClick={() => removeElement(i)}
                  className="selected-element"
                  style={{ backgroundColor: getColorForType(cycleTypeMap[el]) }}
                  title="Click to remove"
                >
                  {el}
                </span>
              </React.Fragment>
            ))}
      </div>

      {steps.length > 0 && (
        <div style={{ marginTop: '20px', fontSize: '0.95rem' }}>
          <h3>Step-by-step Computation</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {steps.map((s, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>
                {s.step === 1
                  ? `Step 1: ${s.value}`
                  : `Step ${s.step}: ${s.left} × ${s.right} = ${s.value}`}
              </li>
            ))}
          </ul>
          <div className="final-product-box">
            Final product: {finalProduct}
          </div>
        </div>
      )}
    </div>
  );
}

export default SGroupDetails;
