import React from 'react'
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi'



export default function Topbar() {
  return (
    <div className=''>
      <div className='absolute inset-0  h-15 ml-71 mt-1.5 mr-1.5 bg-amber-300 rounded-xl flex justify-between p-5 items-center'>

        <div className=''>
          <p>Track your applications easily!</p>
        </div>

        <div className='flex gap-8'>

          <button className=" hover:text-blue-600 ">
            <FiBell size={20} />
          </button>

          <button className=" hover:text-blue-600">
            <FiUser size={20} />
          </button>

          <button className=" hover:text-red-600">
            <FiLogOut size={20} />
          </button>

        </div>

      </div>
    </div>
  )
}
