import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdEmail, MdLock, MdPeople } from 'react-icons/md'
import { Link, useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import * as yup from 'yup'
import client from '../api/client'
import GithubLink from '../components/Common/GithubLink'
import Input from '../components/Form/Input'
import LoadingButton from '../components/LoadingButton'
import { userState } from '../state/userState'

const schema = yup.object().shape({
  username: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const Register = () => {
  const history = useHistory()
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const setUserState = useSetRecoilState(userState)

  const [loading, setLoading] = useState<boolean>(false)
  const [serverErrors, setServerErrors] = useState<any>(null)

  const registerUser = async (formData: any) => {
    setLoading(true)
    try {
      const res = await client.post('/register', formData)
      console.log('register res', res.data)
      const { data } = res.data
      localStorage.setItem('token', data.token)
      setUserState(data.user)
      history.push('/')
    } catch (e) {
      console.log('register error', e)
      if (e.response && e.response.data) {
        setServerErrors({ message: e.response.data })
      } else {
        setServerErrors({ message: e.message })
      }
      setLoading(false)
    }
  }
  return (
    <div className="container flex flex-col justify-center items-center h-screen mx-auto px-6">
      <h1 className="text-3xl mb-3">Registriraj se</h1>
      <form
        className="w-full md:w-container"
        onSubmit={handleSubmit(registerUser)}
      >
        {serverErrors && (
          <p className="text-red-500 mb-4">{serverErrors.message}</p>
        )}
        <Input
          type="text"
          name="username"
          placeholder="Vnesi uporabni??ko ime"
          icon={<MdPeople />}
          ref={register}
          error={errors.username?.message}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Vnesi email"
          icon={<MdEmail />}
          ref={register}
          error={errors.email?.message}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Vnesi geslo"
          icon={<MdLock />}
          ref={register}
          error={errors.password?.message}
          required
        />

        <p className="text-gray-600 mb-4 text-right hover:text-gray-800">
          <Link to="/login">??e registriran?</Link>
        </p>
        <LoadingButton text="Registriraj se" type="submit" loading={loading} />
      </form>
    </div>
  )
}

export default Register
