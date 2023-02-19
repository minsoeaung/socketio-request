import {Grid, GridItem} from "@chakra-ui/react";
import EventEmitter from "./components/EventEmitter";
import Header from "./components/Header";
import OutGoingEvents from "./components/OutGoingEvents";
import IncomingEvents from "./components/IncomingEvents";
import ListeningEvents from "./components/ListeningEvents";

function App() {
  return (
    <Grid
      templateAreas={`"Header Header"
                  "EventEmitter OutGoingEvents"
                  "ListeningEvents IncomingEvents"`}
      templateRows='50px 1fr 1fr'
      templateColumns='1fr 1fr'
      h='100vh'
    >
      <GridItem area='Header'>
        <Header/>
      </GridItem>
      <GridItem area='EventEmitter'>
        <EventEmitter/>
      </GridItem>
      <GridItem area='OutGoingEvents'>
        <OutGoingEvents/>
      </GridItem>
      <GridItem area='ListeningEvents'>
        <ListeningEvents/>
      </GridItem>
      <GridItem area='IncomingEvents'>
        <IncomingEvents/>
      </GridItem>
    </Grid>
  )
}

export default App
