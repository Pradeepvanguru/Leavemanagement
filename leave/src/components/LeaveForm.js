import React, { useState } from 'react';  
import { useForm } from 'react-hook-form';  
import axios from 'axios';  

function LeaveForm() {  
  const { register, handleSubmit, watch, setValue } = useForm();  

  const [semesters, setSemesters] = useState([]);  
  const [subjects, setSubjects] = useState([]);  

  const subjectsData = {  
    1: { 1: ['Maths', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Electronics'],  
         2: ['Biology', 'Statistics', 'History', 'Geography', 'C Programming', 'Data Structures'] },  

    2: { 3: ['Database Management Systems', 'Data Communication Systems','OOP through Java','Discrete Mathematical Structures','Digital Logic Design','Python programming and Applications'],  
         4: ['Web Development', 'Mobile Apps', 'Machine Learning', 'AI', 'Ethical Hacking', 'Cloud Computing'] },  

    3: { 5: ['Distributed Systems', 'Theory of Computation', 'Compiler Design', 'Data Analytics', 'Cyber Security', 'Big Data'],  
         6: ['Quantum Computing', 'Embedded Systems', 'Data Mining', 'Game Development', 'Web Security', 'Blockchain'] },   

    4: { 7: ['Project Management', 'Information Retrieval', 'Human-Computer Interaction', 'IT Ethics', 'E-Commerce', 'Digital Marketing'],  
         8: ['Research Methodology', 'Software Testing', 'Data Visualization', 'System Modeling', 'DevOps', 'Content Management'] },  
  };  

  const semestersData = {  
    1: [1, 2],  
    2: [3, 4],  
    3: [5, 6],  
    4: [7, 8],  
  };  

  const onYearChange = (year) => {  
    setValue('sem', ''); // Reset semester and subjects when year changes  
    setSubjects([]); // Reset subjects when year changes  
    
    if (year) {  
      setSemesters(semestersData[year]); // Update semesters based on year  
      handleSemesterChange(semestersData[year][0]); // Automatically set to first semester  
    } else {  
      setSemesters([]);  
    }  
  };  

  const handleSemesterChange = (sem) => {  
    const year = watch('year');  
    if (year) {  
      setSubjects(subjectsData[year][sem] || []); // Update subjects based on selected year and semester  
    }  
  };  

  const onSubmit = (data) => {  
    axios.post('http://localhost:5000/api/leave', data)  
      .then((response) => {  
        alert('Class Adjustment Form submitted successfully');  
      })  
      .catch((error) => {  
        console.error('There was an error submitting the form!', error);  
      });  
  };  

  const formStyle = {  
    float: "left",  
    color: "white",  
    fontSize: "15px"  
  };  

  return (  
    <div className='col-lg-6 container rounded p-5'>  
      <center className='m-2 p-5 bg-primary rounded'>  
        <form onSubmit={handleSubmit(onSubmit)} className='form-group'>  
          <h3>Class Adjustment Form</h3><br />  

          <select {...register('year')} className='form-control mb-3' required onChange={(e) => onYearChange(e.target.value)}>  
            <option value="">Select Year</option>  
            <option value="1">1st Year</option>  
            <option value="2">2nd Year</option>  
            <option value="3">3rd Year</option>  
            <option value="4">4th Year</option>  
          </select>  

          <select {...register('sem')} className='form-control mb-3' required onChange={(e) => handleSemesterChange(e.target.value)}>  
            <option value="">Select Semester</option>  
            {(semesters || []).map((sem) => (  
              <option key={sem} value={sem}>{sem} Semester</option>  
            ))}  
          </select>  

          <input {...register('name')} className='form-control mb-3' placeholder="Name" required />  
          <input {...register('email')} className='form-control mb-3' placeholder="Email" required />  
          
          <select {...register('subj')} className='form-control mb-3' required>  
            <option value="">Select Subject</option>  
            {(subjects || []).map((subj) => (  
              <option key={subj} value={subj}>{subj}</option>  
            ))}  
          </select>  

          <label style={formStyle}>Start Date:</label>  
          <input {...register('startDate')} className='form-control mb-3' type="date" required />  
          <label style={formStyle}>End Date:</label>  
          <input {...register('endDate')} className='form-control mb-3' type="date" required />  <br></br>
          <button className='btn btn-warning rounded w-100 fs-4' type="submit">Submit</button>  
        </form>  
      </center>  
    </div>  
  );  
}  

export default LeaveForm;