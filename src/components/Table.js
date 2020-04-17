import React from 'react'
import { useTable } from 'react-table'
import { FiChevronsLeft, FiChevronLeft, FiChevronsRight, FiChevronRight } from 'react-icons/fi'

function Component({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
        <div className="Table">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="Pagination">
                <div className="Pagination-range">
                    <p>Show</p>
                    <select className="SelectRange">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={20}>50</option>
                        <option value={20}>100</option>
                    </select>
                    <p>pages</p>
                </div>
                <div className="Pagination-control">
                    <FiChevronsLeft className="PageControl"/>
                    <FiChevronLeft className="PageControl"/>
                    <button><p>1</p></button>
                    <p>of</p>
                    <p>300</p>
                    <FiChevronRight className="PageControl"/>
                    <FiChevronsRight className="PageControl"/>
                </div>
            </div>
        </div>
    )
}

export default Component;