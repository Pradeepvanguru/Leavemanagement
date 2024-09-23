import React, { useState } from 'react';  
import axios from 'axios';  

const RegistrationForm = () => {  
  const [formData, setFormData] = useState({  
    year: '',  
    sem: '',  
    email: '',  
    name: '',  
    subj: ''  
  });  

  const [subjects, setSubjects] = useState([]);  

  // Dictionary for subjects based on year and semester  
  const subjectsData = {  
    1: {  
      1: ['Fundamentals of Programming', 'Mathematics I', 'Physics', 'English'],  
      2: ['Data Structures', 'Mathematics II', 'Communication Skills', 'Environmental Science']  
    },  
    2: {  
      3: ['Database Management Systems', 'Data Communication Systems','OOP through Java','Discrete Mathematical Structures','Digital Logic Design','Python programming and Applications'],  
      4: ['Web Development', 'Machine Learning', 'Computer Architecture', 'Data Science']  
    },  
    3: {  
      5: ['Compiler Design', 'Artificial Intelligence', 'Mobile Application Development', 'Data Mining'],  
      6: ['Cyber Security', 'Human-Computer Interaction', 'Distributed Systems', 'Advanced Database Systems']  
    },  
    4: {  
      7: ['Project Management', 'Software Testing', 'Cloud Computing', 'Physical Education'],  
      8: ['Capstone Project', 'Blockchain Technology', 'Big Data Analytics', 'Natural Language Processing']  
    }  
  };  

  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prevData => ({  
      ...prevData,  
      [name]: value  
    }));  

    // Handling year change  
    if (name === 'year') {  
      setFormData(prevData => ({ ...prevData, sem: '', subj: '' })); // Reset semester and subject  
    }  

    // Handling semester change  
    if (name === 'sem') {  
      setSubjects(subjectsData[formData.year][value]);  
    }  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  

    try {  
      const response = await axios.post('http://localhost:5000/registers', formData);  
      alert("Registration successful");  
      console.log(response);  
    } catch (error) {  
      console.error('There was an error registering!', error);  
      alert('Registration failed!');  
    }  
  };  

  const registerStyle = {  
    float: "left",  
    color: "black",  
    fontWeight: "bold"  
  };  

  const getSemesters = (year) => {  
    switch(year) {  
      case '1':  
        return [1, 2];  
      case '2':  
        return [3, 4];  
      case '3':  
        return [5, 6];  
      case '4':  
        return [7, 8];  
      default:  
        return [];  
    }  
  };  

  return (  
    <div className='col-sm-5 container rounded'>  
      <div className='bg-warning rounded m-4 p-5'>  
        <form onSubmit={handleSubmit}>  
          <center><h3>Registration Form</h3><br /></center>  

          <div className='form-group'>  
            <label style={registerStyle}>Year</label>  
            <select className='form-control mb-3' name="year" value={formData.year} onChange={handleChange} required>  
              <option value="">Select Year</option>  
              <option value="1">1 year</option>  
              <option value="2">2 year</option>  
              <option value="3">3 year</option>  
              <option value="4">4 year</option>  
            </select>  
          </div>  

          <div className='form-group'>  
            <label style={registerStyle}>Semester</label>  
            <select className='form-control mb-3' name="sem" value={formData.sem} onChange={handleChange} required disabled={!formData.year}>  
              <option value="">Select Semester</option>  
              {getSemesters(formData.year).map(sem => (  
                <option key={sem} value={sem}>{sem} sem</option>  
              ))}  
            </select>  
          </div>  

          <div className='form-group'>  
            <label style={registerStyle}>Email</label>  
            <input className='form-control mb-3' type="email" name="email" value={formData.email} onChange={handleChange} required />  
          </div>  

          <div className='form-group'>  
            <label style={registerStyle}>Name</label>  
            <input className='form-control mb-3' type="text" name="name" value={formData.name} onChange={handleChange} required />  
          </div>  

          <div className='form-group'>  
            <label style={registerStyle}>Subject</label>  
            <select className='form-control mb-3' name="subj" value={formData.subj} onChange={handleChange} required disabled={!formData.sem}>  
              <option value="">Select Subject</option>  
              {subjects.map(subj => (  
                <option key={subj} value={subj}>{subj}</option>  
              ))}  
            </select>  
          </div>  

          <button type="submit" className='btn btn-success p-1 w-100'>Register</button>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default RegistrationForm;