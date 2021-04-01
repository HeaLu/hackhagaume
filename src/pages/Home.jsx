import React, { useEffect, useState } from 'react';
import { AppBar, Container, Grid, makeStyles, Paper, TextField, Toolbar } from '@material-ui/core'
//import Navigation from '../components/Navigation'
import RessourcesList from '../components/ResourcesList';
import MainCalendar from '../components/MainCalendar';
import { getResources, getResourcesTypes, getUsers, putUser, getEvents, postEvent } from '../utils/api'
import ModalEvent from '../components/ModalEvent';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  }
}))

const Home = () => {

  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [userActif, setUserActif] = useState(1)
  const [resourcesTypes, setResourcesTypes] = useState([])
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [event, setEvent] = useState({
    id: 0,
    start: new Date(),
    end: new Date(),
    allDay: false,
    title: "",
    description: ""
  })


  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents()
      let newData = []
      for (const event of data ) {
        newData.push(formatEvent(event))
      } 
      setEvents(newData)
    }
    
    for (const i in users) {
      if (users[i].id === userActif) {
        setFilters(users[i].filters)
        break
      }
    }

    fetchEvents()
  }, [userActif, users])

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers()
      setUsers(data)
    }
    const fetchResources = async () => {
      const data = await getResources()
      setResources(data)
    }

    const fetchResourcesTypes = async () => {
      const data = await getResourcesTypes()
      setResourcesTypes(data)
    }

    fetchResources()
    fetchResourcesTypes()
    fetchUsers()
  }, [])

  const handleChangeFilters = async (id) => {
    let newfilters = [...filters]
    const index = newfilters.indexOf(id)
    if (index === -1) {
      newfilters.push(id)
    } else {
      newfilters.splice(index, 1)
    }

    setFilters(newfilters)
    for (const i in users) {
      if (users[i].id === userActif) {
        console.log("trouvé", userActif);
        await putUser(userActif, {...users[i], filters: newfilters})
        break
      }
    }
  }

  const formatEvent = (event) => {
    let newEvent = {...event, start: new Date(event.start), end: new Date(event.end)}
    newEvent.style = {}
    if (event.user === userActif) {
      newEvent.style.backgroundColor = "#FF0000"
      newEvent.style.color = setContraste("#FF0000")
    } else {
      if (!isSuperAdmin(userActif) && !isResourceAdmin(userActif, event.resourceId)) {
        newEvent.title = "Réservé"
        newEvent.description = ""
      }
      for (let resource of resources) {
        if (event.resourceId === resource.id) {
          newEvent.style.backgroundColor = resource.color
          newEvent.style.color = setContraste(resource.color)
          break
        }
      }
    }
    newEvent.style.opacity = (event.status === "confirmed") ? 1 : 0.5
    return newEvent
  }

  const isSuperAdmin = (userId) => {
    for (const user of users) {
      if (user.id === userId) {
        if (user.admin) return true
      }
    }
    return false
  }

  const isResourceAdmin = (userId, resourceId) => {
    for (const resource of resources) {
      if (resource.id === resourceId) {
        if (resource.admin === userId) return true
      }
    }
    return false
  }
  
  const handleConfirmEvent = async (handledEvent) => {
    handledEvent.status = (isSuperAdmin(userActif) || isResourceAdmin(userActif, handledEvent.resource)) ? "confirmed" : "pending"
    handledEvent.user = userActif
    const newEvent = formatEvent(handledEvent)
    const data = await postEvent(newEvent)
    setEvents([...events, formatEvent(data)])
  }

  const handleCreateEvent = ({ start, end, resourceId }) => {
    const allDay = (start === end)
    setEvent({start, end, allDay, resourceId })
    setOpenModal(true)
  }

  const handleModifyEvent = (handledEvent) => {
    setEvent(handledEvent)
    setOpenModal(true)
  }

  const setContraste = (hex) => {
    hex = hex.substring(1)
    const r = parseInt(hex[0], 16)*16+parseInt(hex[1], 16)*1
    const g = parseInt(hex[2], 16)*16+parseInt(hex[3], 16)*1
    const b = parseInt(hex[4], 16)*16+parseInt(hex[5], 16)*1
    const color = ((r*0.3+g*0.59+b*0.11) > 128) ? "#000" : "#FFF"
    return color
  }

  const classes = useStyles()

  return (
    <div>
      <Container maxWidth="xl">
        <AppBar position="static">
          <Toolbar variant="dense">
            <TextField label="Utilisateur" value={userActif} onChange={e => setUserActif(parseInt(e.target.value))} />
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Paper className={classes.root}>
              <RessourcesList filters={filters} resourcesTypes={resourcesTypes} resources={resources} changeFilters={handleChangeFilters} />
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper className={classes.root}>
              <MainCalendar resources={resources.filter(resource => filters.indexOf(resource.id) !== -1)} handleModifyEvent={handleModifyEvent} handleCreateEvent={handleCreateEvent} events={events.filter(event => filters.indexOf(event.resourceId) !== -1)}/>        
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <ModalEvent open={openModal} event={event} resources={resources} resourcesTypes={resourcesTypes} handleConfirm={handleConfirmEvent} handleCancel={() => setOpenModal(false)} />
    </div>
  );
};

export default Home;