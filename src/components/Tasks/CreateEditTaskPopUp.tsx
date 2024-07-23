import React, { memo, useEffect, forwardRef, useCallback } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  FormControl,
  InputRightElement,
  Select,
  HStack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTasks, getTaskById, ITask, updateTask } from '../../api/tasks';

interface CreateEditTaskPopUpProps {
  close: (status: boolean) => void;
  edit: { id: string; status: boolean };
  closeEdit: (args: { id: string; status: boolean }) => void;
}

const CreateEditTaskPopUp: React.FC<CreateEditTaskPopUpProps> = ({
  close,
  edit,
  closeEdit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ITask>();

  const queryClient = useQueryClient();

  const { mutate: createTaskMutate } = useMutation(createTasks, {
    onSuccess: () => {
      toast.success('Task Created Successfully!');
      reset();
      close(false);
      queryClient.invalidateQueries('getTasks');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    },
  });

  const { data: getTaskByIdData } = useQuery(
    ['getTasksById', edit.id],
    () => getTaskById(edit.id),
    {
      retry: false,
      enabled: !!edit.id,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { mutate: editTaskMutate } = useMutation(updateTask, {
    onSuccess: () => {
      reset();
      closeEdit({ id: '', status: false });
      toast.info('Task Updated Successfully!');
      queryClient.invalidateQueries('getTasks');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    },
  });

  useEffect(() => {
    if (getTaskByIdData) {
      setValue('title', getTaskByIdData?.title);
      setValue('description', getTaskByIdData?.description);
      setValue('status', getTaskByIdData?.status);
      setValue('due_date', getTaskByIdData?.due_date);
    } else {
      reset();
    }
  }, [getTaskByIdData, setValue, reset]);

  const customDateInput = useCallback(
    ({ value, onClick, onChange }: any, ref: React.Ref<HTMLInputElement>) => (
      <Input
        width="100%"
        zIndex={1}
        autoComplete="off"
        background="white"
        value={value}
        ref={ref}
        onClick={onClick}
        onChange={onChange}
        placeholder="Select Due Date"
        readOnly
      />
    ),
    []
  );

  const CustomInput = forwardRef(customDateInput);

  const submitCreateTask = useCallback(
    async (data: ITask) => {
      if (!edit.status) {
        createTaskMutate(data);
      } else {
        editTaskMutate({ ...data, id: edit.id });
      }
    },
    [createTaskMutate, edit.status, edit.id, editTaskMutate]
  );

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      backgroundColor="rgb(0,0,0, 0.5)"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top={0}
      left={0}
      zIndex={10}
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        bgColor="white"
        pt="1rem"
        borderRadius="0.5rem"
      >
        <HStack w="100%" justifyContent="space-between">
          <Heading px="1rem" fontSize="24px" color="teal.400">
            {!!!edit.id ? 'Create Task' : 'Edit Task'}
          </Heading>
          <CloseIcon
            mr="1rem"
            onClick={() => {
              close(false);
              closeEdit({ id: '', status: false });
              reset();
            }}
            cursor="pointer"
          />
        </HStack>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleSubmit(submitCreateTask)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="white"
              boxShadow="md"
              borderRadius="0.5rem"
            >
              <FormControl isInvalid={!!errors.title}>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Title*"
                    {...register('title', { required: 'Title is required' })}
                  />
                </InputGroup>
                <Text color="red" fontSize="14px" ml="4px">
                  {errors.title ? errors.title.message : ''}
                </Text>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Textarea
                    placeholder="Description"
                    {...register('description')}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Select placeholder="Select status" {...register('status')}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </Select>
                </InputGroup>
              </FormControl>
              <FormControl isInvalid={!!errors.due_date} zIndex={1}>
                <InputGroup className="dark-theme" width="100%">
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select Due Date"
                        onChange={date =>
                          field.onChange(
                            date ? date.toISOString().split('T')[0] : ''
                          )
                        }
                        selected={field.value ? new Date(field.value) : null}
                        customInput={<CustomInput />}
                        dateFormat="yyyy-MM-dd"
                        wrapperClassName="datePicker"
                      />
                    )}
                  />
                  <InputRightElement
                    children={<CalendarIcon color="gray.300" />}
                  />
                </InputGroup>
                <Text color="red" fontSize="14px" ml="4px">
                  {errors.due_date ? errors.due_date.message : ''}
                </Text>
              </FormControl>
              <Button
                borderRadius="0.3rem"
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                {!!!edit.id ? 'Create Task' : 'Save Changes'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default memo(CreateEditTaskPopUp);
