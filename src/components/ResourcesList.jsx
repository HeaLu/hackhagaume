import React, { useState } from 'react'
import { Checkbox, makeStyles, Divider, List, ListItem, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, FormControlLabel } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  }
}))


const ResourcesList = (props) => {

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isAllChecked = (type, resources) => {
    let checked = 0
    let unchecked = 0
    for (const resource of resources) {
      if (props.filters[type].indexOf(resource.id) === -1) {
        unchecked++
      } else {
        checked++
      }
    }
    if (checked > 0 && unchecked > 0) return "indeterminate"
    if (checked > 0 && unchecked === 0) return "checked"
    if (checked === 0 && unchecked > 0) return "unchecked"
  }

  const classes = useStyles()

  /* const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  } */

  
  return (
    <>
      <Accordion className={classes.root} expanded={expanded === "rooms"} onChange={handleChange("rooms")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          title="Salles"
          titleTypographyProps={{variant:'h6'}}
        >
          <FormControlLabel
            control={
              <Checkbox
                  checked={isAllChecked("rooms", props.rooms) === "checked"}
                  indeterminate={isAllChecked("rooms", props.rooms) === "indeterminate"}
              />
            }
            label="Salles"
          />
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
            <List>
              { props.rooms.map(room => {
                return (
                  <ListItem key={room.id} button onClick={() => props.changeFilters("rooms", room.id)}>
                    <ListItemIcon>
                      <Checkbox
                        checked={props.filters["rooms"].indexOf(room.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        name={room.id.toString()}
                      />
                    </ListItemIcon>
                    <ListItemText primary={room.label} />
                  </ListItem>
                )}
              )}
            </List>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.root} expanded={expanded === "resources"} onChange={handleChange("resources")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          title="Ressources"
          titleTypographyProps={{variant:'h6'}}
        >
          <FormControlLabel
            control={
              <Checkbox
                  checked={isAllChecked("resources", props.resources) === "checked"}
                  indeterminate={isAllChecked("resources", props.resources) === "indeterminate"}
              />
            }
            label="Ressources"
          />
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <List>
            { props.resources.map(resource => {
              return (
                <ListItem key={resource.id} button onClick={() => props.changeFilters("resources", resource.id)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={props.filters["resources"].indexOf(resource.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      name={resource.id.toString()}
                    />
                  </ListItemIcon>
                  <ListItemText primary={resource.label} />
                </ListItem>
              )}
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default ResourcesList