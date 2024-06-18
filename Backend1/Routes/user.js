const express=require("express");
const router=express.Router();


const {
        HandelScheduleEventList,
        HandelLiveEventList,
        HandleScheduleEvent,
        HandleMeetingdetails,
        HandleVideoStream,
        HandleLiveMeeting,
        HandleUpdateMappedTranscripts
        } = require("../Controllers/user");






router.post("/schedule-event",HandleScheduleEvent)

router.post("/start-live-meeting",HandleLiveMeeting)

router.post('/allScheduleEvents',HandelScheduleEventList)

router.post('/allLiveEvents',HandelLiveEventList)

router.post('/meetingdetails',HandleMeetingdetails)
router.get('/video',HandleVideoStream)
router.post('/update-mapped-transcript',HandleUpdateMappedTranscripts)

module.exports=router