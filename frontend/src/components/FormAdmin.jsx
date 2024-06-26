import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/formAdmin.module.css'

const FormAdmin = ({ user, setIsDeleted, getCurrentType }) => {
  const queryClient = useQueryClient();
  const form = useRef();
  const [userData, setUserData] = useState(user);

  const { mutate: deleteUserAPI } = useMutation({
    mutationFn: async data => await axios.delete(`/api/${getCurrentType()}/${user.id}`, data),
    onSuccess: res => {
      setIsDeleted(true);
      if (queryClient.getQueryData([res.data.type]).length === 1)
        queryClient.setQueryData([res.data.type], data => data.filter(data => data.id != user.id));
      queryClient.invalidateQueries([getCurrentType()]);
    },
    onError: res => { },
    retry: 3
  });
  const { mutate } = useMutation({
		mutationFn: async data => await axios.post(`/api/user/change?id=${user.id}&type=${user.type}`, data),
		onSuccess: res => {
			queryClient.invalidateQueries([user.type, user.id]);
		},
		onError: res => { },
		retry: 3
	});
  const getFormData = e => Object.fromEntries(new FormData(form.current).entries())
  const changeInput = e => setUserData(prev => prev && { ...prev, [e.target.name]: e.target.value });

  useEffect(e => {
    setUserData(user);
  }, [user])

  return (
    <div className={styles.container}>
        <form ref={form} onSubmit={e => e.preventDefault()}>
          <h1>Панел управления</h1>

          <label htmlFor="name">ФИО: <img src="/user.png" alt="" /></label>
          <input
            id='name'
            name='name'
            type="text"
            value={userData?.name || ''}
            placeholder='Фамилия Имя Отчество'
            onChange={changeInput}
            required
          />

          <label htmlFor="password">Пароль: <img src="/padlock.png" alt="" /></label>
          <input
            name='password'
            id='password'
            type="password"
            value={userData?.password || ''}
            placeholder='Пароль'
            onChange={changeInput}
            required
          />

          <div>
            <button disabled={!user} onClick={e => mutate(getFormData())}>Сохранить</button>
            <button type='button' className={styles.delete} disabled={!user} onClick={e => {
              setIsDeleted(true);
              deleteUserAPI();
            }}>Удалить</button>
          </div>
        </form>
    </div>
  )
}

export default FormAdmin