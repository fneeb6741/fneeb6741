const express = require('express'),
  router = express.Router();

router.get('/', function (req, res) {
    res.send('hello world')
});

router.post('/SearchGuests', function (req, res) {
    let sql = "SELECT guestName, coming FROM Guests WHERE guestGroupId = (SELECT groupId FROM GuestGroup WHERE groupCode = (?));"
    let value =  req.body.code;
    db.query(sql, [value], function(err, data, fields){
        if (err) throw err;
        let Guests = data.map(function (a)
        {
            guestName = a.guestName.replace(/['"]+/g, '');
            return guestName;
        })
        let RSVP = data.map(function (a)
        {
            if (a.coming == 1)
            {
                return true;
            }
            else if (a.coming == 0)
            {
                return false;
            }
        })
        if (data.length > 0){
            res.json({
                status: 200,
                "found" : "true",
                "Guests" : Guests,
                "coming" : RSVP
            })
        }
        else{
            res.json({
                status: 200,
                "found" : "false",
                "Code" : value,
            })
        }
    })
});

router.post('/SubmitRSVP', function (req, res) {
    console.log(req.body);
    attendance = req.body.guestAttendance;
    sleepOver = req.body.sleepingOver;
    sleepOption = req.body.sleepingOption;
    if (sleepOver == 'yes')
    {
        sleepOver = true;
    }
    else if (sleepOver == 'no')
    {
        sleepOver = false;
    }
    else
    {
        sleepOver = null;
    }
    console.log(sleepOver);
    console.log(sleepOption);
    count = Object.keys(attendance).length;
    let sql = "CALL updateRSVP(?,?,?,?);"
    for(var i = 0; i < count; i++){
        guestName = Object.keys(attendance)[i];
        rsvp = Object.values(attendance)[i];
        // guestName = attendance[i].guestName;
        // rsvp = attendance[i].willBeAttending;
        console.log(guestName);
        console.log(rsvp);
        rsvpBoolean = null;
        if (rsvp == 'yes')
        {
            rsvpBoolean = true;
        }
        else if (rsvp = 'no')
        {
            rsvpBoolean = false;
        }
        else
        {
            rsvpBoolean = null;
        }
        db.query(sql, [rsvpBoolean, guestName, sleepOver, sleepOption], function(err, data, fields){
            if (err) throw err;
        })
    }
    res.json({
        status: 200
      })
});

module.exports = router;