import React from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'

const locales = {
  'fr': require('date-fns/locale/fr'),
}

const eventStyleGetter = (event, start, end, isSelected) => {
  const style = event.style
  return {
      style
  };
}

const messages = {
  allDay: 'Toute la journée',
  previous: '<',
  next: '>',
  today: 'Aujourd\'hui',
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Réservation',
  noEventsInRange: 'Aucune réservation dans cet intervalle',
  showMore: total => `+ ${total} réservation(s) supplémentaire(s)`
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const MainCalendar = (props) => {
    return (
      <>
        <Calendar
          selectable
          resources={props.resources}
          resourceIdAccessor="id"
          resourceTitleAccessor="label"
          style={{ height: 900,width: '95%' }}
          messages={messages}
          culture="fr"
          localizer={localizer}
          events={props.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          eventPropGetter={(eventStyleGetter)}
          onSelectEvent={event => props.handleModifyEvent(event)}
          onSelectSlot={props.handleCreateEvent}
        />
      </>
    )
}

export default MainCalendar