import React, { useEffect, useState } from 'react'
import { useTable, usePagination } from 'react-table'
import MoonLoader from "react-spinners/MoonLoader";
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight, FiSearch,
} from 'react-icons/fi'
import IconButton from './IconButton';
import Input from './Input';

function Component({
    columns,
    data,
    fetchData,
    filters,
    loading,
    pageCount: controlledPageCount,
    actions,
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        pageCount: controlledPageCount
    },
        usePagination
    );

    const [search, setSearch] = useState("");
    const [searchToggle, toggleSearch] = useState("");

    useEffect(() => {
        fetchData(pageIndex, pageSize, searchToggle);
    }, [fetchData, pageIndex, pageSize, searchToggle]);

    useEffect(() => {
        let searchTimeout = setTimeout(() => toggleSearch(search), 500);

        return () => {
            clearTimeout(searchTimeout);
        }
    }, [search])

    return (
        <div className="Table">
            <div className="TableAction">
                <div>
                    {actions}
                </div>
                <div className="TableAction-right">
                    {filters}
                    <div className="TableSearch">
                        <Input
                            label="Search"
                            compact
                            icon={<FiSearch />}
                            inputValue={search}
                            setInputValue={setSearch}
                        />
                    </div>
                </div>
            </div>
            <table {...getTableProps()}>
                {loading &&
                    <tbody className="TableLoading">
                        <tr className="Spinner">
                            <td><MoonLoader
                                size={24}
                                color={"grey"}
                                loading={loading}
                            />
                            </td>
                        </tr>
                    </tbody>
                }
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
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="Pagination">
                <div className="Pagination-range">
                    <p>Show</p>
                    <select
                        value={pageSize}
                        className="SelectRange"
                        onChange={e => setPageSize(e.target.value)}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <p>pages</p>
                </div>
                <div className="Pagination-control">
                    <IconButton
                        disabled={!canPreviousPage}
                        className="PageControl"
                        onClick={() => gotoPage(0)}
                    >
                        <FiChevronsLeft />
                    </IconButton>
                    <IconButton
                        disabled={!canPreviousPage}
                        className="PageControl"
                        onClick={() => gotoPage(pageIndex - 1)}
                    >
                        <FiChevronLeft />
                    </IconButton>
                    <div className="PageInfo">
                        <button>
                            <p>{pageIndex + 1}</p>
                        </button>
                        <p>of</p>
                        <p>{pageCount}</p>
                    </div>
                    <IconButton
                        disabled={!canNextPage}
                        className="PageControl"
                        onClick={() => gotoPage(pageIndex + 1)}
                    >
                        <FiChevronRight />
                    </IconButton>
                    <IconButton
                        disabled={!canNextPage}
                        className="PageControl"
                        onClick={() => gotoPage(pageCount - 1)}
                    >
                        <FiChevronsRight />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Component;