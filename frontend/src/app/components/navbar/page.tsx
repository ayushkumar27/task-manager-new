'use client'
import { Avatar, Box, Text, Heading, HStack, Tab, TabList, Tabs, Tag, TagLabel, Highlight, Menu, MenuButton, MenuList, MenuItem, Button, VStack, IconButton, Divider, Icon } from '@chakra-ui/react'
import { CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'
import { getItemLocalStorage } from '../../../../lib/utils/base'
import { HiOutlineLogout } from "react-icons/hi";
import { jwtDecode } from 'jwt-decode'
import { getUserDetails } from '../../../../lib/apis/user'


const Navbar = () => {

    const router = useRouter();

    const [user, setUser] = useState()
    const [email, setEmail] = useState()
    useEffect(() => {
        setUser(getItemLocalStorage('user'))
        setEmail(getItemLocalStorage('userEmail'))
        getUserDetails().then((res)=>{
            console.log(res)
            setUser(res.data.name)
        })
    }, [])

    


    return (
        <HStack p={2} bg={'gray.100'} h={'10%'} align={'center'} justifyContent={'space-between'}>
            <Heading size={'md'} onClick={() => router.push('/home')} cursor={'pointer'}><Highlight
                query={['Task Manager']}
                styles={{ px: '2', py: '1', rounded: 'full', color: 'white', bg: 'blue.300' }}
            > Task Manager</Highlight></Heading>
            <HStack>
                {user !== 'null' ? (
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Tag size='lg' bg={'blue.300'} colorScheme='blue' borderRadius='full' mr={2}>
                                <Avatar
                                    src='https://bit.ly/sage-adebayor'
                                    size='xs'
                                    name={user}
                                    ml={-1}
                                    mr={2}
                                />
                                <TagLabel>{user}</TagLabel>
                            </Tag>
                        </MenuButton>
                        <MenuList>
                            <Box
                                p={4}
                                display='flex'
                                alignItems='center'
                                borderBottom='1px'
                                borderColor='gray.200'
                                bg='gray.50'
                            >
                                <Avatar
                                    size='lg'
                                    name={user}
                                    src='https://bit.ly/tioluwani-kolawole'
                                    mr={4}
                                />
                                <VStack spacing={1} align='start'>
                                    <Heading size='md'>{user}</Heading>
                                    <Text fontSize='sm' color='gray.600'>{email}</Text>
                                </VStack>
                            </Box>
                            <Divider my={2} />
                            <MenuItem
                                color='red.500'
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('token-detail');
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('userEmail');
                                    router.push('/login');
                                }}
                            >
                                <Icon
                                    as={HiOutlineLogout}
                                    aria-label='Logout'
                                    mr={2}
                                    color='red.500'
                                />
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>) :
                    (
                        <Tabs>
                            <TabList border={0}>
                                <Tab color={'blue.300'} py={1} bg={'white'} fontWeight={600} borderLeftRadius={12} _selected={{ color: 'white', bg: 'blue.300' }} onClick={() => { router.push('/login') }}>Login</Tab>
                                <Tab color={'blue.300'} py={1} bg={'white'} fontWeight={600} borderRightRadius={12} _selected={{ color: 'white', bg: 'blue.300' }} onClick={() => { router.push('/signup') }}>Signup</Tab>
                            </TabList></Tabs>)}</HStack>
        </HStack>
    )
}

export default Navbar