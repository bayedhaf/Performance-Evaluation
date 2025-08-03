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

export default function Page() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [pending,setPending]=useState(false)
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
              Forgot password
            </CardTitle>
            <CardDescription className='text-sm text-center text-gray-600'>
            You forgot your password? Here you can easily retrieve a new password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className='space-y-4'>
              <Input
                type='email'
                name='email'
                disabled={pending}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder='Enter your email...'
                className='bg-gray-100'
              />
             
              <Button
                type='submit'
                disabled={pending}
                className='w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105'
              >
                Continue
              </Button>
            </form>

            <Separator className='my-4' />
           
         <p className='text-center  text-sm text-muted-foreground'>
          
              Back to login,
              <Link href='/auth/login' className='text-sky-600 ml-2 hover:underline'>
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
