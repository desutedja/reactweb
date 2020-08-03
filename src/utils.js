import React from 'react';
import countries from './countries';
import { FiCalendar, FiClock } from 'react-icons/fi';
import moment from 'moment';

export const osType = [
    { label: 'Android', value: 'Android' },
    { label: 'iOS', value: 'iOS' }
]

export const genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
]

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const daysLabel = [
    {label: 'Sunday', value: 1},
    {label: 'Monday', value: 2},
    {label: 'Tuesday', value: 3},
    {label: 'Wednesday', value: 4},
    {label: 'Thursday', value: 5},
    {label: 'Friday', value: 6},
    {label: 'Saturday', value: 7}
]

export const rangeNumberArrObj = (from = 0, to = 0) => {
    if (to <= from) return null;
    let arr = [];
    for (let i = from; i <= to; i++) {
        let n = i.toString();
        arr.push({
            label: n,
            value: n
        })
    }
    return arr;
}

export const rangeNumber = (from = 0, to = 0) => {
    if (to <= from) return null;
    let arr = [];
    for (let i = from; i <= to; i++) {
        let n = i.toString();
        n.length < 2 ? (n = '0' + n) : (n = i.toString())
        arr.push(n);
    }
    return arr;
}

export const yearsOnRange = (range) => {
    const currentYear = Number(new Date().getFullYear());
    const arrYears = [];
    for (let i = 0; i <= range * 2; i++) {
        arrYears.push({
            value: ((currentYear - range) + i).toString(),
            label: ((currentYear - range) + i).toString()
        })
    }
    return arrYears;
}

export const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

// all format is UTC with disguise as WIB (Z doesn't mean it's UTC)
export function dateTimeFormatterCell(serverDateTime, whenzero = '-') {
    if (!serverDateTime) return whenzero;
    if (serverDateTime === "0001-01-01T00:00:00Z")
        return whenzero;
    return <>
        <div style={{ display: 'block' }}>
            <div><FiCalendar /> {moment.utc(serverDateTime).format('D MMMM yyyy')} </div>
            <div><FiClock /> {moment.utc(serverDateTime).format('HH:mm') + ' WIB'} </div>
        </div>
    </>;
}

// all format is UTC with disguise as WIB (Z doesn't mean it's UTC)
export function dateTimeFormatter(serverDateTime, whenzero = '-') {
    if (!serverDateTime) return whenzero;
    if (serverDateTime === "0001-01-01T00:00:00Z") return whenzero;

    return moment.utc(serverDateTime).format('D MMMM yyyy') + " " +
        moment.utc(serverDateTime).format('HH:mm') + ' WIB';
}

// all format is UTC with disguise as WIB (Z doesn't mean it's UTC)
export function timeFormatter(serverDateTime, whenzero = '-', plusHour = 0) {
    if (!serverDateTime) return whenzero;
    if (serverDateTime === "0001-01-01T00:00:00Z")
        return whenzero;

    return moment.utc(serverDateTime).format('HH:mm')  + ' WIB';
}

// all format is UTC with disguise as WIB (Z doesn't mean it's UTC)
export function dateFormatter(serverDateTime, whenzero = '-') {
    if (!serverDateTime) return whenzero;
    if (serverDateTime === "0001-01-01T00:00:00Z")
        return whenzero;

    return moment.utc(serverDateTime).format('D MMMM yyyy');
}

export function getDatesRange(startDate, stopDate, range = 'days') {
    const dateArray = [];
    let currentDate = moment(startDate);
    stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD HH:mm:ss') )
        currentDate = moment(currentDate).add(1, range);
    }
    return dateArray;
}

export function toSentenceCase(sentence) {
    if (!sentence) return '-';
    let words = sentence.replace(/_/g, ' ').split(' ');

    return words.reduce((result, el) => {
        let newEl = el.slice(0, 1).toUpperCase() + el.slice(1) + ' ';
        return result + newEl;
    }, '')
}

export function toMoney(money) {
    money = Math.floor(money);
    return "Rp " + (!money ? "0" : money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")) + ',00';
}

export function removeLastFromPath(path, lastn = 1) {
    var newpath = path.split("/")
    do {
        newpath.pop()
        lastn--;
    } while (newpath.length > 0 && lastn > 0);
    return newpath.join("/")
}

export function getCountryCode(country) {
    const c = countries.find((el) => el.label === country)
    return c === undefined ? "-" : c.value
}

export function getCountryFromCode(value) {
    const c = countries.find((el) => el.value === value)
    return c === undefined ? "-" : c.label
}

export function getBank(value, banks) {
    const c = banks.find((el) => el.value === value)
    return c === undefined ? "-" : c.label
}

export function toEllipsis(value, limit) {
    return value.slice(0, limit - 1) + '...'
}

export function staffRoleFormatter(role) {
    return role === "pic_bm" ? "PIC BM " :
           role === "gm_bm" ? "GM BM " :
           toSentenceCase(role);
}

export function isToday(momentDate) {
    const a = moment()
    return a.isSame(moment(momentDate).format('yyyy-MM-DD'), 'day');
}

export function isRangeToday(start, end) {
    return (start === end) && isToday(start);
}
