import React from 'react';
import s from "./Popup.module.css";
import Detail from '../Detail/Detail';

export default function Popup({handleClose, id}) {
    return (
        <div className={s.popupBox}>
            <div className={s.popbox}>
                <span className={s.closeIcon} onClick={handleClose}>x</span>
                <Detail id={id} handleClose={handleClose}/>
            </div>
        </div>
    )
}