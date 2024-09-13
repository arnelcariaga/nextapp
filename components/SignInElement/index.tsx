"use client"
import Image from 'next/image'
import Form from './Form'
import ThemeToggle from '../ThemeToggle'

export default function SignInElement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 flex items-center justify-center p-4">
      <div className='absolute end-0 top-0 m-10'><ThemeToggle /></div>
      <div className="bg-white dark:bg-green-950 rounded-2xl shadow-xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
        <div className="md:w-1/2 bg-green-600 p-8 flex flex-col justify-center items-center text-white">
          <h2 className="text-4xl font-bold mb-4">Bienvenino(a)</h2>
          <p className="text-green-100 text-center mb-8">Acceso al sistema</p>
          <div className='relative w-full h-48'>
            <Image
              src="/imgs/coin-logo224x70.png"
              alt="COIN"
              className="object-center static"
              fill
            />
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-400 mb-8">Iniciar sesi&oacute;n</h1>
          <Form />
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
            Necesita ayuda? Contacta a <a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">Suporte</a>
          </p>
        </div>
      </div>
    </div>
  )
}