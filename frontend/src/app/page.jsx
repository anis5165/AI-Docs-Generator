import React from 'react'

const Home = () => {
  return (
    <>
      {/* Hero section */}
      <section className='min-h-screen'>
        <div className='text-center space-y-5 pt-28'>
          <h1 className=' text-6xl text-white text-center font-semibold'>AI-Powered Documentation Generator</h1>
          <p className='text-gray-100 text-center font-semibold text-xl'>Automatically create, structure, and maintain well-organized documentation for your <br /> software projects. Save time and improve consistency with AI assistance.</p>
          <button className='bg-[#3f474e] text-white text-center text-xl px-4 py-2 rounded-2xl'>Get Started</button>
          <div className='mx-auto z-[-10] mt-16 rounded-lg shadow-2xl border border-gray-700 bg-[#112240] p-4 max-w-4xl hover:shadow-blue-500/20 duration-300transform hover:scale-105 transition duration-300 cyber-border scanner flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden'>

            <img src="/image.png" className='' alt="" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className='py-20 bg-[#010305] my-5 text-white'>
        <div className='max-w-6xl mx-auto '>
          <h1 className='text-4xl text-center font-semibold'>Powerful Features</h1>
          <p className='text-xl text-center py-3'>AutoDocs combines AI technology with modern web development to streamline <br /> your documentation process.</p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
            <div className='border border-[#3f474e] hover:shadow-2xl hover:shadow-[#3f474e] p-6 space-y-2 rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>🤖</p>
              <h1 className='text-left text-xl'>AI-Powered Generation</h1>
              <p className=''>Leverage artificial intelligence to automatically generate clear and concise documentation from your code comments and definitions.</p>
            </div>
            <div className='border border-[#3f474e] p-6 space-y-2 hover:shadow-2xl hover:shadow-[#3f474e] rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>💻</p>
              <h1 className='text-left text-xl'>Source Code Analysis</h1>
              <p className=''>Analyze code in popular programming languages like JavaScript, Python, and Java to extract relevant information.</p>
            </div>
            <div className='border border-[#3f474e] p-6 space-y-2 hover:shadow-2xl hover:shadow-[#3f474e] rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>📤</p>
              <h1 className='text-left text-xl'>Multiple Export Formats</h1>
              <p className=''>Export your documentation in various formats including PDF, Markdown, and more for easy sharing.</p>
            </div>
            <div className='border border-[#3f474e] p-6 space-y-2 hover:shadow-2xl hover:shadow-[#3f474e] rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>🕒</p>
              <h1 className='text-left text-xl'>AI-Powered Generation</h1>
              <p className=''>Leverage artificial intelligence to automatically generate clear and concise documentation from your code comments and definitions.</p>
            </div>
            <div className='border border-[#3f474e] p-6 space-y-2 hover:shadow-2xl hover:shadow-[#3f474e] rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>👥</p>
              <h1 className='text-left text-xl'>AI-Powered Generation</h1>
              <p className=''>Leverage artificial intelligence to automatically generate clear and concise documentation from your code comments and definitions.</p>
            </div>
            <div className='border border-[#3f474e] p-6 space-y-2 hover:shadow-2xl hover:shadow-[#3f474e] rounded-lg hover:scale-95 transition-scale duration-300'>
              <p className='text-left text-4xl'>🎨</p>
              <h1 className='text-left text-xl'>AI-Powered Generation</h1>
              <p className=''>Leverage artificial intelligence to automatically generate clear and concise documentation from your code comments and definitions.</p>
            </div>
          </div>
        </div>
      </section>


      {/* How it works */}
      <section className='py-20 bg-[#010305] my-5 text-white'>
        <div className='max-w-6xl mx-auto '>
          <h1 className='text-4xl text-center font-semibold'>How It Works</h1>
          <p className='text-xl text-center py-3'>Creating professional documentation has never been easier. AutoDocs streamlines the entire process.</p>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mt-16'>
            <div className='space-y-2  text-center'>
              <h1 className='border rounded-full w-12 ml-28 px-5 py-3 bg-[#3f474e]'>1</h1>
              <h1 className='text-xl'>Upload Source Code</h1>
              <p>Upload or paste your source code through our user-friendly interface.</p>
            </div>
            <div className='space-y-2  text-center'>
              <h1 className='border rounded-full w-12 ml-28 px-5 py-3 bg-[#3f474e]'>2</h1>
              <h1 className='text-xl'>AI Analysis</h1>
              <p>Our AI analyzes your code and generates structured documentation automatically.</p>
            </div>
            <div className='space-y-2  text-center'>
              <h1 className='border rounded-full w-12 ml-28 px-5 py-3 bg-[#3f474e]'>3</h1>
              <h1 className='text-xl'>Edit & Customize</h1>
              <p>Refine the generated documentation using our live markdown editor and theme customizer.</p>
            </div>
            <div className='space-y-2  text-center'>
              <h1 className='border rounded-full w-12 ml-28 px-5 py-3 bg-[#3f474e]'>4</h1>
              <h1 className='text-xl'>Export & Share</h1>
              <p>Export your documentation in various formats and share with your team or clients.</p>
            </div>
          </div>
        </div>
      </section>


      {/* why choose */}
      <section className='py-20 bg-[#010305] my-5 text-white'> 
        <div className='max-w-6xl mx-auto'>
            <h1 className='text-4xl text-center font-semibold'>Why Choose AutoDocs?</h1>
            <p className='text-xl text-center py-3'>AutoDocs offers significant advantages over traditional documentation methods.</p>

            <div className='flex justify-center items-center gap-36 mt-10'>
              <img className='w-96 scale-125 mt-5' src="/autodocs2.png" alt="" />
              <div className='space-y-4'>
                <div className=''>
                  <h1 className='text-xl'><span className='text-[#3f474e]'>✓</span> Time Efficiency</h1>
                  <p className='text-[#99A1AF]'>Reduce documentation time by up to 70% with AI-powered automation.</p>
                </div>
                <div>
                  <h1 className='text-xl'><span className='text-[#3f474e]'>✓</span> Consistency & Quality</h1>
                  <p className='text-[#99A1AF]'>Reduce documentation time by up to 70% with AI-powered automation.</p>
                </div>
                <div>
                  <h1 className='text-xl'><span className='text-[#3f474e]'>✓</span> Up-to-Date Documentation</h1>
                  <p className='text-[#99A1AF]'>Automatically detect code changes and update documentation accordingly.</p>
                </div>
                <div>
                  <h1 className='text-xl'><span className='text-[#3f474e]'>✓</span> Team Productivity</h1>
                  <p className='text-[#99A1AF]'>Improve collaboration and reduce miscommunication within development teams.</p>
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Home