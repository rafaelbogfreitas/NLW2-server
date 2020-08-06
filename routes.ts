import express from "express";
import db from "./src/database/connection";
import { convertHoursToMinutes } from "./src/utils/convertHourToMinutes";

const routes = express.Router();

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

routes.post("/classes", async (req, res) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = req.body;

  const insertUsersId = await db('users').insert({
    name,
    avatar,
    whatsapp,
    bio
  });

  const [user_id] = insertUsersId;

  const insertedClassesId = await db("classes").insert({
    subject,
    cost,
    user_id
  });

  const [class_id] = insertedClassesId;

  const classSchedule = schedule.map( (schedule: ScheduleItem) => {
    return {
      week_day: schedule.week_day,
      from: convertHoursToMinutes(schedule.from),
      to: convertHoursToMinutes(schedule.to),
    }
  });

  db("class_schedule").insert(classSchedule);

  return res.send()
});

export default routes;