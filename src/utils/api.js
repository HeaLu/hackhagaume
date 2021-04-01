const axios = require('axios')

export async function getResources () {
  const retour = await axios.get('http://localhost:8000/resources')
  return retour.data
}

export async function getResourcesTypes () {
  const retour = await axios.get('http://localhost:8000/types')
  return retour.data
}

export async function getUser (id) {
  const retour = await axios.get(`http://localhost:8000/users/${id}/`)
  return retour.data  
}

export async function getUsers () {
  const retour = await axios.get(`http://localhost:8000/users`)
  return retour.data  
}

export async function getEvents () {
  const retour = await axios.get(`http://localhost:8000/events`)
  return retour.data  
}

export async function putUser (user, data) {
  const retour = await axios.put(`http://localhost:8000/users/${user}/`, data)
  return retour.data  
}

export async function postEvent (data) {
  const retour = await axios.post(`http://localhost:8000/events`, data)
  return retour.data  
}