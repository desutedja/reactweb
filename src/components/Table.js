import React, { useEffect, useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import MoonLoader from "react-spinners/MoonLoader";
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight, FiSearch, FiChevronDown, FiChevronUp, FiTrash, FiMoreHorizontal, FiPenTool, FiEdit, FiCheck, FiUserPlus,
} from 'react-icons/fi'
import IconButton from './IconButton';
import Input from './Input';
import Modal from './Modal';

function Component({
    columns,
    data,
    fetchData,
    filters,
    loading,
    pageCount: controlledPageCount,
    actions,
    onClickReassign,
    onClickResolve,
    onClickDelete,
    onClickDetails,
    onClickEdit,
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
        pageCount: controlledPageCount,
        autoResetSortBy: false,
        autoResetPage: false,
    },
        useSortBy,
        usePagination,
    );

    const [search, setSearch] = useState("");
    const [searchToggle, toggleSearch] = useState("");

    const [activeFilter, setFilter] = useState(0);
    const [modalOpen, toggleModal] = useState(false);

    useEffect(() => {
        fetchData(pageIndex, pageSize, searchToggle);
    }, [fetchData, pageIndex, pageSize, searchToggle]);

    useEffect(() => {
        gotoPage(0);
    }, [fetchData, gotoPage, searchToggle]);

    useEffect(() => {
        let searchTimeout = setTimeout(() => toggleSearch(search), 500);

        return () => {
            clearTimeout(searchTimeout);
        }
    }, [search])

    return (
        <div className="Table">
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => toggleModal(false)}
            >
                {(filters.length > 0 && filters[activeFilter].component) ?
                    filters[activeFilter].component(toggleModal) : null}
            </Modal>
            <div className="TableAction">
                <div>
                    {actions}
                </div>
                <div className="TableAction-right">
                    {filters.map((el, index) => <div key={index} onClick={() => {
                        el.component && toggleModal(true);
                        setFilter(index);
                    }}>
                        {el.button}
                    </div>)}
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
            <div className="Table-content">
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
                        {headerGroups.map((headerGroup, i) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}><div className="TableHeader">
                                            {column.render('Header')}
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <FiChevronDown className="SortIcon" />
                                                    : <FiChevronUp className="SortIcon" />
                                                : ''}
                                        </div>
                                    </th>
                                ))}
                                {(onClickDelete || onClickDetails || onClickEdit || onClickResolve) && <th key={i}>
                                    Options
                            </th>}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                >
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                    {(onClickDelete || onClickDetails || onClickEdit || onClickResolve) && <td key={i}>
                                        <div style={{
                                            display: 'flex',
                                        }}>
                                            {onClickReassign && <IconButton disabled={(row.original.status !== 'created')
                                                && (row.original.status !== 'rejected')}
                                                onClick={() => onClickReassign(row.original)}>
                                                <FiUserPlus />
                                            </IconButton>}
                                            {onClickResolve && <IconButton disabled={row.original.status === 'completed'} onClick={() => onClickResolve(row.original)}>
                                                <FiCheck />
                                            </IconButton>}
                                            {onClickDetails && <IconButton onClick={() => onClickDetails(row.original)}>
                                                <FiMoreHorizontal />
                                            </IconButton>}
                                            {onClickEdit && <IconButton onClick={() => onClickEdit(row.original)}>
                                                <FiEdit />
                                            </IconButton>}
                                            {onClickDelete && <IconButton onClick={() => onClickDelete(row.original)}>
                                                <FiTrash />
                                            </IconButton>}
                                        </div>
                                    </td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
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