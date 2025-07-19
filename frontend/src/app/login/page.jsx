'use client';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Link from 'next/link';
import { useAppContext } from '@/context/appcontext';

const loginSchemaValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const Login = () => {
    const {login} = useAppContext();
    const router = useRouter();

    const loginForm = useFormik({
        initialValues: { 'email': '', 'password': '' }, 
        onSubmit: (values) => {
            axios.post('http://localhost:5000/user/login', values)
                .then((result) => {
                    console.log(result);
                    toast.success('Login successful');
                    login(result.data.user);
                    localStorage.setItem('token', result.data.token);
                    router.push('/');
                }).catch((err) => {
                    if (err.response && err.response.status === 400) {
                        toast.error('Invalid credentials. Please try again.');
                    } else {
                        toast.error('Error logging in: ' + err.response.data.error);
                    }
                });
        },
        validationSchema: loginSchemaValidation
    });


  return (
     <div className='max-w-md mx-auto pt-20'>
      <div className='text-white p-6  rounded-lg shadow-lg'>
        <h1 className='text-5xl font-extrabold text-center'>Login <br /> <span className='text-[#3f474e]'>CodocAI</span></h1>
        <p className='mt-4 text-[#3f474e] text-center'>Please fill in the form below to create an account.</p>


        <form className='mt-6' onSubmit={loginForm.handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              onChange={loginForm.handleChange}
              value={loginForm.values.email}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your email'
            />
            {loginForm.errors.email && loginForm.touched.email && (
              <p className='text-red-500 text-sm mt-1'>{loginForm.errors.email}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              onChange={loginForm.handleChange}
              value={loginForm.values.password}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your password'
            />
            {loginForm.errors.password && loginForm.touched.password && (
              <p className='text-red-500 text-sm mt-1'>{loginForm.errors.password}</p>
            )}
          </div>
          <div className='mt-4 mb-4 '>
            <label className=' text-sm font-medium mb-2 flex items-center ' htmlFor='terms'>
              <input type='checkbox' required id='terms' className='mr-2' />
              <p className='text-sm text-[#3f474e]'>By registering, you agree to our <Link href='/terms' className='text-[#6e8395] hover:underline'>Terms of Service</Link> and <Link href='/privacy' className='text-[#6e8395] hover:underline'>Privacy Policy</Link>.</p>
            </label>
          </div>
          <button
            type='submit'
            className='w-full bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'
          >
            Login
          </button>
        </form>
        <div className='mt-6 mb-4 text-center text-[#3f474e]'>
          <hr />
        </div>
        <div>
          <p className='text-center text-sm text-[#3f474e]'>Or login with</p>
          <div className='flex justify-center items-center gap-4 mt-2'>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>Google</button>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>GitHub</button>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>Twitter</button>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-center text-sm text-[#3f474e]'>Don't have an account? <Link href='/register' className='text-[#6e8395] hover:underline'>Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login