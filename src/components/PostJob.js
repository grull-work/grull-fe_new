import React, { useRef, useState, useEffect } from 'react';
import '../styles/Postjob.css';
import { useNavigate, NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import BAPI from '../helper/variable';
import axios from 'axios';
import Header4 from './Header4';
import { toast } from 'react-hot-toast';
import { Autocomplete, TextField } from '@mui/material';

const PostJob = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(null);
    const [location, setLocation] = useState(null);
    const [duration, setDuration] = useState(null);
    const [budget, setBudget] = useState('');
    const [currency, setCurrency] = useState(null);
    const [negotiable, setNegotiable] = useState(false);
    const [description, setDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [aboutCompany, setAboutCompany] = useState('');

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
        { value: 'Reactjs', label: 'Reactjs' },
        { value: 'Nodejs', label: 'Nodejs' },
        { value: 'EXPjs', label: 'EXPjs' },
        { value: 'DJANGO', label: 'DJANGO' },
        { value: 'UI', label: 'UI' },
        { value: 'UX', label: 'UX' },
    ];

    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    const handleCancelClick = () => {
        navigate('/clientprofile');
    }

    const validateFields = () => {
        if (!title || !category || !location || !duration || !budget || !currency || !description || !selectedSkills.length || !companyName) {
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
                const requestData = {
                    "category": category.value,
                    "company_description": aboutCompany,
                    "company_name": companyName,
                    "description": description,
                    "duration": duration.value,
                    "location": location.value,
                    "rate_per_hour": budget,
                    "required_skills": selectedSkills.map(s => s.value), // Assuming selectedSkills are objects from Autocomplete
                    "title": title,
                    "currency_type": currency.value
                };
                
                const response = await axios.post(`${BAPI}/api/v0/jobs`, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                
                if (response.status === 200) {
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
                        <h4>Title <span style={{ color: '#FF0808' }}>*</span></h4>
                        <Form.Control
                            className='form-val'
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="formJobCategory">
                        <h4>Job Category <span style={{ color: '#FF0808' }}>*</span></h4>
                        <Autocomplete
                            options={JobCategoryOptions}
                            getOptionLabel={(option) => option.label}
                            value={category}
                            onChange={(event, newValue) => setCategory(newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Select" variant="standard" />}
                            sx={{
                                '& .MuiInputBase-root': {
                                    paddingLeft: '6px',
                                    borderBottom: 'none'
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                            className='form-val-two'
                        />
                    </Form.Group>

                    <div style={{ display: 'flex', gap: '25px' }} className='loc-form'>
                        <Form.Group className="form-group" controlId="formLocation">
                            <h4>Location <span style={{ color: '#FF0808' }}>*</span></h4>
                             <Autocomplete
                                options={LocationOptions}
                                getOptionLabel={(option) => option.label}
                                value={location}
                                onChange={(event, newValue) => setLocation(newValue)}
                                renderInput={(params) => <TextField {...params} placeholder="Select" variant="standard" />}
                                sx={{
                                    '& .MuiInputBase-root': { paddingLeft: '6px' },
                                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                }}
                                className='form-val-three'
                            />
                        </Form.Group>

                        <Form.Group className="form-group" controlId="formDuration">
                            <h4>Duration <span style={{ color: '#FF0808' }}>*</span></h4>
                             <Autocomplete
                                options={DurationOptions}
                                getOptionLabel={(option) => option.label}
                                value={duration}
                                onChange={(event, newValue) => setDuration(newValue)}
                                renderInput={(params) => <TextField {...params} placeholder="Select" variant="standard" />}
                                sx={{
                                    '& .MuiInputBase-root': { paddingLeft: '6px' },
                                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                }}
                                className='form-val-three'
                            />
                        </Form.Group>
                    </div>


                    <div>
                        <div>
                            <h4>Budget <span style={{ color: '#FF0808' }}>*</span></h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className='bud-form'>

                            <Form.Group className="form-group" controlId="formBudget">
                                <Form.Control
                                    type="text"
                                    placeholder="Budget"
                                    className='form-val-5'
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="form-group" controlId="formCurrency">
                                <Autocomplete
                                    options={CurrencyOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={currency}
                                    onChange={(event, newValue) => setCurrency(newValue)}
                                    renderInput={(params) => <TextField {...params} placeholder="Select" variant="standard" />}
                                     sx={{
                                        '& .MuiInputBase-root': { paddingLeft: '6px' },
                                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                    }}
                                    className='form-val-4'
                                />
                            </Form.Group>

                            <Form.Group className="form-group" controlId="formCheckbox" style={{}}>
                                <Form.Check
                                    type="checkbox"
                                    label="Negotiable"
                                    id="includeDurationCheckbox"
                                    className="custom-checkbox"
                                    checked={negotiable}
                                    onChange={(e) => setNegotiable(e.target.checked)}
                                    style={{ border: 'none', cursor: 'pointer' }}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="form-group" controlId="formJobDescription">
                        <h4>Job Description <span style={{ color: '#FF0808' }}>*</span></h4>
                        <Form.Control
                            as="textarea"
                            rows="6"
                            ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                            className='form-val jobdesc'
                            type="text"
                            placeholder="Type Here..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                updateTextareaHeight(e.target);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="formSkills">
                        <h4>Add Skills <span style={{ color: '#FF0808' }}>*</span></h4>
                         <Autocomplete
                            multiple
                            options={SkillOptions}
                            getOptionLabel={(option) => option.label}
                            value={selectedSkills}
                            onChange={(event, newValue) => setSelectedSkills(newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Select" variant="standard" />}
                             sx={{
                                '& .MuiInputBase-root': { paddingLeft: '6px' },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                            className='form-val-two'
                        />

                    </Form.Group>

                    <Form.Group className="form-group" controlId="formCompanyName">
                        <h4>Company Name <span style={{ color: '#FF0808' }}>*</span></h4>
                        <Form.Control
                            className='form-val'
                            type="text"
                            placeholder="Enter Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="formAboutCompany">
                        <h4>About Company (Optional)</h4>
                        <Form.Control
                            as="textarea"
                            rows="5"
                            ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                            className='form-val'
                            placeholder="Type Here..."
                            value={aboutCompany}
                            onChange={(e) => {
                                setAboutCompany(e.target.value);
                                updateTextareaHeight(e.target);
                            }}
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
