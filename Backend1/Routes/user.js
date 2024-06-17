const express=require("express");
const router=express.Router();


const {
        HandelEventList,
        HandleScheduleEvent,
        HandleMeetingdetails,
        HandleVideoStream,
        HandleLiveMeeting,
        HandleUpdateMappedTranscripts
        } = require("../Controllers/user");






router.post("/schedule-event",HandleScheduleEvent)

router.post("/start-live-meeting",HandleLiveMeeting)

router.post('/allevents',HandelEventList)

router.post('/meetingdetails',HandleMeetingdetails)
router.get('/video',HandleVideoStream)
router.post('/update-mapped-transcript',HandleUpdateMappedTranscripts)

module.exports=router