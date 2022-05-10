import React from 'react';
import { Link } from 'react-router-dom';
import s from "./LandingPage.module.css";

export default function LandingPage() {
    return (
        <div className={s.landing}>
            <h1 className={s.title}>Doogle</h1>
            <Link to='/home' >
                <button className={`${s.btnHover} ${s.color1}`}>
                    Woof
                </button>
            </Link>
        </div>
    )
};