import { Alert, AlertIcon } from '@chakra-ui/react'
import React from 'react'

interface Props{
    message:String;
    type:any
}

const AlertModel = ({type,message}:Props) => {
  return (
    <>
    <Alert status={type}>
    <AlertIcon />
    {message}
  </Alert>
    </>
  )
}

export default AlertModel