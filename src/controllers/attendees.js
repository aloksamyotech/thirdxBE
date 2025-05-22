import { statusCodes } from '../core/common/constant.js'
import * as attendees from '../services/attendees.js'


export const addAttendees  = async (req, res) => {
   const addAttendee = await attendees.addAttendee(req.body)
   res.status(statusCodes?.ok).send(addAttendee);
}

export const getAllAttendees = async (req, res) => {
   const getAllAttendees = await attendees.getAllAttendees()
   res.status(statusCodes?.ok).send(getAllAttendees)
}

export const getAttendees = async (req, res) => {
  const searchData = await attendees.getAttendees(req?.query)
   res.status(statusCodes?.ok).send(searchData)
}
 
