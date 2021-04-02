import { Dialog, DialogContent, DialogTitle, Grid, TextField, Switch, DialogActions, Button, FormControlLabel, FormControl, InputLabel, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import frLocale from "date-fns/locale/fr";
import format from "date-fns/format";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

class FrLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: "fr" });
  }
}

const ModalEvent = (props) => {
  useEffect(() => {
    setEvent(props.event)
  }, [props.event])

  const [event, setEvent] = useState(props.event)

  const handleChangeText = (e) => {
    setEvent({...event, [e.target.name]: e.target.value})
  }

  const handleChangeSwitch = (e) => {
    setEvent({...event, [e.target.name]: !event[e.target.name]})
  }

  const handleChangeDate = (target, value) => {
    setEvent({...event, [target]: value})
  }

  const confirm = () => {

    props.handleConfirm(event)
    props.handleCancel()
  }

  return (
    <Dialog open={props.open} onClose={props.handleCancel}>
      <DialogTitle>Demande de réservation</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid xs={12}>
            <TextField 
              required
              autoFocus
              fullWidth
              margin="dense"
              label="Titre"
              value={event.title}
              name="title"
              onChange={e => handleChangeText(e)}
            />
          </Grid>
          <Grid xs={12}>
            <TextField 
              margin="dense"
              fullWidth
              label="Description"
              name="description"
              value={event.description}
              multiline
              rows={4}
              onChange={e => handleChangeText(e)}
            />
          </Grid>
          <MuiPickersUtilsProvider utils={FrLocalizedUtils} locale={frLocale}>
            <Grid xs={6}>
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
            <Grid xs={6}>
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
          <Grid xs={6}>
            <FormControlLabel
              control={
                <Switch 
                  name="allDay"
                  checked={event.allDay}
                  onClick={e => handleChangeSwitch(e)}
                  value={event.allDay}
                />
              }
              label="Toute la journée"
            />
          </Grid>
          <Grid xs={6}>
            <FormControl>
              <InputLabel htmlFor="grouped-native-select">Ressource</InputLabel>
              <Select fullWidth native defaultValue={event.resourceId === 0 ? "": event.resourceId} name="resourceId" onChange={e => handleChangeText(e)} required>              
                <option aria-label="None" value="" />
                <optgroup label="Salles">
                  {props.rooms.map(room => {
                      <option key={room.id} value={room.id}>{room.label}</option>
                    })
                  }
                </optgroup>
                <optgroup label="Ressources">
                  {props.resources.map(resource => {
                      <option key={resource.id} value={resource.id}>{resource.label}</option>
                    })
                  }
                </optgroup>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCancel} color="primary">
          Annuler
        </Button>
        <Button onClick={() => confirm()} color="secondary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEvent;