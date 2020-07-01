import countries from './countries';
import { banks } from './settings';

export const yearsRentangDepanBelakang = (rentang) => {
    const currentYear = Number(new Date().getFullYear());
    const arrYears = [];
    for (let i = 0; i <= rentang * 2; i++) {
        arrYears.push({
            value: i + 1,
            label: (currentYear - rentang) + i
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

export function dateTimeFormatter(serverDateTime) {
    let date = serverDateTime.split('T')[0];
    let time = serverDateTime.split('T')[1].split('Z')[0];
    time = time.split(':').slice(0, 2).join(':');

    let year = date.split('-')[0];
    let month = parseInt(date.split('-')[1], 10);
    let day = date.split('-')[2];

    return day + ' ' + months[month - 1].label + ' ' + year + ', ' + time + ' WIB';
}

export function dateFormatter(serverDateTime) {
    let date = serverDateTime.split('T')[0];

    let year = date.split('-')[0];
    let month = parseInt(date.split('-')[1], 10);
    let day = date.split('-')[2];



    return day + ' ' + months[month - 1].label + ' ' + year;
}

export function toSentenceCase(sentence) {
    if (sentence.length < 3) {
        return sentence.toUpperCase();
    }

    let words = sentence.replace(/_/g, ' ').split(' ');

    return words.reduce((result, el) => {
        let newEl = el.slice(0, 1).toUpperCase() + el.slice(1) + ' ';
        return result + newEl;
    }, '')
}

export function toMoney(money) {
    return money === null || money === undefined ? "-" : "Rp " + money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}

export function getCountryCode(country) {
    const c = countries.find((el) => el.label === country)
    return c === undefined ? "Undefined Country Code" : c.value
}

export function getCountryFromCode(value) {
    const c = countries.find((el) => el.value === value)
    return c === undefined ? "Undefined Country" : c.label
}

export function getBank(value) {
    const c = banks.find((el) => el.value === value)
    return c === undefined ? "Undefined Bank" : c.label
}

export function toEllipsis(value, limit) {
    return value.slice(0, limit - 1) + '...'
}