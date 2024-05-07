import React from 'react'
import Warn from 'components/Warn'
import { useAnimate } from 'framer-motion'
import { useState } from 'react'
import styles from 'styles/formStyle.module.css'
import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import axios from 'axios'

const Singup = () => {
    const [isWarned, setIsWarned] = useState(true);
    const [warn, animateWarn] = useAnimate();
    const [warnText, setWarnText] = useState();
  
    const showWarn = async text => {
      if (isWarned) {
        setIsWarned(false);
        setWarnText(text);
  
        await animateWarn(warn.current, { y: '100%', scaleY: 1 });
        setTimeout(e => setWarnText(''), 3000);
  
        await animateWarn(warn.current, { y: '0', scaleY: .1 }, { duration: .1, delay: 3, ease: 'easeIn' });
        setIsWarned(true);
      }
    }
    
    // const { mutate } = useMutation({
    //   mutationFn: data => axios.post('/api/logIn', data),
    //   onSuccess: res => {
    //     setUserInfo(res.data);
  
    //     localStorage.setItem('info', JSON.stringify(res.data));
    //   },
    //   onError: res => {
    //     switch (res.response.status) {
    //       case 404:
    //         showWarn('Нет такого пользователя!');
    //         break;
    //       case 403:
    //         showWarn('Пароль неверный!');
    //         break;
    //     }
    //   }
    // });

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
                </div>

                <img src="/imageAddition_Reg.png" alt="" />

                <Warn localRef={warn}>{warnText}</Warn>
            </form>
        </div>
    )
}

export default Singup