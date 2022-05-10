import React from 'react';
import s from "./Search.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { filterBreedsToRender } from '../../actions';
const defaultFilters = { name: "", temperaments: [], apiOrDb: "apiAndDb", nameWeight: "no", invertOrder: "Asc." };

export default function Search() {
    const [filters, setFilters] = React.useState(defaultFilters);
    const [order, setOrder] = React.useState("Asc.");
    const dispatch = useDispatch();
    const temperaments = useSelector(state => state.temperaments);

    const oldFilters = useSelector(state => state.filters);
    React.useEffect(() => {
        setFilters(oldFilters);
    }, [oldFilters]);

    const handleFilterChange = (e) => {
        const newState = { ...filters, [e.target.name]: e.target.value };
        setFilters(newState);
        dispatch(filterBreedsToRender(newState));
    }

    const handleTempChange = (e) => {
        const newState = { ...filters };
        if (e.target.checked) {
            newState.temperaments.push(e.target.name);
        } else newState.temperaments = newState.temperaments.filter(t => t !== e.target.name);
        setFilters(newState);
        dispatch(filterBreedsToRender(newState));
    }

    const handleButton = (e) => {
        const newOrder = e.target.value === "Asc." ? "Desc." : "Asc.";
        const newState = { ...filters, invertOrder: newOrder };
        setOrder(newOrder);
        setFilters(newState);
        dispatch(filterBreedsToRender(newState));
    }

    const handleClear = () => {
        setFilters({ ...defaultFilters, temperaments: [] });
        setOrder("Asc.");
        dispatch(filterBreedsToRender({ ...defaultFilters, temperaments: [] }));
    }

    return (
        <div className={s.filters}>
            <input type="search" placeholder='Search breed by name...' name="name"
                value={filters.name} onChange={handleFilterChange}
                className={s.searchBar} autoComplete="off" />

            <div className={s.dropdown}>
                <button className={s.dropbtn}>Filter temperaments:</button>
                <div className={s.dropdownContent}>
                    {temperaments?.map(t =>
                        <div key={t} className={filters.temperaments.includes(t) ? `${s.temp} ${s.check}` : s.temp}>
                            <label className={s.checkbox}>
                                <input type="checkbox" name={t} checked={filters.temperaments.includes(t)} onChange={handleTempChange} />
                                {t}
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <select name="apiOrDb" onChange={handleFilterChange} value={filters.apiOrDb} className={s.bars}>
                <option value="apiAndDb">Created & Preloaded</option>
                <option value="db" >Created</option>
                <option value="api">Preloaded</option>
            </select>

            <select name="nameWeight" onChange={handleFilterChange} value={filters.nameWeight} className={`${s.bars} ${s.sortBy}`}>
                <option hidden>Sort by...</option>
                <option value="name">Name</option>
                <option value="weight">Weight</option>
            </select>

            <input type="button" name="invertOrder" value={order} onClick={handleButton} className={s.button} />

            <input type="button" value="Clear" onClick={handleClear} className={`${s.button} ${s.clear}`} />
        </div>
    )
}