
import DashboardSideBar from '@/components/role/DashboardSidebar'
import React from 'react'

const UserLayout = async ({children}) => {
  return (
    <div className='md:flex max-w-7xl mx-auto'>
      <DashboardSideBar/>
      <div className='flex-1'>{children}</div>
    </div>
  )
}

export default UserLayout