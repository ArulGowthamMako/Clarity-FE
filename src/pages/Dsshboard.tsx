import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Box,
  Button,
  Heading,
  HStack,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTasks } from "../api/dashboard";
import CreateEditTaskPopUp from "./CreateEditTaskPopUp";
import DeletePopUp from "./DeletePopUp";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentPage = searchParams.get("page") || "1";
  const [page, setPage] = useState<number>(+currentPage);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<{ id: string; status: boolean }>({
    id: "",
    status: false,
  });
  const [openDeletePopUp, setOpenDeletePopUp] = useState<{
    id: string;
    status: boolean;
  }>({
    id: "",
    status: false,
  });

  const { data, isLoading } = useQuery(
    ["getTasks", page],
    () => getTasks(page),
    {
      retry: false,
    }
  );

  const handlePreviousPage = () => {
    if (data?.data?.prev_page_url) {
      const newPage = page - 1;
      setPage(newPage);
      navigate(`${pathname}?page=${newPage}`);
    }
  };

  const handleNextPage = () => {
    if (data?.data?.next_page_url) {
      const newPage = page + 1;
      setPage(newPage);
      navigate(`${pathname}?page=${newPage}`);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Stack flexDir="column" padding="1.5rem" w="100%" h="100%" gap={0}>
      {(openPopUp || editMode.status) && (
        <CreateEditTaskPopUp
          close={() => setOpenPopUp(false)}
          edit={editMode}
          closeEdit={() => setEditMode({ id: "", status: false })}
        />
      )}
      {openDeletePopUp.status && (
        <DeletePopUp
          close={() => setOpenDeletePopUp({ id: "", status: false })}
          id={openDeletePopUp.id}
        />
      )}
      <HStack mb="1rem" justifyContent="space-between">
        <Heading fontSize="1.5rem" color="black.400">
          Dashboard
        </Heading>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => {
            setOpenPopUp(!openPopUp);
            setEditMode({ id: "", status: false });
          }}
        >
          Create Task
        </Button>
      </HStack>
      <Stack borderTopRadius="0.5rem" bgColor="white">
        <Heading fontSize="1rem" color="black.400" p="0.8rem">
          Users
        </Heading>
      </Stack>
      <TableContainer bgColor="white" w="100%" h="100%">
        <Table variant="simple">
          <Thead bgColor="gray.100">
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Due Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data?.map((item: Task) => (
              <Tr key={item.id} maxH="2rem">
                <Td>
                  <Tooltip
                    label={item.title}
                    aria-label="Full title"
                    openDelay={500}
                    closeDelay={300}
                  >
                    <Box isTruncated maxW="15rem">
                      {item.title}
                    </Box>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip
                    label={item.description}
                    aria-label="Full Description"
                    openDelay={500}
                    closeDelay={300}
                  >
                    <Box isTruncated maxW="15rem">
                      {item.description}
                    </Box>
                  </Tooltip>
                </Td>
                <Td>{item.status}</Td>
                <Td>{item.due_date}</Td>
                <Td ml="1rem">
                  <EditIcon
                    cursor="pointer"
                    onClick={() => setEditMode({ id: item.id, status: true })}
                  />
                  <DeleteIcon
                    ml="1rem"
                    cursor="pointer"
                    color="red.500"
                    onClick={() =>
                      setOpenDeletePopUp({ id: item.id, status: true })
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Stack
        justifyContent="end"
        alignItems="center"
        flexDir="row"
        bgColor="white"
        p="1rem"
        borderBottomRadius="0.5rem"
      >
        <HStack gap="0.5rem">
          <Button
            w="6rem"
            colorScheme="teal"
            variant="outline"
            onClick={handlePreviousPage}
            isDisabled={!data?.data?.prev_page_url}
          >
            Previous
          </Button>
          <Button
            w="6rem"
            colorScheme="teal"
            variant="outline"
            onClick={handleNextPage}
            isDisabled={!data?.data?.next_page_url}
          >
            Next
          </Button>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
