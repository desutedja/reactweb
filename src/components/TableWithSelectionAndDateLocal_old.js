import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { useTable, useExpanded, usePagination, useRowSelect, } from 'react-table'
import ClinkLoader from './ClinkLoader';
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight, FiSearch,
    FiChevronDown, FiChevronUp, FiTrash, FiMoreHorizontal,
    FiEdit, FiCheck, FiUserPlus, FiMessageSquare, FiFilter, FiList, FiArrowDown, FiArrowUp, FiPlus,
} from 'react-icons/fi'
import {
    FaCaretRight, FaCaretDown,
} from 'react-icons/fa'
import IconButton from './IconButton';
import Input from './Input';
import Modal from './Modal';
import FilterButton from './FilterButton';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toSentenceCase } from '../utils';
import moment from 'moment';
import DatePicker from 'react-datepicker';

function Component({
    expander = true,
    pagination = true,
    tableAction = true,
    columns,
    data,
    totalItems,
    fetchData,
    filters = [],
    filterExpanded = false,
    loading,
    pageCount: controlledPageCount,
    actions = [],
    onClickChat,
    onClickReassign,
    onClickResolve,
    onClickDelete,
    onClickDetails,
    onClickEdit,
    onClickAddBilling,
    renderActions,
    deleteSelection,
    onSelection,
    sortBy = []
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        visibleColumns,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        state: { selectedRowIds }
    } = useTable({
        columns,
        data,
        manualPagination: true,
        manualSorting: true,
        pageCount: controlledPageCount,
        autoResetPage: false,
        autoResetSelectedRows: true,
    },
        useExpanded,
        usePagination,
        useRowSelect,
        hooks => {
            expander ? 
            hooks.visibleColumns.push(columns => {
                return [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <div>
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        Cell: ({ row }) => {
                            // console.log(row.getToggleRowSelectedProps())
                            return (
                                <div >
                                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                                </div>
                            )
                        }
                    },
                    {
                        id: 'expander',
                        Header: () => null,
                        Cell: ({ row }) =>
                            row.original.expandable === true &&
                            (
                                <span {...row.getToggleRowExpandedProps()}>
                                    {row.isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                                </span>
                            ),
                    },
                    ...columns,
                ]
            }) :
            hooks.visibleColumns.push(columns => {
                return [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <div>
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        Cell: ({ row }) => {
                            // console.log(row.getToggleRowSelectedProps())
                            return (
                                <div >
                                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                                </div>
                            )
                        }
                    },
                    ...columns,
                ]
            })
        }
    );
    
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchToggle, toggleSearch] = useState("");


    const [activeFilter, setFilter] = useState(0);
    const [modalOpen, toggleModal] = useState(false);
    const [filter, toggleFilter] = useState(filterExpanded);

    const [sortField, setSortField] = useState('created_on');
    const [sortFieldInput, setSortFieldInput] = useState(sortField);
    const [sortType, setSortType] = useState('DESC');
    const [sortTypeInput, setSortTypeInput] = useState(sortType);
    const [sort, toggleSort] = useState(false);
    const [pageSize, setPageSize] = useState(() => {
        const savedSize = localStorage.getItem("page_size");
        const initialSize = savedSize;
        return initialSize || "10";
    });

    const [pageIndex, setPageIndex] = useState(() => {
        const savedSize = localStorage.getItem("page_index");
        const initialSize = savedSize;
        return initialSize || 0;
    });

    useEffect(() => {
        // storing input page size
        localStorage.setItem("page_size", pageSize);
      }, [pageSize]);
    useEffect(() => {
        // storing input page size
        localStorage.setItem("page_index", parseInt(pageIndex));
      }, [parseInt(pageIndex)]);

    useEffect(() => {
        fetchData && fetchData(parseInt(pageIndex), pageSize, searchToggle,moment(startDate).format('YYYY-MM-DD'),moment(endDate).format('YYYY-MM-DD'),
            ...sortBy.length > 0 ? [sortField, sortType] : []
        );
    }, [fetchData, parseInt(pageIndex), pageSize, searchToggle,moment(startDate).format('YYYY-MM-DD'),moment(endDate).format('YYYY-MM-DD'), sortField, sortType]);

    
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
            Object.keys(selectedRowIds).map(el => page[el] && page[el].original) : [];
        onSelection && onSelection(selectedRows);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, selectedRowIds]);

    const countactivefilter = filters.filter(el => !el.hidex).length

    return (
        <div className="Table">
            <Modal
                disableFooter={true}
                disableHeader={true}
                isOpen={modalOpen}
                toggle={() => { toggleModal(false) }}
            >
                {(filters.length > 0 && filters[activeFilter]) ?
                    filters[activeFilter].component(toggleModal) : null}
            </Modal>
            <Modal
                onClick={() => {
                    setSortField(sortFieldInput);
                    setSortType(sortTypeInput);
                    toggleSort(false);
                }}
                disableHeader={true}
                isOpen={sort}
                toggle={() => { toggleSort(false) }}
            >
                <Input label="Field" type="select" options={[
                    { label: 'Created On', value: 'created_on' },
                    ...sortBy.map(el =>
                        ({ label: toSentenceCase(el), value: el }))]} inputValue={sortField}
                    setInputValue={setSortFieldInput} />
                <Input label="Type" type="select" options={[
                    { label: 'Ascending', value: 'ASC' },
                    { label: 'Descending', value: 'DESC' },
                ]} inputValue={sortType} setInputValue={setSortTypeInput} />
            </Modal>
            {tableAction && <div className="TableAction">
                <div style={{
                    display: 'flex',
                }}>
                    {actions}
                    {renderActions != null ? renderActions(selectedRowIds, page) : []}
                </div>
                <div className="TableAction-right d-flex align-items-center">
                
                    <div className="TableDatePicker d-flex align-items-center">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        maxDate={endDate}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                    />
                    </div>
                    <div className="TableDatePicker d-flex align-items-center">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={startDate}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                    />
                    </div>
                    {countactivefilter > 0 && <span style={{ paddingRight: '10px' }}>
                        {countactivefilter} filter{countactivefilter > 1 ? 's' : ''} applied
                    </span>}
                    
                    {filters.length > 0 && <div className="Button" style={{
                        cursor: 'pointer',
                        color: 'white',
                        marginRight: 8,
                    }} onClick={() => {
                        toggleFilter(!filter);
                    }}>
                        <FiFilter />
                        <b style={{
                            marginRight: 8,
                            marginLeft: 8,
                        }}>Filter</b>
                        {filter ? <FiChevronUp /> : <FiChevronDown />}
                    </div>}
                    {sortBy.length > 0 && <div className="Button Secondary" style={{
                        cursor: 'pointer',
                        marginRight: 8,
                    }} onClick={() => {
                        toggleSort(!sort);
                    }}>
                        <FiList />
                        <b style={{
                            marginRight: 8,
                            marginLeft: 8,
                        }}>Sort by: {toSentenceCase(sortField)}</b>
                        {sortType === 'DESC' ? <FiArrowDown /> : <FiArrowUp />}
                    </div>}
                    <div className="TableSearch d-flex align-items-center">
                        <Input
                            label="Search"
                            compact
                            fullwidth={true}
                            icon={<FiSearch />}
                            inputValue={search}
                            setInputValue={setSearch}
                        />
                    </div>
                </div>
            </div>}
            {filters.length > 0 && <div className={"FilterContainer" + (filter ? ' down' : '')}>
                {filters.map((el, index) => !el.hidden &&
                    <FilterButton
                        key={index}
                        label={el.label}
                        value={el.value}
                        hideX={el.hidex}
                        onClick={() => {
                            el.onClick && el.onClick();
                            el.component && toggleModal(true);
                            setFilter(index);
                        }}
                        onClickDelete={el.delete} />
                )}
            </div>}
            <div className="Table-content scroller">
                <table {...getTableProps()}>
                    {loading &&
                        <tbody className="TableLoading">
                            <tr className="Spinner">
                                <td>
                                    <ClinkLoader />
                                </td>
                            </tr>
                        </tbody>
                    }
                    <thead>
                        {headerGroups.map((headerGroup, i) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}><div className="TableHeader">
                                        {column.render('Header')}
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <FiChevronDown className="SortIcon" />
                                                : <FiChevronUp className="SortIcon" />
                                            : ''}
                                    </div>
                                    </th>
                                ))}
                                {(onClickDelete || onClickDetails || onClickEdit || onClickResolve) &&
                                    <th key={i} />}
                            </tr>
                        ))}
                    </thead>
                    {page.length === 0 ?
                        <tbody>
                            <tr>
                                <td colSpan={columns.length + 2} style={{ textAlign: "center" }} >
                                    No items.
                                </td>
                            </tr>
                        </tbody> :
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);

                                const MenuActions = [
                                    (onClickAddBilling ? {
                                        onClick: () => onClickAddBilling(row.original),
                                        name: "Add Billing",
                                        icon: <FiPlus />,
                                    } : ""),
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
                                        color: "Danger",
                                        icon: <FiTrash />,
                                    } : ""),
                                ].filter(x => x !== "")

                                return (
                                    <>
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
                                                        {/* <Dropdown label="Actions" items={MenuActions} /> */}
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle tag="span" className="More">
                                                                <FiMoreHorizontal style={{
                                                                    color: 'grey',
                                                                    fontSize: '1.2rem',
                                                                }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                {MenuActions.map((item, key) =>
                                                                    item.disabled ?
                                                                        null :
                                                                        <DropdownItem key={key} onClick={item.onClick}>
                                                                            {item.icon} {item.name}
                                                                        </DropdownItem>
                                                                )}
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                        {
                                            row.isExpanded ? <tr>
                                                <td className="SubRowComponent" colSpan={visibleColumns.length}>
                                                    {row.original.subComponent && row.original.subComponent(row.original)}
                                                </td>
                                            </tr> : null
                                        }
                                    </>
                                );
                            })}
                        </tbody>
                    }
                </table>
            </div>
            {pagination && <div className="Pagination">
                <div className="Pagination-range">
                    <p><b>{totalItems} Results</b></p>
                    <p style={{
                        marginLeft: 8,
                    }}>Show: </p>
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
                {parseInt(pageIndex) === 0 ?
                    <>
                        <IconButton
                            disabled={!canPreviousPage}
                            className="PageControl"
                            onClick={() => setPageIndex(0) && gotoPage(0)}
                        >
                            <FiChevronsLeft />
                        </IconButton>
                        <IconButton
                            disabled={!canPreviousPage}
                            className="PageControl"
                            onClick={() => setPageIndex(parseInt(pageIndex) - 1) && gotoPage(parseInt(pageIndex) - 1)}
                        >
                            <FiChevronLeft />
                        </IconButton>
                    </>
                    :
                    <>
                        <IconButton
                            className="PageControl"
                            onClick={() => setPageIndex(0) && gotoPage(0)}
                        >
                            <FiChevronsLeft />
                        </IconButton>
                        <IconButton
                            className="PageControl"
                            onClick={() => setPageIndex(parseInt(pageIndex) - 1) && gotoPage(parseInt(pageIndex) - 1)}
                        >
                            <FiChevronLeft />
                        </IconButton>
                    </>
                    }
                    <div className="PageInfo">
                        <p>{parseInt(pageIndex) + 1}</p>
                        <p style={{
                            marginRight: 8,
                            marginLeft: 8,
                        }}>of</p>
                        <p>{pageCount ? pageCount : '1'}</p>
                    </div>
                    {parseInt(pageIndex) === pageCount - 1 ?
                    <>
                        <IconButton
                            disabled={canNextPage}
                            className="PageControl"
                            onClick={() => setPageIndex(parseInt(pageIndex) + 1) && gotoPage(parseInt(pageIndex) + 1)}
                        >
                            <FiChevronRight />
                        </IconButton>
                        <IconButton
                            disabled={canNextPage}
                            className="PageControl"
                            onClick={() => setPageIndex(pageCount - 1) && gotoPage(pageCount - 1)}
                        >
                            <FiChevronsRight />
                        </IconButton>
                    </>
                    :
                    pageCount === 1 ?
                    <>
                        <IconButton
                            disabled={!canNextPage}
                            className="PageControl"
                            onClick={() => setPageIndex(parseInt(pageIndex) + 1) && gotoPage(parseInt(pageIndex) + 1)}
                        >
                            <FiChevronRight />
                        </IconButton>
                        <IconButton
                            disabled={!canNextPage}
                            className="PageControl"
                            onClick={() => setPageIndex(pageCount - 1) && gotoPage(pageCount - 1)}
                        >
                            <FiChevronsRight />
                        </IconButton>
                    </>
                    :
                    <>
                        <IconButton
                            className="PageControl"
                            onClick={() => setPageIndex(parseInt(pageIndex) + 1) && gotoPage(parseInt(pageIndex) + 1)}
                        >
                            <FiChevronRight />
                        </IconButton>
                        <IconButton
                            className="PageControl"
                            onClick={() => setPageIndex(pageCount - 1) && gotoPage(pageCount - 1)}
                        >
                            <FiChevronsRight />
                        </IconButton>
                    </>
                    }
                </div>
            </div>}
        </div>
    )
}

const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef

        // console.log('LOG', resolvedRef)


        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <input type="checkbox" ref={resolvedRef} {...rest} />
        )
    }
);

export default Component;
