'use client';   

import axios from 'axios';
import { useFormik } from 'formik';
import React, { use } from 'react'
import toast from 'react-hot-toast';
import * as Yup from 'yup'; 

const Contact = () => {


    const contactForm = useFormik({
        initialValues: { 'name': '', 'email': '', 'message': '' },
        onSubmit: (values) => {
            axios.post('http://localhost:5000/contact/add', values)
                .then((result) => {
                    console.log(result);
                    toast.success('Message sent successfully');
                }).catch((err) => {
                    console.error(err);
                    toast.error('Error sending message: ' + err.response.data.error);
                });
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            message: Yup.string().required('Message is required')
        })
    });


  return (
    <div className='text-white mt-14 pt-16 p-4'>
        <div>
            <h1 className='text-5xl font-extrabold text-center'>Contact <span className='text-[#3f474e]'>CodocAI</span></h1>
            <p className='mt-4 text-[#3f474e] text-center'>We would love to hear from you! Please fill out the form below to get in touch with us.</p>
        </div>
        <div className='max-w-md mx-auto mt-6'>
            <form className=' p-6 rounded-lg shadow-lg' onSubmit={contactForm.handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='name'>Name</label>
                    <input
                        type='text'
                        id='name'
                        onChange={contactForm.handleChange}
                        value={contactForm.values.name}
                        className='w-full p-2 border border-gray-300 rounded'
                        placeholder='Enter your name'
                        required
                    />
                    {contactForm.errors.name && contactForm.touched.name && (
                        <div className='text-red-500 text-sm mt-1'>{contactForm.errors.name}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
                    <input
                        type='email'
                        id='email'
                        onChange={contactForm.handleChange}
                        value={contactForm.values.email}
                        className='w-full p-2 border border-gray-300 rounded'
                        placeholder='Enter your email'
                        required
                    />
                    {contactForm.errors.email && contactForm.touched.email && (
                        <div className='text-red-500 text-sm mt-1'>{contactForm.errors.email}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='message'>Message</label>
                    <textarea
                        id='message'
                        rows='4'
                        onChange={contactForm.handleChange}
                        value={contactForm.values.message}
                        className='w-full p-2 border border-gray-300 rounded'
                        placeholder='Your message here...'
                        required
                    ></textarea>
                    {contactForm.errors.message && contactForm.touched.message && (
                        <div className='text-red-500 text-sm mt-1'>{contactForm.errors.message}</div>
                    )}
                </div>
                <button type='submit' className='bg-[#3f474e] text-white px-4 py-2 rounded-lg hover:bg-[#5a6268]'>
                    Send Message
                </button>
            </form>
            </div>
    </div>
  )
}

export default Contact