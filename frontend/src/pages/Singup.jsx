import React from 'react'
// import Warn from 'components/Warn'
import { useAnimate } from 'framer-motion'
// import React, { useState } from 'react'
import styles from 'styles/formStyle.module.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Singup = () => {
    const handleSubmit = e => {
        e.preventDefault();

        mutate(Object.fromEntries(new FormData(e.target).entries()));
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div>
                    <h1>Регистрация</h1>

                    <label htmlFor="name">ФИО: <img src="/user.png" alt="" /></label>
                    <input id='name' type="text" placeholder='Фамилия Имя Отчество' required />

                    <label htmlFor="password">Пароль: <img src="/padlock.png" alt="" /></label>
                    <input id='password' type="password" placeholder='Пароль' required />

                    <label htmlFor="ConfirmPassword">Повторить пароль: <img src="/padlock.png" alt="" /></label>
                    <input id='password' type="ConfirmPassword" placeholder='Повторный пароль' required />

                    <motion.button whileTap={{ scaleX: .85, scaleY: .95 }}>Зарегистрироваться</motion.button>

                    <Link className={styles.linkReg} to='/'>Вернуться</Link>
                </div>

                <img src="/imageAddition.png" alt="" />

                {/* <Warn localRef={warn}>{warnText}</Warn> */}
            </form>
        </div>
    )
}

export default Singup