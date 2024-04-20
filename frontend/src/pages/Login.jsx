import React from 'react'
import styles from 'styles/formStyle.module.css'

const Login = () => {
  return (
    <div className={styles.container}>
      <form>
        <div>
          <h1>Вход</h1>

          <label htmlFor="name">ФИО: <img src="/user.png" alt="" /></label>
          <input name='name' type="text" placeholder='Фамилия Имя Отчество' required />

          <label htmlFor="password">Пароль: <img src="/padlock.png" alt="" /></label>
          <input name='password' type="password"placeholder='Пароль' required />

          <button>Войти</button>
        </div>

        <img src="/imageAddition.png" alt="" />
      </form>
    </div>
  )
}

export default Login