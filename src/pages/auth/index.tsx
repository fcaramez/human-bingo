import { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function AuthPage() {
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  const handleFormChange = () => setToggleForm(!toggleForm);

  return (
    <>
      {toggleForm ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={"gray.800"}
        >
          <Stack
            spacing={8}
            mx={"auto"}
            maxW={"lg"}
            py={12}
            px={6}
          >
            <Stack align={"center"}>
              <Heading
                color={"white"}
                fontSize={"4xl"}
              >
                Sign up for Human Bingo!
              </Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={"gray.700"}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel color={"white"}>Email address</FormLabel>
                  <Input
                    color={"white"}
                    type="email"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel color={"white"}>Password</FormLabel>
                  <Input
                    color={"white"}
                    type="password"
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Link
                      onClick={handleFormChange}
                      color={"blue.400"}
                    >
                      Already have an account?
                    </Link>
                  </Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      ) : (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={"gray.800"}
        >
          <Stack
            spacing={8}
            mx={"auto"}
            maxW={"lg"}
            py={12}
            px={6}
          >
            <Stack align={"center"}>
              <Heading
                color={"white"}
                fontSize={"4xl"}
              >
                Sign in for Human Bingo!
              </Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={"gray.700"}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel color={"white"}>Email address</FormLabel>
                  <Input
                    type="email"
                    color={"white"}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel color={"white"}>Password</FormLabel>
                  <Input
                    color={"white"}
                    type="password"
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Link
                      onClick={handleFormChange}
                      color={"blue.400"}
                    >
                      Don&apos;t have an account?
                    </Link>
                  </Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      )}
    </>
  );
}
