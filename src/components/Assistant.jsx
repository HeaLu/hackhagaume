import { Typography, Grid, TextField, Container, Button, List, ListItem, Checkbox, FormGroup, RadioGroup, FormControlLabel, FormControl, Radio, makeStyles, Divider, ListItemIcon, ListItemText, ButtonGroup } from '@material-ui/core'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, {useEffect, useState} from 'react'
import frLocale from "date-fns/locale/fr";
import format from "date-fns/format";
import DateFnsUtils from "@date-io/date-fns";

class FrLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: "fr" });
  }
}

const useStyles = makeStyles((theme) => ({
  pasok: {
    textDecoration: 'line-through',
    fontStyle: "italic"
  }
}))

const Assistant = (props) => {
  const [step, setStep] = useState(1)
  const [event, setEvent] = useState({
    start: new Date(),
    end: new Date(),
    qty: 1,
    room: 0,
    resources: [],
    title: "",
    status: (props.isAdmin) ? "confirmed" : "pending"
  })
  const [events, setEvents] = useState([])  
  const [resources, setResources] = useState([])
  const [rooms, setRooms] = useState([])


  useEffect(() => {
    setEvent({...event, status: (props.isAdmin) ? "confirmed" : "pending"})
  }, [props.isAdmin])

  useEffect(() => {
    setRooms(props.rooms)
  }, [props.rooms])

  useEffect(() => {
    setResources(props.resources)
  }, [props.resources])

  useEffect(() => {
    setEvents(props.events)
  }, [props.events])
  
  const handleChangeDate = (target, value) => {
    setEvent({...event, [target]: value})
  }

  const handleChange = (e) => {
    switch(e.target.name) {
      case "room":
        setEvent({...event, room: parseInt(e.target.value)})
        break
      default:
        setEvent({...event, [e.target.name]: e.target.value})
    }
  }

  const handleConfirm = () => {
    setStep(step+1)
    props.handleConfirm(event)
  }

  const handleChangeResources = (resourceId) => {
    const index = event.resources.indexOf(resourceId)
    if (index === -1) {
      setEvent({...event, resources: [...event.resources, resourceId]})
    } else {
      const newResources = event.resources.filter(resource => resource !== resourceId)
      setEvent({...event, resources: event.resources.filter(resource => resource !== resourceId)})
    }

  }

  const isValid = () => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const now = new Date()
    switch (step) {
      case 1:
        if ((start.getTime() > now.getTime() && end.getTime() > start.getTime() && event.qty > 0) && (event.title !== "")) return true

        break
      case 2:
        if (event.room !== 0) return true
        break
      case 3:
        return true
        break
      default:
        throw new Error("Etape "+step+" non valide.")
    }
    return false    
  }

  const isOkRoom = (roomId) => {
    for (const room of rooms) {
      if (roomId === room.id) {
        if (room.capacity < event.qty) return false
      }
    }
    return true
  }

  const confirm = () => {
    console.log(event)
  }

  const classes = useStyles();

  return (
    <>
      <Container>
        { step < 4 &&
        <>
          <Typography variant="h4">eDomitille j'écoute</Typography>
          <Typography variant="h5">Que puis-je faire pour vous satisfaire ? - Etape {step}/3</Typography>
        </>
        }
        <br />
        <Divider />
        <br />
        { step === 1 &&
        <>
          <Typography variant="subtitle2">Merci de renseigner les dates requises et le nombre maximal de personnes présentes</Typography>
          <br />
          <Grid container>
            <MuiPickersUtilsProvider utils={FrLocalizedUtils} locale={frLocale}>
              <Grid xs={2}>
                <DateTimePicker 
                  required
                  ampm={false}
                  disablePast
                  label="Début"
                  name="start"
                  fullWidth
                  format="d MMM yyyy - HH:mm"
                  cancelLabel="Annuler"
                  value={event.start}
                  onChange={e => handleChangeDate("start", e)}
                />
              </Grid>
              <Grid xs={1} />
              <Grid xs={2}>
                <DateTimePicker 
                  required
                  disablePast
                  ampm={false}
                  label="Fin"
                  name="end"
                  fullWidth
                  format="d MMM yyyy - HH:mm"
                  cancelLabel="Annuler"
                  value={event.end}
                  onChange={e => handleChangeDate("end", e)}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid xs={1} />
            <Grid xs={2}>
              <TextField 
                type="number"                
                label="Nombre de personnes"
                value={event.qty}
                name="qty"
                onChange={e => handleChange(e)}
              />
            </Grid>
            <Grid xs={1} />
            <Grid xs={2}>
              <TextField
                onChange={(e) => handleChange(e)}
                value={event.title}
                name="title"
                label="Motif"
              />

            </Grid>
            <Grid xs={1}>
              <ButtonGroup>
                <Button variant="contained" disabled={!isValid()} color="primary" onClick={() => setStep(step+1)}>Suivant</Button>
              </ButtonGroup>              
            </Grid>
          </Grid>
        </>
        }

        {step === 2 &&
        <>
          <Typography variant="subtitle2">Quel espace souhaitez-vous réserver ?</Typography>
          <br />
          <FormControl>
            <RadioGroup name="room" onChange={(e) => handleChange(e)}>
              { rooms.map(room => {
                return(
                  <FormControlLabel control={<Radio value={room.id} checked={event.room === room.id} disabled={!isOkRoom(room.id)} />} label={room.label} />
                )
              })}
            </RadioGroup>
            <ButtonGroup>
              <Button variant="contained" disabled={!isValid()} color="primary" onClick={() => setStep(step-1)}>Précédent</Button>
              <Button variant="contained" disabled={!isValid()} color="primary" onClick={() => setStep(step+1)}>Suivant</Button>
            </ButtonGroup>
          </FormControl>
        </>
        }

        { step === 3 &&
        <>
          <Typography variant="subtitle2">De quelle ressources complémentaires avez-vous besoin ?</Typography>
          <br />
          { props.resources.filter(resource => (resource.rooms.indexOf(event.room) !== -1)).map(resource => {
            return (
              <ListItem key={resource.id} button  onClick={() => handleChangeResources(resource.id)}>
                <ListItemIcon>
                  <Checkbox
                    checked={event.resources.indexOf(resource.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    value={resource.id}
                    name="resources"
                   
                  />
                </ListItemIcon>
                <ListItemText primary={resource.label} />
              </ListItem>
            )
          })}
          <ButtonGroup>
            <Button variant="contained" disabled={!isValid()} color="primary" onClick={() => setStep(step-1)}>Précédent</Button>
            <Button variant="contained" color="primary" onClick={() => handleConfirm(event)}>Terminer</Button>
          </ButtonGroup>
        </>
        }
        { step === 4 && 
          <Typography variant="h5">Votre demande a bien été prise en compte.</Typography>
        }
      </Container>     
    </>
  )
}

export default Assistant