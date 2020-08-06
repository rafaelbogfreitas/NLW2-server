import { Request, Response } from "express";

import db from "../../src/database/connection";
import { convertHoursToMinutes } from "../../src/utils/convertHourToMinutes";

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

export default class ClassesController {

  async index(req: Request, res: Response){
    const filters = req.query;

    if(!filters.week_day || !filters.subject || !filters.time){
      return res.status(400).json({
        Error: "Missing filters!"
      })
    }

    const timeInMinutes = convertHoursToMinutes(filters.time as string);

    const classes = await db("classes")
      .whereExists(function(){
        this.select('class_schedule.*')
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(filters.week_day) as number])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes])
      })
      .where("classes.subject", "=", filters.subject as string)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"])

    console.log(classes);

    return res.json(classes)
  }

  async create(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;

    const trx = await db.transaction();

    try {
      const insertUsersId = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        bio
      });

      const [user_id] = insertUsersId;

      const insertedClassesId = await trx("classes").insert({
        subject,
        cost,
        user_id
      });

      const [class_id] = insertedClassesId;

      const classSchedule = schedule.map((schedule: ScheduleItem) => {
        return {
          class_id,
          week_day: schedule.week_day,
          from: convertHoursToMinutes(schedule.from),
          to: convertHoursToMinutes(schedule.to),
        }
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit()

      return res.status(201).send()
    } catch (err) {

      trx.rollback()

      res.status(400).json({
        error: "Something went wrong while creating new class!"
      });
    }
  }
}