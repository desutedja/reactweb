import React, { useEffect, useState } from 'react'
import AnimatedNumber from "animated-number-react";
import { useTable, useExpanded, usePagination } from 'react-table'
import ClinkLoader from './ClinkLoader';
import {
    FiChevronsLeft, FiChevronLeft,
    FiChevronsRight, FiChevronRight, FiSearch,
    FiChevronDown, FiChevronUp, FiTrash, FiMoreHorizontal,
    FiEdit, FiCheck, FiUserPlus, FiMessageSquare, FiFilter, FiList, FiArrowDown, FiArrowUp, FiPlus, FiX, FiCalendar, FiStopCircle, FiStar,
} from 'react-icons/fi'
import {
    FaCaretRight, FaCaretDown, FaStar,
} from 'react-icons/fa'
import IconButton from './IconButton';
import Input from './Input';
import InputDash from './InputDash';
import Modal from './Modal';
import FilterButton from './FilterButton';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toSentenceCase, monthEnd, monthStart } from '../utils';

import Button from "../components/Button";

const formatValue = (value) => value.toFixed(0);

function Table({
    noSearch = false,
    expander = true,
    tableAction = true,
    pagination = true,
    columns,
    data,
    dataTotalTasks,
    totalItems,
    fetchData,
    filters = [],
    loading,
    pageCount: controlledPageCount,
    actions = [],
    actionDownloads = [],
    filterExpanded=false,
    onClickChat,
    onClickReassign,
    onClickResolve,
    onClickDelete,
    onClickDetails,
    onClickEdit,
    onClickChange,
    onClickStop,
    onClickAddBilling,
    onClickApproved,
    onClickDisapproved,
    renderActions,
    deleteSelection,
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
        setPageSize,
        state: { 
            pageIndex,
            pageSize,
            selectedRowIds
        }
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        manualSorting: true,
        pageCount: controlledPageCount,
        autoResetPage: false,
        autoResetSelectedRows: true,
    },
        useExpanded,
        usePagination,
        hooks => {
            expander ?
            hooks.visibleColumns.push(columns => {
                return [
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
                    ...columns,
                ]
            })
        }
    );

    const [search, setSearch] = useState("");
    const [periode, setPeriode] = useState("all");
    const [searchToggle, toggleSearch] = useState("");

    const [activeFilter, setFilter] = useState(0);
    const [modalOpen, toggleModal] = useState(false);
    const [filter, toggleFilter] = useState(filterExpanded);

    const [sortField, setSortField] = useState('created_on');
    const [sortFieldInput, setSortFieldInput] = useState(sortField);
    const [sortType, setSortType] = useState('DESC');
    const [sortTypeInput, setSortTypeInput] = useState(sortType);
    const [sort, toggleSort] = useState(false);

    const [startDateTo, setStartDateTo] = useState(monthStart());
    const [endDateTo, setEndDateTo] = useState(monthEnd());
    const [loadings, setLoadings] = useState(false);

    useEffect(() => {
        fetchData && fetchData(search, periode, startDateTo, endDateTo,
            ...sortBy.length > 0 ? [sortField, sortType] : []);
    }, [fetchData, search, periode,startDateTo, endDateTo, sortField, sortType]);

    useEffect(() => {
        gotoPage(0);
    }, [fetchData, gotoPage, searchToggle]);

    useEffect(() => {
        let searchTimeout = setTimeout(() => toggleSearch(search), 1000);

        return () => {
            clearTimeout(searchTimeout);
        }
    }, [search])

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
            {tableAction && 
            <>
                
                <div className="col mt-2">
                    <h5>Overview</h5>
                </div>
                <div className="row no-gutters mt-2">
            <div className="Container-dashboard flex-column">
              <div className="row no-gutters">
                <div
                  className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap"
                  style={{ minWidth: 120 }}
                >
                  Periode Data
                </div>
                <div
                  className="col-sm-2 w-100"
                  style={{ minWidth: 170, marginBottom: 8 }}
                >
                   <InputDash
                    type="select"
                    options={[
                      { label: "Semua Data", value: "all" },
                      { label: "Berdasarkan Periode", value: "periode" },
                    ]}
                    inputValue={periode}
                    setInputValue={setPeriode}
                  />
                </div>
                </div>
                <div className="row no-gutters">
                {
                periode === "periode" ? (
                  <>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div
                            className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap"
                            style={{ minWidth: 120 }}
                          >
                            Periode Sekarang
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 240 }}>
                            <InputDash
                              type="date"
                              inputValue={startDateTo}
                              setInputValue={setStartDateTo}
                            />
                          </div>
                          <div
                            className="col-sm-1 mt-1 mr-5 text-nowrap"
                            style={{ maxWidth: 10 }}
                          >
                            s/d
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 240 }}>
                            <InputDash
                              type="date"
                              inputValue={endDateTo}
                              setInputValue={setEndDateTo}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-sm-2" style={{ minWidth: 150 }}>
                    {/* <InputDash
                      type="date"
                      inputValue={periodeTime}
                      setInputValue={setPeriodeTime}
                    /> */}
                  </div>
                )}
              </div>
            </div>
          </div>
                <div className="row no-gutters">
                    <div className="col">
                        <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={"https://yipy-assets.s3.ap-southeast-1.amazonaws.com/Assets+Staff+Performance/total-task.png"}
                                    width="40"
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Total Task
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={dataTotalTasks.total_tasks}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={"https://yipy-assets.s3.ap-southeast-1.amazonaws.com/Assets+Staff+Performance/completed-task.png"}
                                    width="40"
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Completed Task
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={dataTotalTasks.completed_tasks}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={"https://yipy-assets.s3.ap-southeast-1.amazonaws.com/Assets+Staff+Performance/incomplete-task.png"}
                                    width="40"
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Incomplete Task
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={dataTotalTasks.incomplete_tasks}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="TableActionRating">
                    <div style={{
                        display: 'flex',
                    }}
                    >
                        {actions}
                        {renderActions != null ? renderActions(selectedRowIds, page) : []}
                    </div>
                </div>
            </>}
            <div className="TableActionRatingTop">
                <div className="TableAction-new d-flex align-items-center"><h4>Report Task</h4></div>
                    <div className="TableAction-new d-flex align-items-center">
                    {filters.length > 0 && (
                        <div
                        className="Button Download"
                        style={{
                            cursor: "pointer",
                            color: "white",
                        }}
                        onClick={() => {
                            toggleFilter(!filter);
                        }}
                        >
                        <b
                            style={{
                            marginRight: 16,
                            }}
                        >
                            Filter
                        </b>
                        {filter ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    )}
                    {sortBy.length > 0 && (
                        <div
                        className="Button Secondary"
                        style={{
                            cursor: "pointer",
                            marginRight: 8,
                        }}
                        onClick={() => {
                            toggleSort(!sort);
                        }}
                        >
                        <FiList />
                        <b
                            style={{
                            marginRight: 8,
                            marginLeft: 8,
                            }}
                        >
                            Sort by: {toSentenceCase(sortField)}
                        </b>
                        {sortType === "DESC" ? <FiArrowDown /> : <FiArrowUp />}
                        </div>
                    )}

                    {countactivefilter > 0 && (
                        <span style={{ paddingRight: "10px" }}>
                        {countactivefilter} filter{countactivefilter > 1 ? "s" : ""}{" "}
                        applied
                        </span>
                    )}

<div
                className="TableSearch d-flex align-items-center"
                style={{ marginLeft: "4px" }}
              >
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

                </div>
                {filters.length > 0 && (
                    <div className={"FilterContainerNew filter-right" + (filter ? " down" : "")}>
                    {filters.map(
                        (el, index) =>
                        !el.hidden && (
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
                            onClickDelete={el.delete}
                            />
                        )
                    )}
                    </div>
                )}
            <div className="d-flex col-12">
                
            
              </div>
            <div className="Table-content scroller">
                <table {...getTableProps()}>
                    {loadings &&
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
                            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                                {headerGroup.headers.map((column, i) => (
                                    <th {...column.getHeaderProps()} key={i}><div className="TableHeader">
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
                                    (onClickChange ? {
                                        onClick: () => onClickChange(row.original),
                                        name: "Change",
                                        icon: <FiCalendar />,
                                    } : ""),
                                    (onClickStop ? {
                                        onClick: () => onClickStop(row.original),
                                        name: "Stop Promo",
                                        icon: <FiStopCircle />,
                                    } : ""),
                                    (onClickDelete ? {
                                        name: "Delete",
                                        onClick: () => onClickDelete(row.original),
                                        color: "Danger",
                                        icon: <FiTrash />,
                                    } : ""),
                                    (onClickApproved && !(row.original.approved_status == "approved" || row.original.approved_status == "disapprove") ? {
                                        name: "Approved",
                                        onClick: () => onClickApproved(row.original),
                                        color: "Details",
                                        icon: <FiCheck />,
                                    } : ""),
                                    (onClickDisapproved && !(row.original.approved_status == "approved" || row.original.approved_status == "disapprove") ? {
                                        name: "Disapprove",
                                        onClick: () => onClickDisapproved(row.original),
                                        color: "Danger",
                                        icon: <FiX />,
                                    } : ""),
                                ].filter(x => x !== "")

                                return (
                                    <>
                                        <tr {...row.getRowProps()} className={row.isSelected ? 'SelectedRow' : ''} key={i}>

                                            {row.cells.map((cell, i) => {
                                                return (
                                                    <td {...cell.getCellProps()} key={i}>{cell.render("Cell")}</td>
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
                        <p style={{
                            marginRight: 8,
                            marginLeft: 8,
                        }}>of</p>
                        <p>{pageCount ? pageCount : '1'}</p>
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
            </div>}
        </div>
    )
}

export default Table;
