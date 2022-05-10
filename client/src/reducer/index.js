const isUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const initialState = {
    allData: [],
    filteredBreeds: [],
    breedDetail: {},
    temperaments: [],
    filters: { name: "", temperaments: [], apiOrDb: "apiAndDb", nameWeight: "no", invertOrder: "Asc." },
    reRender: true,
    lastPage: 1,
    loading: true,
    newTemp: false,
}

export default function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case "GET_ALL_BREEDS":
            return {
                ...state,
                allData: payload,
                loading: false,
            }
        case "GET_BREED_DETAILS":
            return {
                ...state,
                breedDetail: payload,
            }
        case "GET_ALL_TEMPERAMENTS":
            return {
                ...state,
                temperaments: payload,
            }
        case "FILTER_BREEDS_TO_RENDER":
            let toFilter = [...state.allData];
            const { name, temperaments, apiOrDb, nameWeight, invertOrder } = payload;

            if (name) toFilter = toFilter.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));

            if (apiOrDb !== "apiAndDb") {
                toFilter = apiOrDb === "db" ? toFilter.filter(b => isUUID.test(b.id)) : toFilter.filter(b => !isUUID.test(b.id));
            }

            if (temperaments?.length) toFilter = toFilter.filter(b => temperaments.filter(t => b.temperaments?.includes(t)).length === temperaments.length);

            if (nameWeight === "name") {
                toFilter.sort((a, b) => a.name.toLowerCase() >= b.name.toLowerCase() ? 1 : -1);
            } else if (nameWeight === "weight") {
                toFilter.sort((a, b) => {
                    let first = a.weight.split(" - ");
                    let second = b.weight.split(" - ");

                    if (first.length === 2) first = (parseInt(first[0]) + parseInt(first[1])) / 2;
                    else if (first[0] === "") first = Infinity;
                    else first = parseInt(first[0]);

                    if (second.length === 2) second = (parseInt(second[0]) + parseInt(second[1])) / 2;
                    else if (second[0] === "") second = Infinity;
                    else second = parseInt(second[0]);

                    return first - second;
                });
            }

            if (invertOrder === "Desc.") toFilter.reverse();

            return {
                ...state,
                filteredBreeds: toFilter,
                filters: payload,
                reRender: false,
                lastPage: 1,
            }
        case "REMEMBER_PAGE":
            return {
                ...state,
                lastPage: payload,
            }
        case "RELOAD_HOME":
            return {
                ...state,
                filters: { name: "", temperaments: [], apiOrDb: "apiAndDb", nameWeight: "no", invertOrder: "Asc." },
                reRender: true,
                lastPage: 1,
                newTemp: true,
                loading: true,
            }
        case "EMPTY_DETAIL":
            return {
                ...state,
                breedDetail: {},
            }
        case "CHANGE_NEW_TEMP":
            return {
                ...state,
                newTemp: false,
            }
        default:
            return { ...state }
    }
}
