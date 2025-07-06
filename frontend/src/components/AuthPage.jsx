import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


function AuthPage() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock authentication: no backend validation
    navigate('/upload')
  }


  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-green-500 p-4">
      <div className="bg-gradient-to-r from-blue-600 to-green-500 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md text-center text-white">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">User Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-lime-600 text-black py-2 rounded-md hover:scale-105 transition-transform duration-200 shadow-md">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage