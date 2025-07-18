'use client'
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast';
import * as Yup from 'yup';


const signupSchemaValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
})

const Signup = () => {


  const router = useRouter();
  const signupForm = useFormik({
    initialValues: { 'name': '', 'email': '', 'password': '', 'confirmPassword': '' },
    onSubmit: (values) => {
      axios.post('http://localhost:5000/user/register', values)
        .then((result) => {
          console.log(result);
          toast.success('User registered successfully');
          router.push('/login');
        }).catch((err) => {
          // console.error(err);
          if (err.response && err.response.status === 400) {
            toast.error('This email is already registered. Please use a different email.');
          } else {
            toast.error('Error registering user: ' + err.response.data.error);
          }
        });
    },
    validationSchema: signupSchemaValidation
  });

  return (

    <div className='max-w-md mx-auto pt-20'>
      <div className='text-white p-6  rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold text-center'>Register Here</h1>
        <p className='mt-4 text-[#3f474e] text-center'>Please fill in the form below to create an account.</p>


        <form className='mt-6' onSubmit={signupForm.handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              onChange={signupForm.handleChange}
              value={signupForm.values.name}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your name'
            />
            {signupForm.errors.name && signupForm.touched.name && (
              <p className='text-red-500 text-sm mt-1'>{signupForm.errors.name}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              onChange={signupForm.handleChange}
              value={signupForm.values.email}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your email'
            />
            {signupForm.errors.email && signupForm.touched.email && (
              <p className='text-red-500 text-sm mt-1'>{signupForm.errors.email}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              onChange={signupForm.handleChange}
              value={signupForm.values.password}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your password'
            />
            {signupForm.errors.password && signupForm.touched.password && (
              <p className='text-red-500 text-sm mt-1'>{signupForm.errors.password}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              onChange={signupForm.handleChange}
              value={signupForm.values.confirmPassword}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Confirm your password'
            />
            {signupForm.errors.confirmPassword && signupForm.touched.confirmPassword && (
              <p className='text-red-500 text-sm mt-1'>{signupForm.errors.confirmPassword}</p>
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
            Register
          </button>
        </form>
        <div className='mt-6 mb-4 text-center text-[#3f474e]'>
          <hr />
        </div>
        <div>
          <p className='text-center text-sm text-[#3f474e]'>Or register with</p>
          <div className='flex justify-center items-center gap-4 mt-2'>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>Google</button>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>GitHub</button>
            <button className='bg-[#3f474e] text-white p-2 rounded hover:bg-[#515c65] transition duration-200'>Twitter</button>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-center text-sm text-[#3f474e]'>Already have an account? <Link href='/login' className='text-[#6e8395] hover:underline'>Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup