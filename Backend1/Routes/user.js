const express=require("express");
const router=express.Router();


const {HandelEventList,HandleScheduleEvent} = require("../Controllers/user");






router.post("/schedule-event",HandleScheduleEvent)

router.get('/allevents',HandelEventList)


module.exports=router