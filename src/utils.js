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

            ifError(err);
        })
        .finally(() => {
            finallyDo();
        })
}