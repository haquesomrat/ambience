"use client"
import React from 'react'

import { signOut } from 'next-auth/react';


function Logout() {
  return (
    <button onClick={() => signOut()}>
    Log-Out
  </button>
  )
}

export default Logout