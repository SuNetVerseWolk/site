import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from 'styles/presStyle.module.css'

const Materials = () => {
  return (
    <div className={styles.presContainer}>
      <header>
        <h1>Презентация</h1>

        <div>
          <p>Лу Луин Лоун</p>

          <button><img src="/exit.png" alt="..." /></button>
        </div>
      </header>
      
      <div>
        <div className={styles.asideBar}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          <button>+</button>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Materials