import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import styles from 'styles/formStyle.module.css'

const Login = ({ setUserId }) => {
  const {mutate} = useMutation({
    mutationFn: data => axios.post('/api/logIn', data),
    onSuccess: res => {
      setUserId(res.data.id);
      localStorage.setItem('id', res.data.id);
    },
    onError: res => {}
  })

  const handleSubmit = e => {
    e.preventDefault();

    mutate(Object.fromEntries(new FormData(e.target).entries()));
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
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