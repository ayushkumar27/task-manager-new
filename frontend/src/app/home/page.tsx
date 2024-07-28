'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, Heading, HStack, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import ModalBox from '../components/modal/page';
import { AddIcon } from '@chakra-ui/icons';
import { createTask, deleteTask, editTask, getTaskbyId, getTasks, getTasksbyRange } from '../../../lib/apis/tasks';
import { TimestampToDate } from '../../../lib/utils/dateFormatter';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Page = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState();
  const [created, setCreated] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskId, setTaskId] = useState();
  const [range, setRange] = useState();

  const handleAdd = () => {
    let payload = {
      title: title,
      description: description,
      status: status,
      deadline: deadline
    };

    createTask(payload).then((res) => {
      getTasks().then((res) => {
        setAllTasks(res.data);
      });
      onCloseModal();
    });
  };

  const handleEditView = (id) => {
    getTaskbyId(id).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setStatus(res.data.status);
      setDeadline(res.data.deadline);
      setCreated(res.data.created);
      setTaskId(res.data._id);
      onOpenEditModal();
    });
  };

  const handleEdit = (id) => {
    let payload = {
      title: title,
      description: description,
      status: status,
      deadline: deadline
    };

    editTask(id, payload).then((res) => {
      getTasks().then((res) => {
        setAllTasks(res.data);
        onCloseEditModal();
      });
    });
  };

  const handleDelete = (id) => {
    deleteTask(id).then((res) => {
      getTasks().then((res) => {
        setAllTasks(res.data);
      });
      onCloseModal();
    });
  };

  const handleView = (id) => {
    getTaskbyId(id).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setStatus(res.data.status);
      setCreated(res.data.created);
      setDeadline(res.data.deadline);
      setTaskId(res.data._id);
      onOpenViewModal();
    });
  };

  const { isOpen: isOpenModal, onClose: onCloseModal, onOpen: onOpenModal } = useDisclosure();
  const { isOpen: isOpenViewModal, onClose: onCloseViewModal, onOpen: onOpenViewModal } = useDisclosure();
  const { isOpen: isOpenEditModal, onClose: onCloseEditModal, onOpen: onOpenEditModal } = useDisclosure();

  const fetchTasks = () => {
    getTasks().then((res) => {
      setAllTasks(res.data);
    });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const movedTask = filteredTasks.find(task => task._id === draggableId);

    if (!movedTask) return;

    const updatedTasks = filteredTasks.map(task =>
      task._id === movedTask._id
        ? { ...task, status: destination.droppableId }
        : task
    );

    setFilteredTasks(updatedTasks);

    await editTask(movedTask._id, { ...movedTask, status: destination.droppableId });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = allTasks?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, allTasks]);

  useEffect(() => {
    getTasksbyRange(range).then((res) => {
      setFilteredTasks(res.data);
    });
  }, [range, allTasks]);

  return (
    <>
      <Navbar />
      <Box my={6} mx={{ base: 4, md: 8 }} px={{ base: 2, md: 8 }}>
        <Button colorScheme='blue' px={3} w={{ base: 'full', md: 'auto' }} py={2} size={{ base: 'sm', md: 'md' }} onClick={() => onOpenModal()}>
          Add Task
        </Button>
        <Flex
          p={2}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          my={4}
          align='center'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          wrap='wrap'
        >
          <Flex align='center' mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }} flex={{ base: '1', md: '0' }}>
            <Text mr={2}>Search:</Text>
            <Input h=' ' w={'200px'} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search...' />
          </Flex>
          <Flex align='center' flex={{ base: '1', md: '0' }}>
            <Text mr={2}>Sort</Text>
            <Text mr={2}>By:</Text>
            <Select h='auto' w={'200px'} onChange={(e) => setRange(e.target.value)} variant='outline' placeholder='Select'>
              <option value='1h'>last 1 hour</option>
              <option value='24h'>last 24 hours</option>
              <option value='1w'>last 7 days</option>
              <option value='1m'>last one month</option>
              <option value='all'>All</option>
            </Select>
          </Flex>
        </Flex>
        <HStack mt={6} justifyContent='center' spacing={6} h='full' alignItems='stretch' wrap='wrap'>
          <DragDropContext onDragEnd={onDragEnd}>
            {['to-do', 'in-progress', 'done'].map((item, key) => (
              <Droppable key={key} droppableId={`${item}`} type='group'>
                {(provided) => (
                  <Flex
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    w={{ base: 'full', sm: '45%', md: '30%' }}
                    borderColor='gray.200'
                    borderWidth='0.5px'
                    borderRadius='md'
                    boxShadow="xl"
                    bg="white"
                    my={4}
                    direction='column'
                    alignItems='center'
                    p={2}
                  >
                    <Box w='full' bg='blue.300' py={2} mb={3} borderRadius='md' color='white' textAlign='center'>
                      <Heading size='sm' textTransform='capitalize'>{item}</Heading>
                    </Box>
                    {filteredTasks && filteredTasks.filter(task => task.status === item).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            w='full'
                            h={{ base: 'auto', md: '40vh' }}
                            key={index}
                            bg='blue.100'
                            mb={4}
                          >
                            <CardBody>
                              <Heading mb={3} size='md'>{task.title}</Heading>
                              <Text size='sm' mb={3}>{task.description.substring(0, 100)}</Text>
                            </CardBody>
                            <CardFooter display='flex' flexDirection='column'>
                              <Text mb={1} fontSize='xs'>Created at: {TimestampToDate(task.created)}</Text>
                              <Text fontSize='xs'>Deadline: {TimestampToDate(task.deadline)}</Text>
                            </CardFooter>
                            <Flex direction='row' justifyContent='end' mb={4}>
                              <Popover>
                                <PopoverTrigger>
                                  <Button size='sm' mr={2} bg='red.500' color='white'>Delete</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverHeader>Confirmation!</PopoverHeader>
                                  <PopoverBody>Are you sure you want to Delete?
                                    <Button onClick={() => handleDelete(task._id)}>Delete</Button>
                                  </PopoverBody>
                                </PopoverContent>
                              </Popover>
                              <Button size='sm' mr={2} bg='blue.400' color='white' onClick={() => handleEditView(task._id)}>Edit</Button>
                              <Button size='sm' mr={2} bg='blue.600' color='white' onClick={() => handleView(task._id)}>View Details</Button>
                            </Flex>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Flex>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </HStack>
        <ModalBox title='Add a new task' isOpen={isOpenModal} onClose={onCloseModal}>
          <FormControl mb={3}>
            <FormLabel htmlFor='task-title'>Title</FormLabel>
            <Input
              id='task-title'
              type='text'
              placeholder='Enter Title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel htmlFor='task-description'>Description</FormLabel>
            <Textarea
              id='task-description'
              placeholder='Enter task description'
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel htmlFor='task-status'>Status</FormLabel>
            <Select
              id='task-status'
              placeholder='Select option'
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='to-do'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='done'>Done</option>
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel htmlFor='task-deadline'>Deadline</FormLabel>
            <Input
              id='task-deadline'
              type='date'
              placeholder='Deadline'
              onChange={(e) => setDeadline(e.target.value)}
            />
          </FormControl>
          <Button
            w='full'
            colorScheme='blue'
            onClick={handleAdd}
          >
            <AddIcon fontSize='12px' />
            Add Task
          </Button>
        </ModalBox>
        <ModalBox title='Edit task' isOpen={isOpenEditModal} onClose={onCloseEditModal}>
          {taskId && (
            <>
              <FormControl mb={3}>
                <FormLabel htmlFor='edit-task-title'>Title</FormLabel>
                <Input
                  id='edit-task-title'
                  type='text'
                  placeholder='Enter Title'
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel htmlFor='edit-task-description'>Description</FormLabel>
                <Textarea
                  id='edit-task-description'
                  placeholder='Enter task description'
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel htmlFor='edit-task-status'>Status</FormLabel>
                <Select
                  id='edit-task-status'
                  placeholder='Select option'
                  defaultValue={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value='to-do'>To Do</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='done'>Done</option>
                </Select>
              </FormControl>
              <FormControl mb={3}>
                <FormLabel htmlFor='edit-task-deadline'>Deadline</FormLabel>
                <Input
                  id='edit-task-deadline'
                  type='date'
                  placeholder='Deadline'
                  defaultValue={deadline ? deadline.substring(0, 10) : ''}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </FormControl>
              <Button
                w='full'
                colorScheme='blue'
                onClick={() => handleEdit(taskId)}
              >
                <AddIcon fontSize='12px' />
                Save
              </Button>
            </>
          )}
        </ModalBox>
        <ModalBox title='Task Details' isOpen={isOpenViewModal} onClose={onCloseViewModal}>
          {taskId && (
            <>
              <Heading size='sm'>Title:</Heading>
              <Text mb={3}>{title}</Text>
              <Heading size='sm'>Description:</Heading>
              <Text mb={3}>{description}</Text>
              <Heading size='sm'>Status:</Heading>
              <Text mb={3}>{status}</Text>
              <Heading size='sm'>Created on:</Heading>
              <Text mb={3}>{created && TimestampToDate(created)}</Text>
              <Heading size='sm'>Deadline:</Heading>
              <Text>{deadline && TimestampToDate(deadline)}</Text>
            </>
          )}
        </ModalBox>
      </Box>
    </>
  );
};

export default Page;
