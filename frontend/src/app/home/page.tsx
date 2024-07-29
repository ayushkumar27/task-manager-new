'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import {
  Box, Button, Card, CardBody, CardFooter, Flex, FormControl, FormLabel,
  Heading, HStack, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverHeader, PopoverTrigger, Select, Text, Textarea,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter,useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { createTask, deleteTask, editTask, getTaskbyId, getTasks, getTasksbyRange } from '../../../lib/apis/tasks';
import { TimestampToDate } from '../../../lib/utils/dateFormatter';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Page = () => {

  interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    created: string;
    deadline: string;
  }

  const toast = useToast()


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState<string>('');  const [created, setCreated] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState();
  const [range, setRange] = useState<string>('')

  const handleAdd = () => {
    setTitle('')
    setDescription('')
    setStatus('')
    setDeadline('')
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
      toast({
        title: 'Task Created Successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    });
  };

  const handleEditView = (id:any) => {
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

  const handleEdit = (id:any) => {
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
      toast({
        title: 'Task Changed Successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    });
  };

  const handleDelete = (id:any) => {
    deleteTask(id).then((res) => {
      getTasks().then((res) => {
        setAllTasks(res.data);
      });
      onCloseModal();
      toast({
        title: 'Task Deleted Successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    });
  };

  const handleView = (id:any) => {
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

  const onDragEnd = async (result:any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const movedTask = filteredTasks.find(task => task && task._id === draggableId);

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
      console.log('dfg')
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
        <Modal isOpen={isOpenModal} onClose={onCloseModal} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder='Select status'>
                <option value='to-do'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='done'>Done</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Deadline</FormLabel>
              <Input type='datetime-local' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleAdd}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEditModal} onClose={onCloseEditModal} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder='Select status'>
                <option value='to-do'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='done'>Done</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Deadline</FormLabel>
              <Input type='datetime-local' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={()=>handleEdit(taskId)}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenViewModal} onClose={onCloseViewModal} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input value={title} readOnly />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} readOnly />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={status} isDisabled placeholder='Select status'>
  <option value='to-do'>To Do</option>
  <option value='in-progress'>In Progress</option>
  <option value='done'>Done</option>
</Select>

            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Created</FormLabel>
              <Input value={created} readOnly />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Deadline</FormLabel>
              <Input type='datetime-local' value={deadline} readOnly />
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    </>
  );
};

export default Page;
