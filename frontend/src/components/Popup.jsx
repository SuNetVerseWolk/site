import React, { useState } from 'react'
import axios, { toFormData } from 'axios';
import styles from 'styles/presStyle.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion'

const Popup = ({ userInfo, userName, setIsOpen }) => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: async data => await axios.post(`/api/user/change?id=${userInfo.id}&type=${userInfo.type}`, data),
		onSuccess: res => {
			queryClient.invalidateQueries([userInfo.type, userInfo.id]);
			setIsOpen(false);
		},
		onError: res => { },
		retry: 3
	})
	const [name, setName] = useState(userName);

	const submitClick = e => {
		e.preventDefault();

		mutate(Object.fromEntries(new FormData(e.target).entries()));
	}

	return (
		<motion.form
			className={styles.popup}
			initial={{ scale: .80 }}
			animate={{ scale: 1 }}
			onSubmit={submitClick}
		>
			<input id='name' name='name' type="text" value={name} onChange={e => setName(e.target.value)} />
			<input id='password' name='password' type="text" />

			<motion.button
				whileTap={{ scaleX: .85, scaleY: .95 }}
			>
				Изменить
			</motion.button>
		</motion.form>
	)
}

export default Popup