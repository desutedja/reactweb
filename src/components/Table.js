import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table'
import MoonLoader from "react-spinners/MoonLoader";
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight, FiSearch,
    FiChevronDown, FiChevronUp, FiTrash, FiMoreHorizontal,
    FiEdit, FiCheck, FiUserPlus, FiMessageSquare,
} from 'react-icons/fi'
import IconButton from './IconButton';
import ActionButton from './ActionButton';
import Input from './Input';
import Modal from './Modal';
import Dropdown from './DropDown';
import FilterButton from './FilterButton';

function Component({
    columns,
    data,
    totalItems,
    fetchData,
    filters = [],
    loading,
    pageCount: controlledPageCount,
    actions = [],
    onClickChat,
    onClickReassign,
    onClickResolve,
    onClickDelete,
    onClickDetails,
    onClickEdit,
    renderActions,
    deleteSelection,
    onSelection,
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
        state: { pageIndex, pageSize, selectedRowIds }
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        pageCount: controlledPageCount,
        autoResetSortBy: false,
        autoResetPage: false,
        autoResetSelectedRows: true,
    },
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => {
                return [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <div>
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        Cell: ({ row }) => (
                            <div >
                                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        ),
                    },
                    ...columns,
                ]
            })
        }
    );

    const [search, setSearch] = useState("");
    const [searchToggle, toggleSearch] = useState("");

    const [activeFilter, setFilter] = useState(0);
    const [modalOpen, toggleModal] = useState(false);

    useEffect(() => {
        fetchData && fetchData(pageIndex, pageSize, searchToggle);
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

    useEffect(() => {
        const selectedRows = selectedRowIds ?
            Object.keys(selectedRowIds).map(el => page[el].original) : [];

        console.log(selectedRows);
        onSelection && onSelection(selectedRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, selectedRowIds]);

    return (
        <div className="Table">
            <Modal
                disableFooter={true}
                disableHeader={true}
                isOpen={modalOpen}
                toggle={() => { toggleModal(false) }}
            >
                {(filters.length > 0 && filters[activeFilter].component) ?
                    filters[activeFilter].component(toggleModal) : null}
            </Modal>
            <div className="TableAction">
                <div style={{
                    display: 'flex',
                }}>
                    {actions}
                    {renderActions != null ? renderActions(selectedRowIds, page) : []}
                </div>
                <div className="TableAction-right">
                    {
                        filters.map((el, index) => !el.hidden &&
                            <FilterButton
                                key={index}
                                label={el.label}
                                hideX={el.hidex}
                                onClick={() => {
                                    el.onClick && el.onClick();
                                    el.component && toggleModal(true);
                                    setFilter(index);
                                }}
                                onClickDelete={el.delete} />
                        )
                    }
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
                                        size={34}
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
                                        Actions
                            </th>}
                                </tr>
                            ))}
                        </thead>
                        {page.length === 0 ?
                        <tbody>
                            <tr>
                                <td colspan={ columns.length + 1 } style={{ textAlign: "center" }} >
                                    No items.
                                </td>
                            </tr>
                        </tbody> :
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);

                                const MenuActions = [
                                    (onClickChat ? {
                                        onClick: () => onClickChat(row.original),
                                        name: "Chat",
                                        icon: <FiMessageSquare />,
                                    } : ""),
                                    (onClickResolve ? {
                                        name: "Set As Resolved",
                                        onClick: () => onClickResolve(row.original),
                                        disabled: row.original.status === 'completed',
                                        icon: <FiCheck />,
                                    } : ""),
                                    (onClickReassign ? {
                                        name: "Assign Staff",
                                        onClick: () => onClickReassign(row.original),
                                        disabled: !(row.original.status === 'created' || row.original.status === 'rejected'),
                                        icon: <FiUserPlus />
                                    } : ""),
                                    (onClickDetails ? {
                                        onClick: () => onClickDetails(row.original),
                                        name: "Details",
                                        icon: <FiMoreHorizontal />,
                                    } : ""),
                                    (onClickEdit ? {
                                        onClick: () => onClickEdit(row.original),
                                        name: "Edit",
                                        icon: <FiEdit />,
                                    } : ""),
                                    (onClickDelete ? {
                                        name: "Delete",
                                        onClick: () => onClickDelete(row.original),
                                        color: "danger",
                                        icon: <FiTrash />,
                                    } : ""),
                                ].filter(x => x !== "")

                                return (
                                    <tr {...row.getRowProps()} className={row.isSelected ? 'SelectedRow' : ''} >

                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                            );
                                        })}

                                        {(MenuActions.length > 0) &&
                                            <td key={i}>
                                                <div style={{
                                                    display: 'flex',
                                                }}>
                                                    {(MenuActions.length > 2) ? (<Dropdown label="Actions" items={MenuActions} />) : (
                                                        MenuActions.map((item, key) =>
                                                            <ActionButton key={key} icon={item.icon} color={item.color}
                                                                onClick={item.onClick}>{item.name}
                                                            </ActionButton>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        }
                                    </tr>
                                );
                            })}
                        </tbody>
                        }
                    </table>
            </div>
            <div className="Pagination">
                <div className="Pagination-range">
                    <p><b>{totalItems} Results</b></p>
                    <p>Show: </p>
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
                        <p>{pageIndex + 1}</p>
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

const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        },
            [resolvedRef, indeterminate])

        return (
            <input type="checkbox" ref={resolvedRef} {...rest} />
        )
    }
);

export default Component;
