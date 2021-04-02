import { Typography, Grid, TextField, Container, Button, List, ListItem, Checkbox, FormGroup, RadioGroup, FormControlLabel, FormControl, Radio } from '@material-ui/core'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, {useEffect, useState} from 'react'
import frLocale from "date-fns/locale/fr";
import format from "date-fns/format";
import DateFnsUtils from "@date-io/date-fns";
import { CallMergeTwoTone } from '@material-ui/icons';

class FrLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: "fr" });
  }
}
const Assistant = (props) => {
  const [step, setStep] = useState(0)
  const [event, setEvent] = useState({
    start: new Date(),
    end: new Date(),
    qty: 1,
    room: "",
    resources: [],
    status: (props.isAdmin) ? "confirmed" : "pending"
  })
  
  const [resources, setResources] = useState([])
  const [rooms, setRooms] = useState([])


  useEffect(() => {
    setEvent({...event, status: (props.isAdmin) ? "confirmed" : "pending"})
  }, [props.isAdmin])

  useEffect(() => {
    setRooms(props.rooms)
  }, [props.rooms])

  useEffect(() => {
    setRooms(props.resources)
  }, [props.resources])

  useEffect(() => {
    setRooms(props.rooms)
  }, [props.rooms])
  
  const handleChangeDate = (target, value) => {
    setEvent({...event, [target]: value})
  }

  const handleChange = (e) => {
    setEvent({...event, [e.target.name]: e.target.value})
  }

  const isValid = () => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const now = new Date()
    switch (step) {
      case 0:
        if (start.getTime() > now.getTime() && end.getTime() > start.getTime() && event.qty > 0) return true
        break
      default:
        throw new Error("Etape "+step+" non valide.")
    }
    return false    
  }

  const handleChangeStep = async () => {
    switch(step) {
      case 0:  
        const dRooms = rooms
        break
      default:
        throw new Error("Etape "+step+" non valide.")
    }
    setStep(step+1)
  }
  console.log(rooms)
  return (
    <>
      <Container>
        <Typography variant="h4">Assistant à la réservation de ressources</Typography>
        { step === 0 &&
        <>
          <Typography variant="subtitle2">Merci de renseigner les dates requises et le nombres de personnes invitées</Typography>
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
            <Grid xs={2} />
            <Grid xs={1}>
              { isValid() &&
                <Button variant="contained" color="primary" onClick={() => handleChangeStep(step)}>Suivant</Button>
              }
            </Grid>
          </Grid>
        </>
        }

        {step === 1 &&
        <>
          <Typography variant="subtitle2">Quel espace souhaitez-vous réserver ?</Typography>
          <FormControl>
            <RadioGroup name="room">
              { rooms.map(room => {
                <>
                <Typography>Coucou</Typography>
                <FormControlLabel value={room.id} control={<Radio />} label={room.label} />
                </>
              })}              
            </RadioGroup>
          </FormControl>
        </>
        }
      </Container>     
    </>
  )
}

export default Assistant