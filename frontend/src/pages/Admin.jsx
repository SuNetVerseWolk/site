import React, { useEffect, useMemo, useRef, useState } from 'react'
import { editor, textEditor, presContainer } from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import AsideBar from 'src/Layouts/AsideBar'
import styles from 'styles/presStyle.module.css';
import Popup from 'src/Layouts/Popup';
import FormAdmin from 'components/FormAdmin'

const Admin = ({ setUserInfo }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: teachers, isLoading: isTeachersLoading } = useQuery({
  	queryKey: ['teachers'],
  	queryFn: e => axios.get('/api/teachers').then(data => data.data)
  });
  const { data: students, isLoading } = useQuery({
  	queryKey: ['students'],
  	queryFn: e => axios.get(`/api/students`).then(data => data.data)
  });

  const { mutate: addUserAPI } = useMutation({
    mutationFn: async data => await axios.post(`/api/users?key=${import.meta.env.VITE_ADMIN_ID}`, data),
    onSuccess: res => {
      queryClient.invalidateQueries([res.data.type]);
    },
    onError: res => { },
    retry: 3
  });

  const exit = () => {
    setUserInfo('');

    localStorage.removeItem('info', '');
    navigate('/login');
  }

  return (
    <div className={presContainer}>
      <header>
        <h1>Админ</h1>

        <div>
          <div>
            <button className={styles.name}>
              Admin
            </button>
          </div>

          <motion.button className={styles.button} whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <AsideBar
          values={students}
          isLoading={isLoading}
        >
          <motion.button whileTap={{ scale: .9 }} onClick={e => addUserAPI({ type: 'students' })}>+</motion.button>
        </AsideBar>
        <div className={editor}>
          <FormAdmin />

          <AsideBar
            values={teachers}
            isLoading={isTeachersLoading}
          >
            <motion.button whileTap={{ scale: .9 }} onClick={e => addUserAPI({ type: 'teachers' })}>+</motion.button>
          </AsideBar>
        </div>
      </div>
    </div>
  )
}

export default Admin