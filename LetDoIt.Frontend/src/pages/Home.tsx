import React from 'react'

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10 text-green-600">
        Welcome to Let's DoIt!
      </h1>
      <p className="text-center mt-4 text-lg">
        Your ultimate task management solution. Organize, prioritize, and conquer your to-do list with ease.
      </p>
      <button className="block ml-4 mt-8 px-6 py-10 bg-green-600 text-white rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black">
        Create Your First Project
      </button>
    </div>
    
  )
}

export default Home