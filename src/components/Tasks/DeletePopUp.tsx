import React, { memo, useCallback } from 'react';
import { Flex, Heading, Button, Stack, HStack, Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { deleteTasks } from '../../api/tasks';

interface DeletePopUpProps {
  close: (args: { id: string; status: boolean }) => void;
  id: string;
}

const DeletePopUp: React.FC<DeletePopUpProps> = ({ close, id }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation(deleteTasks, {
    onSuccess: () => {
      toast.info('Task Deleted Successfully!');
      close({ id: '', status: false });
      queryClient.invalidateQueries('getTasks');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    },
  });

  const handleDeleteSubmit = useCallback(() => {
    deleteMutate(id);
  }, [id, deleteMutate]);

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
          <Heading px="1rem" fontSize="24px" color="red.500">
            Delete Task
          </Heading>
        </HStack>
        <Text px="1rem">Are you sure you want to delete this item?</Text>
        <HStack p="1rem" width="100%">
          <Button
            borderRadius="0.3rem"
            variant="outline"
            colorScheme="teal"
            width="full"
            onClick={() => close({ id: '', status: false })}
          >
            No, Cancel
          </Button>
          <Button
            borderRadius="0.3rem"
            variant="solid"
            colorScheme="red"
            width="full"
            onClick={handleDeleteSubmit}
          >
            Yes, Delete
          </Button>
        </HStack>
      </Stack>
    </Flex>
  );
};

export default memo(DeletePopUp);
