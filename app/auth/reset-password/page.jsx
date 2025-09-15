'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setMessage('Invalid reset link. Please request a new password reset.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      return
    }

    setPending(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          password: form.password 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setMessage(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setPending(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
      
      
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md">
      
        <div className="flex flex-col items-center justify-center text-center mb-8">
          
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full blur opacity-75 animate-pulse"></div>
            <Image
              src="/image/astuLogo.png"
              alt="ASTU Logo"
              width={100}
              height={100}
              className="relative rounded-full shadow-lg border-4 border-white"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            ASTU Staff Performance Evaluator
          </h1>
        
        </div>

   
        <Card className="w-full shadow-2xl border-0 overflow-hidden mb-20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-blue-500"></div>
          <CardHeader className="space-y-3 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Set New Password
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  name="password"
                  disabled={pending}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter new password"
                  className="py-5 px-4 border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  type="password"
                  name="confirmPassword"
                  disabled={pending}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="py-5 px-4 border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-200"
                  required
                />
              </div>
             
              <Button
                type="submit"
                disabled={pending || !token}
                className="w-full py-5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium rounded-md transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                {pending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : "Reset Password"}
              </Button>
            </form>

            {message && (
              <div className={`p-4 rounded-lg text-center ${
                success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
                {success && <p className="text-sm mt-2">Redirecting to login page...</p>}
              </div>
            )}

            <Separator className="my-6" />
           
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link 
                href="/auth/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
        
        
       
      </div>
    </div>
  )
}

