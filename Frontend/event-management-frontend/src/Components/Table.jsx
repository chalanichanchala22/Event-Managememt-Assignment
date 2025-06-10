import '../Styles/Table.css';

function Table({ headers, data, renderRow, isFiltering }) {
  // Ensure data is an array 
  const tableData = Array.isArray(data) ? data : [];
  
  return (
    <div className="table-container">
      {isFiltering && <div className="filter-indicator">Showing filtered results</div>}
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="table-no-data">
                {isFiltering ? 'No events match your filters' : 'No data available'}
              </td>
            </tr>
          ) : (
            tableData.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;