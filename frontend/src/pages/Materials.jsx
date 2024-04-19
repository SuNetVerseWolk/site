import React from 'react'
import { Outlet } from 'react-router-dom'

const Materials = () => {
  return (
    <div>
      <h1>Materials</h1>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Materials