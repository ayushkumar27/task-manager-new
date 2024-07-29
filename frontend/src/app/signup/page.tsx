'use client'
import { Box, Button, Center, Input, Link, Stack, Text, useToast,FormControl, FormLabel } from '@chakra-ui/react'
import React, { useState } from 'react'
import Navbar from '../components/navbar/page'
import { RegisterUser } from '../../../lib/apis/user'
import { useRouter } from 'next/navigation'

const Index = () => {

  const toast = useToast()
  const router = useRouter()

  const handleSubmit = ()=>{
    let payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }
    console.log('click')
    RegisterUser({firstName,lastName,email,password}).then((res)=>{
      toast({
        title: 'User created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setTimeout(() => {

      }, 1000);
      router.push('/login')
    }).catch((err)=>{
      toast({
        title: 'Something went Wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    })
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')



  return (
    <>
    <Navbar></Navbar>
    <Center height="90vh">
        <Box
          p={8}
          w="400px"
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          <Stack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Sign Up
            </Text>
            <FormControl mb={4}>
            <FormLabel>First Name</FormLabel>
            <Input placeholder="First Name" isRequired onChange={(e)=>{
              setFirstName(e.target.value)
            }} type="text" /></FormControl>
             <FormControl mb={4}>
             <FormLabel>Last Name</FormLabel>
            <Input placeholder="Last Name" isRequired type="text" onChange={(e)=>{
              setLastName(e.target.value)
            }}/></FormControl>
           <FormControl mb={4}>
           <FormLabel>Email</FormLabel>
            <Input placeholder="Email" isRequired type="email" onChange={(e)=>{
              setEmail(e.target.value)
            }}/></FormControl>
            <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input placeholder="Password" isRequired type="password" onChange={(e)=>{
              setPassword(e.target.value)
            }}/></FormControl>
             <FormControl mb={4}>
             <FormLabel>Confirm Password</FormLabel>
            <Input placeholder="Confirm Password" isRequired type="password" onChange={(e)=>{
              setConfirmPassword(e.target.value)
            }}/></FormControl>
            <Button onClick={handleSubmit} isDisabled={password!=confirmPassword || firstName.length==0|| lastName.length==0||email.length==0} colorScheme="blue" size="md" width="full">
              Sign Up
            </Button>
            <Text textAlign="center">
              Already have an account? <Link color="blue.500" href="/login">Login</Link>
            </Text>
            <Button colorScheme="red" variant="outline" size="md" width="full">
              Sign Up with Google
            </Button>
          </Stack>
        </Box>
      </Center></>
  )
}

export default Index