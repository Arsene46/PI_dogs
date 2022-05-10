import React from 'react'
import { rememberPage } from '../../actions';
import { useDispatch } from 'react-redux';
import s from "./Pages.module.css";


export default function Pages({ setCurrentPage, breedsPerPage, breedsNum, currentPage }) {
    const pages = [];
    const previous = currentPage > 1;
    const dispatch = useDispatch();

    for (let i = 1; i <= Math.ceil(breedsNum / breedsPerPage); i++) {
        pages.push(i);
    }

    const next = currentPage < pages.length;

    // const localPages = (range) => {
    //     const local = [currentPage];
    //     for (let i = 1; i <= range; i++) {
    //         if (currentPage - i > 0) local.unshift(currentPage - i);
    //         if (currentPage + i <= pages.length) local.push(currentPage + i);
    //     }
    //     return local;
    // }
    const localPages = (amount) => {
        const local = [currentPage];
        let i = 1;
        while (local.length < amount && i < amount) {
            if (currentPage - i > 0) local.unshift(currentPage - i);
            if (currentPage + i <= pages.length) local.push(currentPage + i);
            i++;
        }
        return local;
    }

    const setPage = (e, p) => {
        setCurrentPage(p);
        dispatch(rememberPage(p));
    }

    const cuantityOfNum = () => {
        const numWidth = Math.floor(window.innerWidth / 100);
        if (numWidth >= 7) return 7
        if (numWidth <= 3) return 3
        return 5
    }

    return (
        <div className={s.pages}>
            <button onClick={(e) => setPage(e, 1)} disabled={!previous} className={previous ? s.otherpages : `${s.otherpages} ${s.current}`}>First</button>
            <button onClick={(e) => setPage(e, currentPage - 1)} disabled={!previous} className={previous ? s.numbers : `${s.numbers} ${s.current}`}>{"<-"}</button>
            {localPages(cuantityOfNum())?.map(p => <button key={p} onClick={(e) => setPage(e, p)} className={p === currentPage ? `${s.numbers} ${s.current}` : s.numbers}>{p}</button>)}
            <button onClick={(e) => setPage(e, currentPage + 1)} disabled={!next} className={next ? s.numbers : `${s.numbers} ${s.current}`}>{"->"}</button>
            <button onClick={(e) => setPage(e, pages.length)} disabled={!next} className={next ? s.otherpages : `${s.otherpages} ${s.current}`}>Last</button>
        </div>
    )
}

// export class Pages extends React.Component {

//     render() {
//         const currentPage= this.currentPage
//         const pages = [];
//         const previous = currentPage > 1;
//         const dispatch = useDispatch();

//         for (let i = 1; i <= Math.ceil(this.breedsNum / this.breedsPerPage); i++) {
//             pages.push(i);
//         }

//         const next = currentPage < pages.length;

//         const localPages = (amount) => {
//             const local = [currentPage];
//             let i = 1;
//             while (local.length < amount && i < amount) {
//                 if (currentPage - i > 0) local.unshift(currentPage - i);
//                 if (currentPage + i <= pages.length) local.push(currentPage + i);
//                 i++;
//             }
//             return local;
//         }

//         const setPage = (e, p) => {
//             this.setCurrentPage(p);
//             dispatch(rememberPage(p));
//         }

//         const cuantityOfNum = () => {
//             const numWidth = Math.floor(window.innerWidth / 100);
//             if (numWidth >= 7) return 7
//             if (numWidth <= 3) return 3
//             return 5
//         }


//         return (
//             <div className={s.pages}>
//                 <button onClick={(e) => setPage(e, 1)} disabled={!previous} className={previous ? s.otherpages : `${s.otherpages} ${s.current}`}>First</button>
//                 <button onClick={(e) => setPage(e, currentPage - 1)} disabled={!previous} className={previous ? s.numbers : `${s.numbers} ${s.current}`}>{"<-"}</button>
//                 {localPages(cuantityOfNum())?.map(p => <button key={p} onClick={(e) => setPage(e, p)} className={p === currentPage ? `${s.numbers} ${s.current}` : s.numbers}>{p}</button>)}
//                 <button onClick={(e) => setPage(e, currentPage + 1)} disabled={!next} className={next ? s.numbers : `${s.numbers} ${s.current}`}>{"->"}</button>
//                 <button onClick={(e) => setPage(e, pages.length)} disabled={!next} className={next ? s.otherpages : `${s.otherpages} ${s.current}`}>Last</button>
//             </div>
//         )
//     }
// }

// export const mapStateToProps = (state) => {
//     return { products: state.products }
// };

// export const mapDispatchToProps = (dispatch) => {
//     return { getAllProducts: () => dispatch(getAllProducts()) }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Home)
