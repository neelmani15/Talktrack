const express=require("express");
const router=express.Router();


const {
        HandelEventList,
        HandleScheduleEvent,
        HandleMeetingdetails,
        HandleVideoStream
        } = require("../Controllers/user");






router.post("/schedule-event",HandleScheduleEvent)

router.get('/allevents',HandelEventList)

router.get('/meetingdetails',HandleMeetingdetails)
router.get('/video',HandleVideoStream)

module.exports=router