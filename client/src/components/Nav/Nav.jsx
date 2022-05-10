import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import s from "./Nav.module.css";
import logo from "../../images/dogLogo.png";

export default function Nav() {
  return (
    <div>
      <div className={s.navBar}>
        <NavLink to="/" className={s.logoBox}><img src={logo} alt="Logo" className={s.logo}/></NavLink>
        <NavLink to="/home" className={navdata => navdata.isActive ? `${s.homeLink} ${s.active}` : s.homeLink}>Home</NavLink>
        <NavLink to="/breedCreation" className={navdata => navdata.isActive ? `${s.create} ${s.active}` : s.create}>Create breed</NavLink>
      </div>
      <Outlet />
    </div>
  )
}
