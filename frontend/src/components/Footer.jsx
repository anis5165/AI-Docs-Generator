import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-[#010305] text-white p-8 mt-10'>
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-4'>
                <div className='space-y-2'>
                    <h1 className='text-2xl'>AI-Docs</h1>
                    <p className='text-lg text-[#99A1AF]'>Revolutionizing software documentation with AI-powered solutions.</p>
                </div>
                <div className='space-y-2'>
                    <h2 className='text-xl'>Quick Links</h2>
                    <ul className='space-y-1'>
                        <li className='hover:text-[#99A1AF]'><Link href="/">Home</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/about">Features</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/contact">How It Works</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/autodocs">Benefits</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/login">contact</Link></li>
                    </ul>
                </div>
                <div className='space-y-2'>
                    <h1 className='text-xl'>Resources</h1>
                    <ul className='space-y-1'>
                        <li className='hover:text-[#99A1AF]'><Link href="/">Documentation</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/about">API Reference</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/contact">Blog</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/autodocs">Tutorials</Link></li>
                        <li className='hover:text-[#99A1AF]'><Link href="/login">Support</Link></li>
                    </ul>
                </div>
                <div className='space-y-2'>
                    <h1 className='text-xl'>Contact Us</h1>
                    <p className='text-[#99A1AF]'>If you have any questions or need support, feel free to reach out to us.</p>
                    <ul className='space-y-1'>
                        <li>Email: <a href="mailto:anishkumargvm02@gmai.com">anishkumargvm02@gmail.com</a></li>
                        <li>Phone: <a href="tel:+919729706784">+91 9729706784</a></li>
                        <li>Address: Lucknow, Uttar Pardesh</li>
                    </ul>
                </div>
            </div>
            <div className='text-center text-[#676a6e] mt-4'>
                <hr/>
            </div>
            <div className='text-center text-[#676a6e] mt-4'>
                <p>© 2025 AutoDocs. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer