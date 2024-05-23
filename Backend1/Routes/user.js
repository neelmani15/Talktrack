const express=require("express");
const router=express.Router();


const {
        HandelEventList,
        HandleScheduleEvent,
        HandleMeetingdetails,
        HandleVideoStream
        } = require("../Controllers/user");






router.post("/schedule-event",HandleScheduleEvent)

router.post('/allevents',HandelEventList)

router.post('/meetingdetails',HandleMeetingdetails)
router.get('/video',HandleVideoStream)

module.exports=router