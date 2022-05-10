import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBreeds, getAllTemperaments, emptyDetail } from "../../actions"
import Card from '../Card/Card';
import Search from '../Search/Search';
import Pages from '../Pages/Pages';
import s from "./Home.module.css";
import "./Loading.css";
import Popup from '../Popup/Popup';

export default function LandingPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [popup, setPopup] = React.useState({ renderPopup: false, id: "" });

    const loading = useSelector(state => state.loading);

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getAllBreeds());
        dispatch(getAllTemperaments());
    }, [dispatch, loading]);

    const breeds = useSelector(state => state.reRender ? state.allData : state.filteredBreeds);
    const lastPage = useSelector(state => state.lastPage);


    React.useEffect(() => {
        setCurrentPage(lastPage);
    }, [breeds, lastPage]);

    const breedsPerPage = 8;
    const indexOfFirst = breedsPerPage * (currentPage - 1);
    const indexOfLast = breedsPerPage * currentPage;
    const breedsToRender = breeds.slice(indexOfFirst, indexOfLast);

    const openPopup = (id) => {
        setPopup({ renderPopup: !popup.renderPopup, id: id })
    }

    const closePopup = () => {
        setPopup({ renderPopup: false, id: "" });
        dispatch(emptyDetail());
    }

    let dark = false;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dark = true;
    }

    return (
        <div className={dark ? `${s.background} ${s.dark}` : s.background}>
            <Search />
            {popup.renderPopup && <Popup id={popup.id} handleClose={closePopup} />}
            <Pages setCurrentPage={setCurrentPage} breedsPerPage={breedsPerPage} breedsNum={breeds.length} currentPage={currentPage} />
            <div className={s.cards}>
                {!loading ?
                    breedsToRender.length ?
                        breedsToRender?.map(b => {
                            return <Card key={b.id} id={b.id} name={b.name} image={b.image} weight={b.weight} temperaments={b.temperaments} openPopup={openPopup} />
                        })
                        : <p className={s.notFound}>No corresponding breed found!</p>
                    : <div id="preloader"><div id="loader"></div></div>
                }
            </div>
        </div>
    )
}
