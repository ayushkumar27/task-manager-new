'use client'
import { Alert, AlertIcon, Box, Button, Center,FormControl, FormLabel, Flex, Input, Link, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar/page'
import { loginUser } from '../../../lib/apis/user'
import { useRouter } from 'next/navigation'
import GoogleLogin from 'react-google-login'
import AlertModel from '../components/alert/page'

const Index = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning' | 'loading' | undefined>(undefined);
  const [alertMessage, setAlertMessage] = useState<string | undefined>(undefined);



  const handleLogin = () => {
    const now = new Date()
    loginUser(email, password).then((res) => {
      setAlertType('success')
      setAlertMessage('Login Successful')
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', res.data.data.name)
      localStorage.setItem('userEmail', res.data.data.email)
      let tokenDetails = { token: res.data.data.token, expiry: now.getTime() + 5 * 60 * 60 * 1000 }
      localStorage.setItem('token-details', JSON.stringify(tokenDetails))
      setTimeout(() => {
        router.push('/home')
      }, 1000);

    }).catch((err) => {

      setAlertMessage(err.response.data)
      setAlertType('error')
      console.error('Login failed:', err)
    })
  }

  const clientId = '374367574313-msd8avj5u2qom3ep7haatisa834o3u98.apps.googleusercontent.com';
  const handleLoginSuccess = async (response:any) => {
    try {
      const res = await fetch('https://task-manager-new-lpbv.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId: response.tokenId }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.name);
        localStorage.setItem('userEmail', data.email);
        router.push('/home');
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginFailure = (response:any) => {
    console.error('Login failed:', response);
  };


  return (
    <>


      <Navbar />

      <Flex
        height={'90vh'}
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <Box
          p={8}
          w="400px"
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          {alertMessage &&(
             <Alert status={alertType}>
             <AlertIcon />
             {alertMessage}
           </Alert>
          )}
          <Stack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Login
            </Text>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
            <Input placeholder="Email" type="email" isRequired onChange={(e) => setEmail(e.target.value)} /></FormControl>
            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>
            <Input placeholder="Password" type="password" isRequired onChange={(e) => setPassword(e.target.value)} /></FormControl>
            <Button onClick={handleLogin} colorScheme="blue" isDisabled={email.length==0||password.length==0} size="md" width="full">
              Login
            </Button>
            <Text textAlign="center">
            Don&apos;t have an account?<Link color="blue.500" href="/signup">Register</Link>
            </Text>

            <GoogleLogin
              clientId={clientId}
              buttonText="Login with Google"
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              cookiePolicy={'single_host_origin'}
            />
          </Stack>
        </Box>
      </Flex>
    </>
  )
}

export default Index;
