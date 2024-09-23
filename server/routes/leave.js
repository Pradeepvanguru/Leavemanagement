const express = require('express');  
const router = express.Router();  
const LeaveRequest = require('../models/LeaveRequest'); // Ensure this is the correct model  
const nodemailer = require('nodemailer');  
const Register = require('../models/registrations'); // Ensure this is the correct model  
const auth = require('../env.js');  
const { format } = require('date-fns'); // Date formatting library  

// Configure Nodemailer transporter  
const transporter = nodemailer.createTransport({  
  service: 'gmail',  
  auth: {  
    user: auth.EMAIL_USER,  
    pass: auth.EMAIL_PASS,  
  },  
});  

// Helper function to send an email  
const sendEmail = async (to, subject, html) => {  
  return transporter.sendMail({  
    from: auth.EMAIL_USER,  
    to,  
    subject,  
    html,  
  });  
};  

// Route to submit a leave request  
router.post('/', async (req, res) => {  
  const { year, sem, name, email, startDate, endDate, subj } = req.body;  

  try {  
    const leaveRequest = new LeaveRequest({ name, email, sem, year, startDate, endDate, subj });  
    await leaveRequest.save();  
    
    const users = await Register.find({ email: { $ne: email }, subj, sem, year }, 'email');  
    const emailAddresses = users.map(user => user.email);  

    const emailMessage = `<div style="display:flex;align-items:center;justify-content:center; color:white; background-color:blue; border:2px solid yellow; border-radius:3rem;"> 
      <div style="padding:20px;margin:15px; ">
      <h1 style="color:white; padding:8px; border-radius:3rem;">Class_Adjustment_Request from __<b style="color:yellow; font-size:25px; padding:3px;">${name}</b>...!!</h1> 
      <p style="font-size:18px;">Year: <b>${year} year</b></p>
      <p style="font-size:18px;">Semister:<b> ${sem} sem</b></p> 
      <p style="font-size:18px;">Subject Name: <b>${subj}</b></p>  
      <p style="font-size:18px;">Class Adjustment From Start Date: <b  style="font-size:15px; background-color:white; color:black;">${format(new Date(startDate), 'dd/MM/yyyy')}</b>
          to End Date:<b  style="font-size:15px;  background-color:white; color:black;"> ${format(new Date(endDate), 'dd/MM/yyyy')}</b></p>  <br>
      <p>  
        <a href="http://localhost:5000/api/leave/accept/${leaveRequest._id}?acceptingEmail={{userEmail}}"   
           style="padding: 10px; background-color: green; color: white; text-decoration: none;border:2px solid yellow;">Accept</a>  
        <a href="http://localhost:5000/api/leave/reject/${leaveRequest._id}?rejectingEmail={{userEmail}}"   
           style="padding: 10px; background-color: red; color: white; text-decoration: none;border:2px solid yellow;">Reject</a>  
      </p></div></div>`;  

    await Promise.all(emailAddresses.map(userEmail =>   
      sendEmail(userEmail, 'New Class_Adjustment-Request_1', emailMessage.replace('{{userEmail}}', userEmail))  
    ));  

    res.status(201).json({ message: `Request submitted and notifications sent to ${emailAddresses.length} users.` });  
  } catch (error) {  
    console.error('Error submitting leave request:', error);  
    res.status(500).json({ error: 'Internal Server Error' });  
  }  
});  

// Route to accept a leave request  
router.get('/accept/:id', async (req, res) => {  
  try {  
    const leaveRequest = await LeaveRequest.findById(req.params.id);  
    if (!leaveRequest) return res.status(404).send('Class Adjustment Request not found.');  

    if (leaveRequest.status === 'Accepted') {  
      return res.send('Oops! This request has already been accepted by someone.☹️');  
    }  

    leaveRequest.status = 'Accepted';  
    leaveRequest.acceptedBy = req.query.acceptingEmail;  
    await leaveRequest.save();  

    const acceptingUser = await Register.findOne({ email: leaveRequest.acceptedBy }, 'name year sem subj');  

    await sendEmail(leaveRequest.email, 'Class_Adjustment_Request Accepted_1', `  
      <div style="background-color:green; border:2px solid yellow; display:flex;align-items:center;justify-content:center; color:white; border-radius:3rem;">
      <div style="margin:10px; padding:20px; ">
      <h1 style="color:yellow; "><b>| Acceptance Message |<b></h1>
      <h2 style="color:black;">Your request has been accepted by___ <b style="color:white; font-size:20px;">${acceptingUser.name}.</b>...!!</h2>  
      <h2 style="color:yellow;">Faculty Details:</h2>  
      <ul style="color:white; font-size:18px;">  
        <li>Year         : ${acceptingUser.year} year</li>  
        <li>Semester     : ${acceptingUser.sem} sem</li> 
        <li>Faculty Name : ${acceptingUser.name}</li>   
        <li>Subject      : ${acceptingUser.subj}</li>  
      </ul></div><div>`);  

    res.send('<h1 style=";color:green;">You accepted the request successfully. Thank you..👍</h1>');  
  } catch (error) {  
    console.error('Error accepting Class_Adjustment_Request:', error);  
    res.status(500).send('Error accepting request');  
  }  
});  

// Route to reject a leave request  
router.get('/reject/:id', async (req, res) => {  
  try {  
    const leaveRequest = await LeaveRequest.findById(req.params.id);  
    if (!leaveRequest) return res.status(404).send('Leave Request not found.');  

    if (leaveRequest.status === 'Accepted') {  
      return res.send('<h1 style="color:red;">Oops! This request has already been accepted by someone...</h1>');  
    }  

    leaveRequest.status = 'Declined';  
    await leaveRequest.save(); 

    // const register = new Register({ name, email, sem, year, startDate, endDate, subj }); 
    // await sendEmail(leaveRequest.email, 'Class Adjustment Request_1 Declined', `  
    //   <div style="background-color:black;border:2px solid red; display:flex;align-items:center;justify-content:center; color:white">
    //   <div style="margin:10px;paddind:20px;"  >
    //   <h4 style="color:red;">Your Class Adjustment Request has been declined.!!!!!</h4>
    //   <p>Details:</p>  
    //   <ul>  
    //     <li>Faculty Name: ${register.name}</li>  
    //     <li>Year: ${register.year}</li>  
    //     <li>Semester: ${register.sem}</li>  
    //     <li>Subject: ${register.subj}</li>  
    //   </ul></div></div>`);  

    const users = await Register.find({ email: { $ne: leaveRequest.email }, sem: leaveRequest.sem, year: leaveRequest.year,subj:{$ne:leaveRequest.subj}}, 'email');  
    const emailAddresses = users.map(user => user.email);  

    const emailMessage = `  <div style="background-color:blue; border:2px solid yellow; display:flex;align-items:center;justify-content:center; color:white;  border-radius:3rem;">
      <div style="margin:10px; padding:20px;">
      <h2>Class Adjustment Request_2</h2> 
      <p>Year: <b>${leaveRequest.year} year</b></p> 
      <p>Semester: <b>${leaveRequest.sem} sem</b></p>   
      <p style="color:white;">Requested from:<b> ${leaveRequest.name}</b></p>  
      <p style="color:white;">Subject: <b>${leaveRequest.subj}</b></p>  
      <p>ClassAjustment From Start Date: <b>${format(new Date(leaveRequest.startDate), 'dd/MM/yyyy')} </b>
         TO End Date: <b>${format(new Date(leaveRequest.endDate), 'dd/MM/yyyy')} </b></p> 
      <p>  
        <a href="http://localhost:5000/api/leave/accept/${leaveRequest._id}?acceptingEmail={{userEmail}}"  
           style="padding:10px; background-color: green; color: white; text-decoration: none; border:2px solid yellow;">Accept</a>  
      </p></div></div>`;  
    
    await Promise.all(emailAddresses.map(userEmail =>   
      sendEmail(userEmail, 'Class Adjustment Request_2', emailMessage.replace('{{userEmail}}', userEmail))  
    ));  

    res.send('<h2 style="color:red;">The request has been declined and users notified,Thank you...</h2>');  
  } catch (error) {  
    console.error('Error rejecting leave request:', error);  
    res.status(500).send('Error rejecting request');  
  }  
});  

module.exports = router;