'use client';
import { useAppContext } from '@/context/appcontext';
import Link from 'next/link'
import React from 'react'

const Navbar = () => {


    const { user, logout } = useAppContext();

    return (
        <div className='bg-[#010305] z-[100] fixed w-full top-0 text-white p-4 shadow-md'>
            <nav className='flex justify-between items-center max-w-7xl mx-auto'>
                <h1 className='text-xl'>AI-Docs</h1>
                <ul className='flex space-x-4 gap-3 items-center'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/autodocs">Auto Docs</Link></li>
                    {user ? (
                        <>
                            <li className='text-sm'>Welcome, {user.name}</li>
                            <li onClick={logout} className='cursor-pointer bg-[#3f474e] px-4 py-2 rounded-lg'>Logout</li>
                        </>
                    ) : (
                        <>
                            <li><Link className='bg-[#3f474e] px-4 py-2 rounded-lg' href="/login">Login</Link></li>
                            <li><Link className='bg-[#3f474e] px-4 py-2 rounded-lg' href="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    )
}

export default Navbar