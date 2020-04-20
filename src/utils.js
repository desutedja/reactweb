import Axios from "axios";

const staticHeaders = {
    'X-User-Type': 'sa',
}

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