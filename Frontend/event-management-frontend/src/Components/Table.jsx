
import '../Styles/Table.css';

function Table({ headers, data, renderRow, isFiltering, totalCount, searchProps }) {
  
  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];
  // Calculate how many items are being filtered out
 

  return (
    <div className="table-wrapper">
      
           <table className="data-table">
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
                {isFiltering ? 'No items match your current filters' : 'No data available'}
              </td>
            </tr>
          ) : (
            tableData.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
      
      {isFiltering && (
        <div className="filter-results">
          Showing {data.length} of {totalCount} total events
        </div>
      )}
    </div>
  );
}

export default Table;
