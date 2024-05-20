const express=require("express");
const router=express.Router();


const {HandelGoogleAuthentication,HandleGcallback} = require("../Controllers/auth");






router.get("/google",HandelGoogleAuthentication)

router.get('/google/callback',HandleGcallback)
// router.get("/",handleGetAllUsers)

// router
//    .route("/:id")
//    .get(handleGetUserById)
//    .patch(updateUserById)
//    .delete(deleteUserById)

module.exports=router;