import React from 'react';
// import { NavLink } from 'react-router-dom';
import s from "./Card.module.css";
import defaultImg from "../../images/defaultDog.png";

export default function Card({ id, name, weight, image, temperaments, openPopup }) {

  return (
    <div className={s.card} onClick={() => openPopup(id)}>
      <img src={image ? image : defaultImg} alt="Not found!" className={s.image} />
      <div>
        <h3 className={s.name}>{name}</h3>
        {weight ?
          <p><b>Weight:</b> {weight} kg</p>
          : <p>The weight of this dog breed is unknown.</p>
        }
        {temperaments?.length ?
          <p><b>Temperaments:</b> {temperaments?.join(", ")}</p>
          : <p>This dog breed doesn't have any temperaments.</p>
        }
      </div>
    </div>
  )
}




// export default function Card({ id, name, weight, image, temperaments }) {
//   return (
//     <NavLink to={`/details/${id}`} className="link">
//       <div className="card">
//         <img src={image ? image : defaultImg} alt="Not found!" className="image" />
//         <div>
//           <h3 className="name">{name}</h3>
//           {weight ?
//             <p><b>Weight:</b> {weight} kg</p>
//             : <p>The weight of this dog breed is unknown.</p>
//           }

//           {temperaments?.length ?
//             <p><b>Temperaments:</b> {temperaments?.join(", ")}</p>
//             : <p>This dog breed doesn't have any temperaments.</p>
//           }
//         </div>
//       </div>
//     </NavLink>
//   )
// } 