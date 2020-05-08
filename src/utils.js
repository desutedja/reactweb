import Axios from "axios";

export function get(
    link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
    Axios.get(link, {
        headers: headers
    })
        .then(res => {
            console.log(res);

            ifSuccess(res);
        })
        .catch(err => {
            console.log(err);
            alert(err.response?.data.error_message);

            ifError(err);
        })
        .finally(() => {
            finallyDo();
        })
}

export function post(
    link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
    Axios.post(link, data, {
        headers: headers
    })
        .then(res => {
            console.log(res);

            ifSuccess(res);
        })
        .catch(err => {
            console.log(err);
            alert(err.response?.data.error_message);

            ifError(err);
        })
        .finally(() => {
            finallyDo();
        })
}

export function put(
    link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
    Axios.put(link, data, {
        headers: headers
    })
        .then(res => {
            console.log(res);

            ifSuccess(res);
        })
        .catch(err => {
            console.log(err);
            alert(err.response?.data.error_message);

            ifError(err);
        })
        .finally(() => {
            finallyDo();
        })
}

export function del(
    link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
    Axios.delete(link, {
        headers: headers
    })
        .then(res => {
            console.log(res);

            ifSuccess(res);
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data.error_message);

            ifError(err);
        })
        .finally(() => {
            finallyDo();
        })
}

export function dateTimeFormatter(serverDateTime) {
    let date = serverDateTime.split('T')[0];
    let time = serverDateTime.split('T')[1].split('Z')[0];
  
    let year = date.split('-')[0];
    let month = parseInt(date.split('-')[1], 10);
    let day = date.split('-')[2];
  
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    return day + ' ' + months[month - 1] + ' ' + year + ', ' + time + ' WIB';
  }

export function dateFormatter(serverDateTime) {
    let date = serverDateTime.split('T')[0];
    let time = serverDateTime.split('T')[1].split('Z')[0];
  
    let year = date.split('-')[0];
    let month = parseInt(date.split('-')[1], 10);
    let day = date.split('-')[2];
  
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    return day + ' ' + months[month - 1] + ' ' + year;
  }
