'use client';
import { useAppContext } from '@/context/appcontext';
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
    const { user, logout } = useAppContext();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className='bg-[#010305] z-[100] fixed top-0 w-full  text-white p-4 shadow-md'>
            <nav className='flex justify-between items-center max-w-7xl mx-auto'>
                <h1 className='text-xl font-bold'>CodocAI</h1>
                <button
                    className="lg:hidden flex items-center px-2 py-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </button>
                {/* Desktop menu */}
                <ul className='hidden lg:flex space-x-4 gap-3 items-center'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    {user ? (
                        <>
                            <li><Link href="/autodocs">Auto Docs</Link></li>
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
            {/* Mobile menu */}
            {menuOpen && (
                <div className="lg:hidden bg-[#16181a] border-t border-[#3f474e] shadow-md absolute w-full left-0 top-full">
                    <ul className="flex flex-col space-y-2 p-4">
                        <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
                        <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
                        {user ? (
                            <>
                                <li><Link href="/autodocs" onClick={() => setMenuOpen(false)}>Auto Docs</Link></li>
                                <li className='text-sm'>Welcome, {user.name}</li>
                                <li onClick={() => { logout(); setMenuOpen(false); }} className='cursor-pointer bg-[#3f474e] px-4 py-2 rounded-lg'>Logout</li>
                            </>
                        ) : (
                            <>
                                <li className='mt-2 mb-6'><Link className='bg-[#3f474e] px-4  py-2 rounded-lg' href="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                                <li className='mb-2'><Link className='bg-[#3f474e] px-4 py-2 rounded-lg' href="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Navbar