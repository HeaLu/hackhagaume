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

  const isAllChecked = (resources) => {
    let checked = 0
    let unchecked = 0
    for (const resource of resources) {
      if (props.filters.indexOf(resource.id) === -1) {
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
    props.resourcesTypes.map(type => {
      return(
        <Accordion key={type.id} className={classes.root} expanded={expanded === type.id} onChange={handleChange(type.id)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            title={type.label}
            titleTypographyProps={{variant:'h6'}}
          >
            <FormControlLabel
              control={
                <Checkbox
                    checked={(isAllChecked(props.resources.filter(resource => (resource.type === type.id))) === "checked")}
                    indeterminate={(isAllChecked(props.resources.filter(resource => (resource.type === type.id))) === "indeterminate")}
                />
              }
              label={type.label}
            />
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
              <List>
                { props.resources.filter(resource => (resource.type === type.id)).map(resource => {
                  return (
                    <ListItem key={resource.id} button onClick={() => props.changeFilters(resource.id)}>
                      <ListItemIcon>
                        <Checkbox
                          checked={props.filters.indexOf(resource.id) !== -1}
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
      )
    })
  )
}

export default ResourcesList