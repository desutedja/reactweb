import React, { useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { post } from '../slice';
import { refresh } from '../slices/task';
import { task_types, endpointTask } from '../../settings';
import { toSentenceCase } from '../../utils';
import { FiChevronDown } from 'react-icons/fi';

import Breadcrumb from '../../components/Breadcrumb';

const task_categories = [
    {label: '⚡ Electricity', value: 'electricity'},
    {label: '👨‍🔧 Plumbing', value: 'plumbing'},
    {label: 'others', value: 'others'},
]
const task_priorities = [
    {label: 'Low', value: 'low'},
    {label: 'Normal', value: 'normal'},
    {label: 'High', value: 'high'}
]

export default function Component() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { path } = useRouteMatch();
    const { unit } = useSelector(state => state.building);

    //! must contain integer!
    const [unitValue, setUnitValue] = useState('');

    const [units, setUnits] = useState(unit.items || []);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'low',
        
        // integer
        building_unit_id: '',
        task_type: '',
        category: ''
    })

    useEffect(() => {
        const condition = new RegExp(unitValue.toString())
        setUnits(unit.items.filter(u => (
                condition.test(u.section_type + ' ' + u.number) ||
                condition.test(u.section_type + ' ' + u.section_name + ' ' + u.number)
            )
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unitValue])

    return (
        <>
            <Breadcrumb title={toSentenceCase(path.split('/').reverse()[0])} />
            <div className="Container scroller">
                <div className="row justify-content-center w-100 no-gutters">
                    <div className="col-12 col-md-6">
                        <form
                            className="text-left py-5"
                            onSubmit={e => {
                                e.preventDefault();
                                const url = endpointTask + '/admin/create';
                                console.log(taskData)
                                dispatch(post(url, taskData,
                                    res => {
                                        console.log(res);
                                        dispatch(refresh())
                                        history.push('/bm/task');
                                    }
                                ))
                            }}
                        >
                            <SelectOption
                                className="mb-4"
                                label="Unit"
                                placeholder="Select Unit"
                                options={units}
                                value={unitValue}
                                onChange={e => {
                                    setUnitValue(e.target.value)
                                }}
                                optionClick={el => {
                                    setTaskData({
                                        ...taskData,
                                        building_unit_id: Number(el.id)
                                    })
                                    setUnitValue(el.section_type + ' ' + el.section_name + ' ' + el.number)
                                }}
                            />
                            <Radio
                                className="mb-4"
                                label="Type"
                                options={task_types}
                                optionClick={el => {
                                    el.value === 'service' ?
                                    setTaskData({
                                        ...taskData,
                                        task_type: el.value
                                    }) :
                                    setTaskData({
                                        ...taskData,
                                        task_type: el.value,
                                        category: '-'
                                    })
                                }}
                            />
                            {taskData.task_type === 'service' && <Radio
                                className="mb-4"
                                label="Category"
                                options={task_categories}
                                optionClick={el => {
                                    setTaskData({
                                        ...taskData,
                                        category: el.value
                                    })
                                }}
                            />}
                            <RadioBox
                                className="mb-4"
                                label="Priority"
                                options={task_priorities}
                                optionClick={el => {
                                    setTaskData({
                                        ...taskData,
                                        priority: el.value,
                                    })
                                }}
                                active={taskData.priority}
                            />
                            <OtherInput
                                className="mb-4"
                                label="Title"
                                type="text"
                                value={taskData.title}
                                onChange={(e) => {
                                    setTaskData({
                                        ...taskData,
                                        title: e.target.value
                                    })
                                }}
                                placeholder="Type title..."
                            />
                            <OtherInput
                                className="mb-4"
                                label="Description"
                                type="textarea"
                                value={taskData.description}
                                onChange={(e) => {
                                    setTaskData({
                                        ...taskData,
                                        description: e.target.value
                                    })
                                }}
                                placeholder="Type Description..."
                                rows="5"
                            />
                            <MultipleUpload
                                className="mb-4"

                            />
                            <div className="row no-gutters">
                                <div className="col-12 col-sm-3 col-md-4 col-lg-3 offset-sm-9 offset-md-8 offset-lg-9 no-gutters">
                                    <button className="btn btn-primary w-100">Add Task</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

const MultipleUpload = ({
    className = ''
}) => {
    return (
        <>
            <div className={"form-group " + (className && className)}>
            </div>
        </>
    )
}

const SelectOption = ({
    className, options, label = '',
    optionClick = null, ...rest
}) => {
    const [dropDown, setDropDown] = useState(false);
    return (
        <>
            <div className={"form-group " + (className && className)}>
                <label
                    htmlFor={label.toLowerCase()}
                    className="font-weight-bold cursor-pointer"
                >{label}</label>
                <div className="p-relative">
                    <input
                        id={label.toLowerCase()}
                        className="form-control py-4 pr-5 cursor-pointer"
                        onFocus={() => setDropDown(true)}
                        onBlur={() => {
                            setTimeout(() => setDropDown(false), 100)
                        }}
                        {...rest}
                    />
                    <div className={'icon' + (dropDown ? ' up' : '')}>
                        <label
                            className="m-0"
                            htmlFor={label.toLowerCase()}
                        >
                            <FiChevronDown />
                        </label>
                    </div>
                    <div
                        className={'custom-options' + (dropDown ? ' to-down' : '')}
                    >
                        <ul className="py-1 px-0 m-0">
                        {options.length >= 1 ? options.map(el => (
                            <li
                                className="no-list selectable px-3 py-2"
                                onClick={() => optionClick && optionClick(el)}
                            >
                                {el.section_type + ' ' + el.section_name + ' ' + el.number}
                            </li>
                        )) : (
                            <li
                                className="no-list selectable px-3 py-1"
                            >No Items</li>
                        )}
                        </ul>
                    </div>
                </div>
                {/* <small 
                    id="emailHelp" className="form-text text-danger p-0"
                >We'll never share your email with anyone else.</small> */}
            </div>
        </>
    )
}

const Radio = ({
    label = '', options = null, optionClick = null,
    className = ''
}) => {
    return (
        <>
            <div className={"form-group " + (className && className)}>
                <label className="font-weight-bold" htmlFor="">{label}</label>
                <div className="row no-gutters">
                    {options && options.map(el => (
                    <div class="form-check col-12 mb-2 col-sm col-md-3">
                        <input
                        className="form-check-input ml-0"
                        name={label}
                        type="radio"
                        id={el.label.toLowerCase()}
                        value={el.value}
                        onClick={() => optionClick && optionClick(el)}
                        />
                        <label
                        className="form-check-label mt-0 ml-4 cursor-pointer"
                        htmlFor={el.label.toLowerCase()}>
                            {el.label}
                        </label>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

const RadioBox = ({
    label = '', options = null, optionClick = null, className = '',
    active = ''
}) => {

    return (
        <>
            <div className={"form-group d-flex d-sm-inline-flex flex-column " + (className && className)}>
                <label className="font-weight-bold mb-2" htmlFor="">{label}</label>
                <div className="radio-boxes d-flex flex-column-reverse flex-sm-row w-100 w-sm-auto">
                    {options && options.map(el => (
                    <div class="radio-box w-100 w-sm-auto">
                        <input
                        className="form-check-input ml-0"
                        name={label}
                        type="radio"
                        id={el.label.toLowerCase()}
                        value={el.value}
                        onClick={() => optionClick && optionClick(el)}
                        />
                        <label
                        className={"form-check-label text-center w-100 " + (active === el.label.toLowerCase() ? active : '')}
                        htmlFor={el.label.toLowerCase()}>
                            {el.label}
                        </label>
                    </div>
                    ))}
                    <div className={"radio-indicator " + (active.length >= 1 ? active : '')}></div>
                </div>
            </div>
        </>
    )
}

const OtherInput = ({
    label = '', className = '', type = '', ...rest
}) => {
    return (
        <>
            <div className={"form-group " + className && className}>
                <label
                    htmlFor={label.toLowerCase()}
                    className="font-weight-bold cursor-pointer"
                >{label}</label>
                {type === 'text' ? <input
                    className="form-control py-4"
                    id={label.toLowerCase()}
                    type={type}
                    {...rest}
                /> : <textarea
                    style={{resize: 'none'}}
                    className="form-control"
                    id={label.toLowerCase()}
                    {...rest}
                >
                </textarea>}
                {/* <small
                    className="form-text text-danger"
                >We'll never share your email with anyone else.</small> */}
            </div>
        </>
    )
}
