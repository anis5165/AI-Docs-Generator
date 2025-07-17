import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div className='bg-[#010305] z-[100] fixed w-full top-0 text-white p-4 shadow-md'>
            <nav className='flex justify-between items-center max-w-7xl mx-auto'>
                <h1 className='text-xl'>AI-Docs</h1>
                <ul className='flex space-x-4 gap-3 items-center'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/autodocs">Auto Docs</Link></li>
                    <li className='bg-[#419EE3] px-4 py-2 rounded-lg '><Link href="/login">Login</Link></li>
                    <li className='bg-[#419EE3] px-4 py-2 rounded-lg'><Link href="/register">Register</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar