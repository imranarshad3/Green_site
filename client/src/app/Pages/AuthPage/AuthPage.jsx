import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function AuthPage() {
  return (
    <div className='auth-page'>
      <SignIn />
    </div>
  )
}

export default AuthPage
