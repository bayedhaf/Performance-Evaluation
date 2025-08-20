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
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      // Redirect based on user role
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (session.user.role === 'team-leader') {
        router.push('/team-leader/dashboard')
      } else if (session.user.role === 'employee') {
        router.push('/employee/employee-dashboard')
      }
    }
  }, [session, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPending(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        // Success - useEffect will handle redirect
        console.log('Login successful')
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
    } finally {
      setPending(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen bg-[url("/image/astuget1.jpg")] bg-cover bg-center'>
    
      <div className='absolute inset-0 bg-white/50 backdrop-blur-sm z-0' />

      <div className="relative z-10 flex flex-col items-center justify-start text-center pt-8 space-y-4">
        <Image
          src="/image/astuLogo.png"
          alt="ASTU Logo"
          width={100}
          height={100}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          ASTU Staff Performance Evaluator
        </h1>
        <p className="text-sm text-gray-600 max-w-md px-4">
          A smart system to manage, review, and evaluate academic staff performance at Adama Science and Technology University.
        </p>
      </div>

   
      <div className='relative z-10 flex items-center justify-center py-8 px-4'>
        <Card className='w-full max-w-md p-6 sm:p-8 shadow-xl backdrop-blur-md bg-white/90 rounded-xl'>
          <CardHeader>
            <CardTitle className='text-center text-3xl font-bold text-gray-800'>
              Sign In
            </CardTitle>
            <CardDescription className='text-sm text-center text-gray-600'>
              Use your email or service to login
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form className='space-y-4' onSubmit={handleSubmit}>
              <Input
                type='email'
                name='email'
                disabled={pending}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder='Enter your email...'
                className='bg-gray-100'
                required
              />
              <Input
                type='password'
                disabled={pending}
                name='password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder='********'
                className='bg-gray-100'
                required
              />
              <Button
                type='submit'
                disabled={pending}
                className='w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105'
              >
                {pending ? 'Signing in...' : 'Login'}
              </Button>
            </form>

           
            <div className='my-4'>
              <Button
                onClick={() => {}}
                variant='outline'
                size='lg'
                disabled={pending}
                className='w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 transition-transform hover:scale-105'
              >
                <FcGoogle className='size-6' />
                Continue with Google
              </Button>
            </div>

            <Separator className='my-4' />
            <Link href='/auth/forgot-password' className='text-sky-600 ml-2 hover:underline'>
                Forgot-password
              </Link>
            <p className='text-center text-sm text-muted-foreground'>
              If you don't have an account,
              <Link href='/auth/sign-up' className='text-sky-600 ml-2 hover:underline'>
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
