import React, { useEffect, useState } from 'react';
import { AppBar, Button, Container, Grid, InputBase, Link, makeStyles, Paper, TextField, Toolbar, Typography, fade } from '@material-ui/core'
import RessourcesList from '../components/ResourcesList';
import MainCalendar from '../components/MainCalendar';
import { getResources, getRooms, getUsers, putUser, getEvents, postEvent } from '../utils/api'
import ModalEvent from '../components/ModalEvent';
import Assistant from '../components/Assistant';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
}))

const Home = () => {

  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [userActif, setUserActif] = useState(2)
  const [rooms, setRooms] = useState([])
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState({
    rooms: [],
    resources: []
  })
  const [openModal, setOpenModal] = useState(false)
  const [event, setEvent] = useState({
    id: 0,
    start: new Date(),
    end: new Date(),
    allDay: false,
    title: "",
    description: ""
  })
  const [module, setModule] = useState("assistant")


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

    const fetchRooms = async () => {
      const data = await getRooms()
      console.log(data)
      setRooms(data)
    }

    fetchResources()
    fetchRooms()
    fetchUsers()
  }, [])

  const handleAssistant = (e) => {
    handleConfirmEvent({
      start: e.start,
      end: e.end,
      qty: e.qty,
      resourceId: "s"+e.room,
      allDay: false,
      title: e.title,
      status: e.status
    })
    for (const r of e.resources) {
      handleConfirmEvent({
        start: e.start,
        end: e.end,
        qty: e.qty,
        resourceId: "r"+r,
        allDay: false,
        title: e.title,
        status: e.status
      })
    }
  }

  const handleChangeFilters = async (type, id) => {
    let newfilters = {...filters}
    const index = newfilters[type].indexOf(id)
    if (index === -1) {
      newfilters[type].push(id)
    } else {
      newfilters[type].splice(index, 1)
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
            <Typography edge="start" variant="h6" className={classes.title}>
              eDomitille
            </Typography>
            <Button href="#" onClick={() => setModule("assistant")} color="inherit">Assistant</Button>
            {isSuperAdmin(userActif) &&  
            <>
              <Button href="#" onClick={() => setModule("calendar")} color="inherit">Calendrier</Button>
              <Button href="#" onClick={() => setModule("validation")} color="inherit">Validations</Button>
            </>
            }
            <div edge="end" className={classes.search}>
              <div className={classes.searchIcon}>
                <PersonIcon />
              </div>
              <InputBase
                placeholder="Utilisateur…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={userActif} 
                onChange={e => setUserActif(parseInt(e.target.value))}
              />
            </div>
          </Toolbar>
        </AppBar>
        {module === "calendar" &&
        <>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Paper className={classes.root}>
                <RessourcesList filters={filters} rooms={rooms} resources={resources} changeFilters={handleChangeFilters} />
              </Paper>
            </Grid>
            <Grid item xs={10}>
              <Paper className={classes.root}>
                <MainCalendar rooms={rooms.filter(room => filters["rooms"].indexOf(room.id) !== -1)} resources={resources.filter(resource => filters["resources"].indexOf(resource.id) !== -1)} handleModifyEvent={handleModifyEvent} handleCreateEvent={handleCreateEvent} events={events}/>        
              </Paper>
            </Grid>
          </Grid>
        <ModalEvent open={openModal} event={event} resources={resources} rooms={rooms} handleConfirm={handleConfirmEvent} handleCancel={() => setOpenModal(false)} />
        </>
        }
        {module === "assistant" &&
          <Assistant handleConfirm={handleAssistant} events={events} resources={resources} rooms={rooms} isAdmin={isSuperAdmin(userActif)} handleCreateEvent={handleCreateEvent} />
        }
        </Container>
        
    </div>
  );
};

export default Home;