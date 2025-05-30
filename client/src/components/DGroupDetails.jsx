import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Welcome.css';
import DihedralVisualizer from './DihedralVisualizer.jsx';

function DGroupDetails() {
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

  const formatElement = (el) => {
    const sup = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³',
      '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
      '8': '⁸', '9': '⁹'
    };
    if (el === 'e' || el === 's') return el;
    if (el.startsWith('sr')) {
      const exp = el.slice(2);
      return 'sr' + [...exp].map(c => sup[c] || c).join('');
    }
    if (el.startsWith('r')) {
      const exp = el.slice(1);
      return 'r' + [...exp].map(c => sup[c] || c).join('');
    }
    return el;
  };

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
    if (!group.members.includes(current)) return steps;

    steps.push({ step: 1, value: current });

    for (let i = 1; i < selectedElements.length; i++) {
      const left = current;
      const right = selectedElements[i];

      const iIdx = group.members.indexOf(left);
      const jIdx = group.members.indexOf(right);

      if (iIdx === -1 || jIdx === -1) {
        steps.push({
          step: i + 1,
          value: '?',
          left,
          right,
          error: true
        });
        break;
      }

      const result = group.cayleyTable[iIdx][jIdx];
      steps.push({
        step: i + 1,
        value: result,
        left,
        right
      });
      current = result;
    }

    return steps;
  };

  const steps = computeSteps();
  const finalProduct =
    steps.length && !steps.some((s) => s.error) ? steps[steps.length - 1].value : '?';

  const makeDraggable = (el) => ({
    draggable: true,
    onDragStart: (e) => e.dataTransfer.setData('text/plain', el),
    onDragEnd: () => setDraggedElement(null),
    onDrag: () => setDraggedElement(el)
  });

  const removeElement = (index) => {
    setSelectedElements((prev) => prev.filter((_, i) => i !== index));
  };

  const orderedElements = group.members;

  return (
    <div className="details-container">
      <h1 className="details-header">
        {group.name.startsWith('D_') ? <span>D<sub>{group.name.slice(2)}</sub></span> : group.name}
      </h1>
      <p className="details-description">{group.description}</p>

      <h2>Cayley Table</h2>
      <table className="cayley-table">
        <thead>
          <tr>
            <th></th>
            {orderedElements.map((el, idx) => (
              <th key={idx} {...makeDraggable(el)} className="table-header-cell">
                {formatElement(el)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedElements.map((rowEl, i) => (
            <tr key={i}>
              <th {...makeDraggable(rowEl)} className="table-header-cell">
                {formatElement(rowEl)}
              </th>
              {orderedElements.map((colEl, j) => {
                const product = group.cayleyTable[i][j];
                const isIdentity = product === group.identity;
                return (
                  <td key={j} className={`table-cell ${isIdentity ? 'identity' : ''}`}>
                    {formatElement(product)}
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
        className="drop-zone"
      >
        {selectedElements.length === 0
          ? 'Drag elements here to compose'
          : selectedElements.map((el, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ fontSize: '1.2rem' }}>×</span>}
                <span
                  onClick={() => removeElement(i)}
                  className="selected-element"
                  title="Click to remove"
                >
                  {formatElement(el)}
                </span>
              </React.Fragment>
            ))}
      </div>

      {steps.length > 0 && (
        <div style={{ display: 'flex', gap: '30px', marginTop: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>Polygon Visualizer</h2>
            <DihedralVisualizer n={group.members.length / 2} element={finalProduct} />
          </div>
          <div style={{ flex: 1, minWidth: '300px', fontSize: '0.95rem' }}>
            <h3>Step-by-step Computation</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {steps.map((s, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>
                  {s.step === 1
                    ? `Step 1: ${formatElement(s.value)}`
                    : s.error
                    ? `Step ${s.step}: Error composing ${formatElement(s.left)} × ${formatElement(s.right)}`
                    : `Step ${s.step}: ${formatElement(s.left)} × ${formatElement(s.right)} = ${formatElement(s.value)}`}
                </li>
              ))}
            </ul>
            <div className="final-product-box">
              Final product: {formatElement(finalProduct)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DGroupDetails;
