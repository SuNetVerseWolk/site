import React from 'react'
import styles from 'styles/formAdmin.module.css'
import { motion } from 'framer-motion'

const FormAdmin = () => {
  return (
    <div className={styles.container}>
        <form>
          <h1>Панел управления</h1>

          <label htmlFor="name">ФИО: <img src="/user.png" alt="" /></label>
          <input name='name' id='name' type="text" placeholder='Фамилия Имя Отчество' required />

          <label htmlFor="password">Пароль: <img src="/padlock.png" alt="" /></label>
          <input name='password' id='password' type="password" placeholder='Пароль' required />

          {/* <motion.button className={styles.add} whileTap={{ scaleX: .85, scaleY: .95 }}>Добавить</motion.button>
          <motion.button className={styles.delete} whileTap={{ scaleX: .85, scaleY: .95 }}>Удалить</motion.button> */}

          <div>
            <button>Добавить</button>
            <button className={styles.delete}>Удалить</button>
          </div>
        {/* <Warn localRef={warn}>{warnText}</Warn> */}
        </form>
    </div>
  )
}

export default FormAdmin