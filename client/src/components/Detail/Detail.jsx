import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { getBreedDetail, deleteDog } from '../../actions';
import s from "./Detail.module.css";
import "../Home/Loading.css";
import defaultImg from "../../images/defaultDog.png";
import { Link } from 'react-router-dom';

const isUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export default function Detail({ id, handleClose }) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getBreedDetail(id));
    // return dispatch(emptyDetail());
  }, [dispatch, id]);

  const b = useSelector(state => state.breedDetail);

  const handleUpdate = () => {

  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this dog breed?")) {
      dispatch(deleteDog(b.id));
      handleClose();
    }
  }

  return (
    <div className={s.popCard}>
      {typeof b !== "string" ?
        b.name ?
          <div className={s.allDetail}>
            <img src={b.image ? b.image : defaultImg} alt="Not found!" className={s.bigImage} />
            <div className={s.detailContent}>
              <h2>{b.name}</h2>
              <p className={s.textDetail}><b>Height:</b> {b.height ? b.height + " cm" : "Unknown"}</p>
              <p className={s.textDetail}><b>Weight:</b> {b.weight ? b.weight + " kg" : "Unknown"}</p>
              <p className={s.textDetail}><b>Life expectancy:</b> {b.life_span ? b.life_span + " years" : "Unknown"}</p>
              {b.temperaments?.length ?
                <p className={s.textDetail}><b>Temperaments:</b> {b.temperaments?.join(", ")}</p>
                : <p className={s.textDetail}>This dog breed doesn't have any temperaments.</p>
              }
              {isUUID.test(b.id) &&
                <div className={s.buttons}>
                  <Link to={`/modifyBreed/${b.id}`}><input type="button" value="Modify" onClick={handleUpdate} className={s.buttonDeleteUpdate} /></Link>
                  <input type="button" value="Delete" onClick={handleDelete} className={s.buttonDeleteUpdate} />
                </div>
              }
            </div>
          </div>
          : <div id="preloader"><div id="loader"></div></div>
        : <div>{b}</div>
      }
    </div>
  )
}





// export default function Detail() {

//   let dispatch = useDispatch();
//   const { id } = useParams();

//   React.useEffect(() => {
//     dispatch(getBreedDetail(id));
//     return dispatch(emptyDetail());
//   }, [dispatch, id]);

//   const b = useSelector(state => state.breedDetail);

//   return (
//     <div>
//       {typeof b !== "string" ?
//         b.name ? <div>
//           <h3>{b.name}</h3>
//           <img src={b.image} alt="not found!" />
//           <h4>{b.height}</h4>
//           <h4>{b.life_span}</h4>
//           <h4>{b.weight}</h4>
//           {b.temperaments?.map(t => <h4 key={t}>{t}</h4>)}
//         </div>
//           : <div id="preloader"><div id="loader"></div></div>
//         : <div>{b}</div>
//       }
//     </div>
//   )
// }