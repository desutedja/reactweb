import React from 'react'
import { useTable } from 'react-table'
import MoonLoader from "react-spinners/MoonLoader";
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight,
} from 'react-icons/fi'
import IconButton from './IconButton';
import Input from './Input';

function Component({ columns, data, loading, actions }) {
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
            {loading ? (
                <div className="Spinner">
                    <MoonLoader
                        size={24}
                        color={"silver"}
                        loading={loading}
                    />
                </div>
            ) :
                <>
                    <div className="TableAction">
                        {actions}
                    </div>
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
                            <IconButton className="PageControl">
                                <FiChevronsLeft />
                            </IconButton>
                            <IconButton className="PageControl">
                                <FiChevronLeft />
                            </IconButton>
                            <div className="PageInfo">
                                <button><p>1</p></button>
                                <p>of</p>
                                <p>300</p>
                            </div>
                            <IconButton className="PageControl">
                                <FiChevronRight />
                            </IconButton>
                            <IconButton className="PageControl">
                                <FiChevronsRight />
                            </IconButton>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Component;