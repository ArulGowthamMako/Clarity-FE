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
  FormErrorMessage,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import { forwardRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createTasks, getTaskById, UpdateTask } from "../api/dashboard";

interface CreateEditTaskPopUpTypes {
  title: string;
  description: string;
  status: string;
  due_date: string;
}

const CreateEditTaskPopUp = ({
  close,
  edit,
  closeEdit,
}: {
  close: (value: boolean) => void;
  edit: { id: string; status: boolean };
  closeEdit: ({ id, status }: { id: string; status: boolean }) => void;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateEditTaskPopUpTypes>();
  const queryClient = useQueryClient();

  const { mutate: createTaskMutate } = useMutation(createTasks, {
    onSuccess: (data: any) => {
      toast.success("Task Created Successfully!");
      reset();
      close(false);
      queryClient.invalidateQueries("getTasks");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something went wrong!"
      );
    },
  });

  const { data: getTaskByIdData } = useQuery(
    ["getTasksById", edit.id],
    () => getTaskById(edit.id),
    {
      retry: false,
      enabled: !!edit.id,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { mutate: editTaskMutate } = useMutation(UpdateTask, {
    onSuccess: (data: any) => {
      toast.info("Task Update Successfully!");
      reset();
      closeEdit({ id: "", status: false });
      queryClient.invalidateQueries("getTasks");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something went wrong!"
      );
    },
  });

  const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
    <Input
      width={"100%"}
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
  );
  const CustomInput = forwardRef(customDateInput);

  const submitCreateTask: SubmitHandler<CreateEditTaskPopUpTypes> = async (
    data
  ) => {
    if (!edit.status) {
      createTaskMutate(data);
    } else {
      editTaskMutate({ ...data, id: edit.id });
    }
  };

  useEffect(() => {
    if (getTaskByIdData?.data) {
      setValue("title", getTaskByIdData?.data?.title);
      setValue("description", getTaskByIdData?.data?.description);
      setValue("status", getTaskByIdData?.data?.status);
      setValue("due_date", getTaskByIdData?.data?.due_date);
    } else {
      reset();
    }
  }, [getTaskByIdData?.data, edit.id, reset, setValue]);

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      backgroundColor="rgb(0,0,0, 0.5)"
      justifyContent="center"
      alignItems="center"
      position={"absolute"}
      top={0}
      left={0}
      zIndex={10}
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        bgColor={"white"}
        pt={"1rem"}
        borderRadius={"0.5rem"}
      >
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Heading
            px={"1rem"}
            fontSize={"24px"}
            alignSelf={"start"}
            color="teal.400"
          >
            {!!!edit.id ? "Create Task" : "Edit Task"}
          </Heading>
          <CloseIcon
            mr={"1rem"}
            onClick={() => {
              close(false);
              closeEdit({ id: "", status: false });
              reset();
            }}
            cursor={"pointer"}
          />
        </HStack>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(submitCreateTask)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="white"
              boxShadow="md"
              borderRadius={"0.5rem"}
            >
              <FormControl>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Title*"
                    {...register("title", { required: "Title is required" })}
                  />
                </InputGroup>
                <Text color={"red"} fontSize={"14px"} ml={"4px"}>
                  {errors.title ? errors.title.message : ""}
                </Text>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Textarea
                    placeholder="Description"
                    {...register("description")}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Select placeholder="Select status" {...register("status")}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </Select>
                </InputGroup>
              </FormControl>
              <FormControl zIndex={1}>
                <InputGroup className="dark-theme" width={"100%"}>
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field: { value, onChange } }: any) => (
                      <DatePicker
                        className="react-datapicker__input-text"
                        customInput={<CustomInput />}
                        dateFormat="yyyy-MM-dd"
                        value={value}
                        selected={value}
                        onChange={(date) =>
                          onChange(date ? date.toISOString().split("T")[0] : "")
                        }
                        minDate={new Date()}
                      />
                    )}
                  />
                  <InputRightElement
                    color="gray.500"
                    children={<CalendarIcon />}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.due_date && errors.due_date.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                borderRadius={"0.3rem"}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                {!!!edit.id ? "Create" : "Update"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default CreateEditTaskPopUp;
