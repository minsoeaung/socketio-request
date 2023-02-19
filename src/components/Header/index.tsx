import {Box, Button, Flex, HStack, Input, useColorMode} from "@chakra-ui/react";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Box h='100%'>
      <Flex h='100%' justify='space-between' align='center'>
        <HStack w='30%'>
          <Input placeholder='Basic usage'/>
          <Button colorScheme='blue'>Connect</Button>
        </HStack>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
    </Box>
  )
}

export default Header;
