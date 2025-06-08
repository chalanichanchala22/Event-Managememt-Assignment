import React from 'react';
import '../App.css';

const Table = ({ headers, data, renderRow }) => {
  // Ensure headers and data are always arrays to avoid runtime errors
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeData = Array.isArray(data) ? data : [];

  // Default row renderer if none is provided
  const defaultRenderRow = (item, idx) => (
    <tr key={idx}>
      {Object.values(item).map((value, cellIdx) => (
        <td key={cellIdx}>{value}</td>
      ))}
    </tr>
  );

  const rowRenderer = renderRow || defaultRenderRow;

  return (
    <table className="table">
      <thead>
        <tr>
          {safeHeaders.map((head, idx) => (
            <th key={idx}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {safeData.length > 0 ? (
          safeData.map(rowRenderer)
        ) : (
          <tr>
            <td colSpan={safeHeaders.length || 1} className="table-no-data">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
