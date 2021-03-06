import axios from "axios";
import URL_API from "../index.js";

export function getAllBreeds() {
    return (dispatch) => {
        fetch(`${URL_API}/dogs`)
            .then(r => r.json())
            .then(data => dispatch({ type: "GET_ALL_BREEDS", payload: data }))
            .catch(err => console.log(err.message))
    }
}

export function getBreedDetail(id) {
    return (dispatch) => {
        axios.get(`${URL_API}/dogs/${id}`)
            .then(r => r.data)
            .then(data => dispatch({ type: "GET_BREED_DETAILS", payload: data }))
            .catch(err => {
                err.response?.data === "Dog id not found!" ?
                    dispatch({ type: "GET_BREED_DETAILS", payload: "Breed not found!" })
                    : console.log(err.message)
            })
    }
}

export function getAllTemperaments() {
    return (dispatch) => {
        fetch(`${URL_API}/temperament`)
            .then(r => r.json())
            .then(data => dispatch({ type: "GET_ALL_TEMPERAMENTS", payload: data }))
            .catch(err => console.log(err.message))
    }
}

export function filterBreedsToRender(payload) {
    return { type: "FILTER_BREEDS_TO_RENDER", payload }
}

export function rememberPage(payload) {
    return { type: "REMEMBER_PAGE", payload }
}

export function createBreed(newBreed) {
    return (dispatch) => {
        axios.post(`${URL_API}/dog`, newBreed)
            .then(r => alert(r.data))
            .then(() => dispatch({ type: "RELOAD_HOME" }))
            .catch(err => {
                if (err.response?.status === 302) alert(err.response.data);
                else console.log(err.message);
            })
    }
}

export function emptyDetail() {
    return { type: "EMPTY_DETAIL" }
}

export function changeNewTemp() {
    return { type: "CHANGE_NEW_TEMP" }
}

export function deleteDog(id) {
    return (dispatch) => {
        axios.delete(`${URL_API}/dog/${id}`)
            .then(r => alert(r.data))
            .then(() => dispatch({ type: "RELOAD_HOME" }))
            .catch(err => {
                if (err.response?.status === 404) alert(err.response.data);
                else console.log(err.message);
            })
    }
}

export function updateBreed(newBreed, id) {
    return (dispatch) => {
        axios.put(`${URL_API}/dog/${id}`, newBreed)
            .then(r => alert(r.data))
            .then(() => dispatch({ type: "RELOAD_HOME" }))
            .catch(err => {
                if (err.response?.status === 404) alert(err.response.data);
                else console.log(err.message);
            })
    }
}