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
  const [form, setForm] = useState({ 
    fullName:'',
    email: '',
     password: '',
    confirmPassword:'' });
    const [pending,setPending]=useState(false);
    const [error,setError]=useState(null);

    const {fullName,email,password,confirmPassword}=form;
   
    const handleSubmit=async(e)=>{
      e.preventDefault();
       if(!fullName ||!email ||!password ||!confirmPassword){
         setError('All field are required');
         return
    }
   try {
     const res=await fetch('/api/auth',{
      method:"POST",
      header:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword 
      })
    });
 const data=await res.json()
 if(!res.ok){
  throw new error( 'Something went to wrong!')
 }
 console.log('succefully created',data)
   } 
   catch (error) {
    console.error('somithing went wrong during registretion')
    
   }
    if(password!==confirmPassword){
       setError('password is must be equal');
        return  
    }

    }

  return (
    <div className='relative min-h-screen bg-[url("/image/get2.jpg")] bg-cover bg-center'>
    
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
              Sign Up
            </CardTitle>
            <CardDescription className='text-sm text-center text-gray-600'>
              Use your email or service to login
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form 
            onSubmit={handleSubmit}
            className='space-y-4'>
            <Input
                type='text'
                name='fullName'
                disabled={pending}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder='Enter your fullName...'
                className='bg-gray-100'
              />
              <Input
                type='email'
                disabled={pending}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder='Enter your email...'
                className='bg-gray-100'
              />
              <Input
                type='password'
                disabled={pending}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder='Password'
                className='bg-gray-100'
              />
               <Input
                type='password'
                name='confirmPassword'
                disabled={pending}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form,  confirmPassword: e.target.value })}
                placeholder='confirmPassword'
                className='bg-gray-100'
              />
              <Button
                type='submit'
                disabled={pending}
                className='w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105'
              >
                Login
              </Button>
            </form>

           
            <div className='my-4'>
              <Button
                onClick={() => {}}
                variant='outline'
                disabled={pending}
                size='lg'
                className='w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 transition-transform hover:scale-105'
              >
                <FcGoogle className='size-6' />
                Continue with Google
              </Button>
            </div>

            <Separator className='my-4' />
            {
               error && <div className="bg-red-700 text-white text-center w-fit">
                {error}
               </div>
            }

            <p className='text-center text-sm text-muted-foreground'>
              If you have an account,
              <Link href='/auth/login' className='text-sky-600 ml-2 hover:underline'>
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
