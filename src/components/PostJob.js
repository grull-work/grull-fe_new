import React, { useRef, useState, useEffect } from 'react';
import '../styles/Postjob.css';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import BAPI from '../helper/variable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Header4 from './Header4';
import { toast } from 'react-hot-toast'; 

const PostJob = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const navigate = useNavigate();

    const JobCategoryOptions = [
        { value: 'GRAPHIC_DESIGNER', label: 'Graphic Designer' },
        { value: 'ILLUSTRATOR', label: 'Illustrator' },
        { value: 'PROGRAMMER', label: 'Programmer' },
        { value: 'VIDEO_EDITOR', label: 'Video Editor' },
        { value: 'THREE_D_ARTIST', label: '3D Artist' },
        { value: 'PRODUCT_DESIGNER', label: 'Product Designer' },
    ];

    const LocationOptions = [
        { value: 'INDIA', label: 'India' },
        { value: 'USA', label: 'USA' },
        { value: 'CANADA', label: 'Canada' },
        { value: 'ENGLAND', label: 'England' },
        { value: 'CHINA', label: 'China' },
        { value: 'RUSSIA', label: 'Russia' }
    ];

    const DurationOptions = [
        { value: '6', label: '<1 Week' },
        { value: '7', label: '1 Week' },
        { value: '10', label: '10 Days' },
        { value: '30', label: '30 Days' },
        { value: '60', label: '60 Days' },
        { value: '90', label: '3 Months' },
        { value: '180', label: '6 Months' },
        { value: '360', label: '1 Year' },
    ];

    const CurrencyOptions = [
        { value: 'INR', label: 'INR' },
        { value: 'USD', label: 'USD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'GBP', label: 'GBP' },
        { value: 'CNY', label: 'CNY' },
        { value: 'RUB', label: 'RUB' },
    ];

    const SkillOptions = [
        { value: 'Reactjs', label:'Reactjs' },
        { value: 'Nodejs', label:'Nodejs' },
        { value: 'EXPjs', label:'EXPjs' },
        { value: 'DJANGO', label:'DJANGO' },
        { value: 'UI', label:'UI' },
        { value: 'UX', label:'UX' },
    ];

    const handleSkillsChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions.map(option => option.value));
    };
    
    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const validFiles = Array.from(files).filter((file) => file.type === 'application/pdf');

        if (validFiles.length > 0) {
            setSelectedFiles([...selectedFiles, ...validFiles]);
        } else {
            // Handle invalid file types or no files selected
            console.error('Invalid file types or no files selected');
        }
    };

    const handleRemoveFile = (fileToRemove) => {
        const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
    };

    const handleArrowClick = () => {
        fileInputRef.current.click();
    };

    const handleCancelClick = () => {
        navigate('/clientprofile');
    }

    const validateFields = () => {
        const title = document.querySelector('[name="Title"]').value;
        const category = document.querySelector('[name="Job_Category"]').value; 
        const location = document.querySelector('[name="Location"]').value; 
        const duration = document.querySelector('[name="Duration"]').value;
        const rate_per_hour = document.querySelector('[name="Budget"]').value;
        const curropts = document.querySelector('[name="curropts"]').value;
        const description = document.querySelector('[name="Job_Description"]').value;
        const company_name = document.querySelector('[name="Company_Name"]').value;

        if (!title || !category || !location || !duration || !rate_per_hour || !curropts || !description || !selectedSkills.length || !company_name) {
            toast.error('Please fill all required fields.');
            return false;
        }
        return true;
    };

    const handleSaveClick = async () => {
        if (!validateFields()) return;

        if (!accessToken) {
            console.error('Access token not found in localStorage');
        } else {
            try {
                const title = document.querySelector('[name="Title"]').value;
                const category = document.querySelector('[name="Job_Category"]').value; 
                const location = document.querySelector('[name="Location"]').value; 
                const duration = document.querySelector('[name="Duration"]').value;
                const rate_per_hour = document.querySelector('[name="Budget"]').value;
                const curropts = document.querySelector('[name="curropts"]').value;
                // const negotiableCheckbox = document.querySelector('[name="Negotiable"]');
                // const negotiable = negotiableCheckbox ? negotiableCheckbox.checked : false;
                const description = document.querySelector('[name="Job_Description"]').value;
                const required_skills=selectedSkills;
                // const referenceFilesInput = document.querySelector('[name="Reference_Files"]');
                // const referenceFiles = Array.from(referenceFilesInput.files).map(file => file.name);
                const company_name = document.querySelector('[name="Company_Name"]').value;
                const company_description = document.querySelector('[name="About_Company"]').value;
        
                const requestData = {
                    "category": category,
                    "company_description": company_description,
                    "company_name": company_name,
                    "description": description,
                    "duration": duration,
                    "location": location,
                    "rate_per_hour": rate_per_hour,
                    "required_skills": required_skills,
                    "title": title,
                    "currency_type": curropts
                };
                // console.log(requestData)
                const response = await axios.post(`${BAPI}/api/v0/jobs`, requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                // console.log(response)
                if (response.status===200) {
                    // console.log('Job posted successfully');
                    navigate('/clientprofile');
                } else {
                    console.error('Error posting job:', response.data.error);
                }
        
            } catch (error) {
                console.error('Error occurred:', error);
            }
        }
    };

    return (
        <div>
           {/* section 1 */}
            <Header4 />

            {/* section 2  */}
            <div className='input-form'>
                    <Form className='jobposting-form'>
                        <h2>Job Description</h2>
                        <Form.Group className='form-group' controlId="formBasicTitle">
                            <h4>Title <span style={{color:'#FF0808'}}>*</span></h4>
                            <Form.Control className='form-val' type="text" name='Title' placeholder="Title" />
                        </Form.Group>

                        <Form.Group className="form-group" controlId="formJobCategory">
                            <h4>Job Category <span style={{color:'#FF0808'}}>*</span></h4>
                            <Select
                                options={JobCategoryOptions} placeholder="Select" name="Job_Category"
                                className='form-val-two'
                                styles={{ control: (provided) => ({ ...provided, border:'none',cursor:'pointer' }) }}
                            />
                        </Form.Group>

                        <div style={{ display: 'flex', gap: '25px' }} className='loc-form'>
                            <Form.Group className="form-group" controlId="formLocation">
                                <h4>Location <span style={{color:'#FF0808'}}>*</span></h4>
                                <Select
                                    options={LocationOptions} placeholder="Select" name="Location"
                                    styles={{ control: (provided) => ({ ...provided,border:'none',cursor:'pointer' }) }}
                                    className='form-val-three'
                                />
                            </Form.Group>

                            <Form.Group className="form-group" controlId="formDuration">
                                <h4>Duration <span style={{color:'#FF0808'}}>*</span></h4>
                                <Select
                                    options={DurationOptions} placeholder="Select" name="Duration"
                                    styles={{ control: (provided) => ({ ...provided,border:'none',cursor:'pointer' }) }}
                                    className='form-val-three'
                                />
                            </Form.Group>
                        </div>


                        <div>
                            <div>
                                <h4>Budget <span style={{color:'#FF0808'}}>*</span></h4>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className='bud-form'>
                            
                            <Form.Group className="form-group" controlId="formBudget">
                                <Form.Control type="text" name="Budget" placeholder="Budget" className='form-val-5'/>
                            </Form.Group>

                            <Form.Group className="form-group" controlId="formCurrency">
                                <Select
                                    options={CurrencyOptions} placeholder="Select" name="curropts"
                                    styles={{ control: (provided) => ({ ...provided,border:'none',outline:'none',cursor:'pointer' }) }}
                                    className='form-val-4'
                                />
                            </Form.Group>

                            <Form.Group className="form-group" controlId="formCheckbox" style={{}}>
                                <Form.Check
                                    type="checkbox"
                                    label="Negotiable"
                                    id="includeDurationCheckbox"
                                    name="Negotiable"
                                    className="custom-checkbox"
                                    sx={{border:'none',cursor:'pointer' }}
                                />
                            </Form.Group>
                        </div>
                        </div>

                        <Form.Group className="form-group" controlId="formJobDescription">
                            <h4>Job Description <span style={{color:'#FF0808'}}>*</span></h4>
                            <Form.Control 
                                    as="textarea"
                                    rows="6"
                                    ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                                    onChange={(e) => updateTextareaHeight(e.target)}
                                    className='form-val jobdesc' 
                                    type="text" 
                                    name="Job_Description" 
                                    placeholder="Type Here..." />
                        </Form.Group>

                        <Form.Group className="form-group" controlId="formSkills">
                            <h4>Add Skills <span style={{color:'#FF0808'}}>*</span></h4>
                            <Select
                                isMulti={true}
                                options={SkillOptions}
                                placeholder="Select"
                                name="Skills"
                                styles={{ control: (provided) => ({ ...provided,border:'none',cursor:'pointer' }) }}
                                onChange={(selectedOptions) => handleSkillsChange(selectedOptions)}
                                className='form-val-two'
                            />

                        </Form.Group>

                        {/* <h4>Reference files</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Upload here"
                                    className="form-control"
                                    style={{ width: '500px', height: '30px', borderRadius: '12px', border: '1px solid #ddd' }}
                                />
                                <button onClick={handleArrowClick}>
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                            </div>

                           <input
                                name="Reference_Files"
                                type="file"
                                id="fileInput"
                                ref={fileInputRef}
                                accept=".pdf"
                                // style={{ display: 'none' }}
                                onChange={handleFileChange}
                                multiple
                            />

                            {selectedFiles.length > 0 && (
                                <div>
                                    <p>Selected Files:</p>
                                    <ul>
                                        {selectedFiles.map((file, index) => (
                                            <li key={index} style={{fontSize:'12px',margin:0}}>
                                                {file.name}
                                                <button type="button" onClick={() => handleRemoveFile(file)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div> */}

                        <Form.Group className="form-group" controlId="formCompanyName">
                            <h4>Company Name <span style={{color:'#FF0808'}}>*</span></h4>
                            <Form.Control className='form-val' type="text" name="Company_Name" placeholder="Enter Name" />
                        </Form.Group>

                        <Form.Group className="form-group" controlId="formAboutCompany">
                                <h4>About Company (Optional)</h4>
                                <Form.Control
                                    as="textarea"
                                    rows="5"
                                    ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                                    className='form-val'
                                    name="About_Company"
                                    placeholder="Type Here..."
                                    onChange={(e) => updateTextareaHeight(e.target)}
                                />
                        </Form.Group>
                    </Form>

                    <div className='butcont-jobpost'>
                        <button className='cancel-button' onClick={handleCancelClick}>Cancel</button>
                        <button className='save-button' onClick={handleSaveClick}>Save</button>
                    </div>
                </div>
        </div >
    )
};

export default PostJob;
