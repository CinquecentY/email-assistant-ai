'use client'
import React from 'react'
import { Button } from './ui/button'
import { getAurinkoAuthorizationUrl } from '@/lib/aurinko'

const AuthorizationButton = () => {
  return (
    <Button onClick={async () => {
        const authURL = await getAurinkoAuthorizationUrl('Google')
        window.location.href = authURL
    }}>
        Authorize Email
    </Button>
  )
}

export default AuthorizationButton