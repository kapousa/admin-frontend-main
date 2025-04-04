import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import { Remove } from '@mui/icons-material';
import { styled } from '@mui/system';
import { API_BASE_URL } from '../services/api';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const StyledContainer = styled(Container)({
    marginTop: '30px',
    marginBottom: '30px',
});

const StyledPaper = styled(Paper)({
    padding: '30px',
});

const StyledButton = styled(Button)({
    marginTop: '20px',
});

function CompanyForm({ username, password }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [company, setCompany] = useState({
        name: '', category: '', size: '', location: '', description: '', website: '', revenue: '', founded: '', headquarters: '', mission: '', company_values: '', financialStatement: [{ key: '', value: '', action: '', link: '' }], investors: [{ key: '', value: '', action: '', link: '' }], assessment: [{ key: '', value: '', action: '', link: '' }], portfolio: [{ key: '', value: '', action: '', link: '' }], transformation_plan: [{ key: '', value: '', action: '', link: '' }], logoFile: null,
    });
    const [dynamicSections, setDynamicSections] = useState([{ key: '', value: [{ key: '', value: '', action: '', link: '' }] }]);
    const [logoPreview, setLogoPreview] = useState(null);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let companyData = {
            ...company,
            company_values: company.company_values.split(',').map((value) => value.trim()),
            dynamicSections: dynamicSections,
        };

        if (company.logoFile) {
            formData.append('logo', company.logoFile);
        }

        for (let field of ['financialStatement', 'investors', 'assessment', 'portfolio', 'transformation_plan']) {
            for (let item of companyData[field]) {
                if (item.file) {
                    formData.append('request_files', item.file);
                    delete item.file;
                }
            }
        }

        for (let section of companyData.dynamicSections) {
            for (let item of section.value) {
                if (item.file) {
                    formData.append('request_files', item.file);
                    delete item.file;
                }
            }
        }

        for (const key in companyData) {
            if (key === 'company_values' || key === 'investors' || key === 'financialStatement' || key === 'assessment' || key === 'portfolio' || key === 'transformation_plan' || key === 'dynamicSections') {
                formData.append(key, JSON.stringify(companyData[key]));
            } else if (key !== 'logoFile') {
                formData.append(key, companyData[key]);
            }
        }

        console.log(formData);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            await axios.post(`${API_BASE_URL}/companies/add`, formData, {
                headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}`, },
            });
            navigate('/admin/companies');
        } catch (error) {
            console.error('Error creating company:', error.response.data);
        }
    };

    const categories = ['Technology', 'Retail', 'Health Care', 'Finance', 'Manufacturing', 'Education', 'Hospitality', 'Transportation', 'Energy', 'Agriculture'];
    const locations = ['London, China', 'Madrid, Japan', 'London, France', 'Berlin, Japan', 'Berlin, Netherlands', 'Sydney, Canada', 'Sydney, Germany', 'New York, Sweden', 'Paris, Spain', 'Amsterdam, China'];
    const jsonFields = [{ name: 'financialStatement', label: 'Financial Statement' }, { name: 'transformation_plan', label: 'Careers' }, { name: 'portfolio', label: 'Portfolio' }, { name: 'investors', label: 'Investors' }, { name: 'assessment', label: 'Assessment' }];
    const actionOptions = ["contact us", "apply", "purchase"];

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1 company={company} setCompany={setCompany} categories={categories} locations={locations} />;
            case 2: return <Step2 company={company} setCompany={setCompany} />;
            case 3: return <Step3 company={company} setCompany={setCompany} />;
            case 4: return <Step4 company={company} setCompany={setCompany} handleQuillChange={(content, field) => setCompany({ ...company, [field]: content })} />;
            case 5: return <Step5 company={company} setCompany={setCompany} logoPreview={logoPreview} setLogoPreview={setLogoPreview} handleLogoChange={(e) => { const file = e.target.files[0]; setCompany({ ...company, logoFile: file }); setLogoPreview(URL.createObjectURL(file)); }} jsonFields={jsonFields} handleFileChange={(index, field, e) => { const file = e.target.files[0]; const values = [...company[field]]; values[index].file = file; values[index].fileName = file.name; setCompany({ ...company, [field]: values }); }} handleTopicChange={(index, field, e) => { const values = [...company[field]]; values[index].key = e.target.value; setCompany({ ...company, [field]: values }); }} handleJsonChange={(index, field, content) => { const values = [...company[field]]; values[index].value = content; setCompany({ ...company, [field]: values }); }} addJsonField={(field) => setCompany({ ...company, [field]: [...company[field], { key: '', value: '', action: '', link: '' }] })} removeJsonField={(index, field) => { const values = [...company[field]]; values.splice(index, 1); setCompany({ ...company, [field]: values }); }} handleActionChange={(index, field, e) => { const values = [...company[field]]; values[index].action = e.target.value; setCompany({ ...company, [field]: values }); }} handleLinkChange={(index, field, e) => { const values = [...company[field]]; values[index].link = e.target.value; setCompany({ ...company, [field]: values }); }} actionOptions={actionOptions} />;
            case 6: return <Step6 dynamicSections={dynamicSections} setDynamicSections={setDynamicSections} handleDynamicFileChange={(sectionIndex, itemIndex, e) => { const file = e.target.files[0]; const sections = [...dynamicSections]; sections[sectionIndex].value[itemIndex].file = file; sections[sectionIndex].value[itemIndex].fileName = file.name; setDynamicSections(sections); }} handleDynamicTopicChange={(sectionIndex, itemIndex, e) => { const sections = [...dynamicSections]; sections[sectionIndex].value[itemIndex].key = e.target.value; setDynamicSections(sections); }} handleDynamicSectionChange={(sectionIndex, itemIndex, content) => { const sections = [...dynamicSections]; sections[sectionIndex].value[itemIndex].value = content; setDynamicSections(sections); }} addDynamicItem={(sectionIndex) => { const sections = [...dynamicSections]; sections[sectionIndex].value.push({ key: '', value: '', action: '', link: '' }); setDynamicSections(sections); }} removeDynamicItem={(sectionIndex, itemIndex) => { const sections = [...dynamicSections]; sections[sectionIndex].value.splice(itemIndex, 1); setDynamicSections(sections); }} addDynamicSection={() => setDynamicSections([...dynamicSections, { key: '', value: [{ key: '', value: '', action: '', link: '' }] }])} removeDynamicSection={(sectionIndex) => { const sections = [...dynamicSections]; sections.splice(sectionIndex, 1); setDynamicSections(sections); }} handleDynamicActionChange={(sectionIndex, itemIndex, e) => { const sections = [...dynamicSections]; sections[sectionIndex].value[itemIndex].action = e.target.value; setDynamicSections(sections); }} handleDynamicLinkChange={(sectionIndex, itemIndex, e) => { const sections = [...dynamicSections]; sections[sectionIndex].value[itemIndex].link = e.target.value; setDynamicSections(sections); }} actionOptions={actionOptions} />;
            default: return null;
        }
    };
    return (
        <StyledContainer maxWidth="md">
            <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom>
                    Create Company
                </Typography>
                <form onSubmit={handleSubmit}>
                    {renderStep()}
                    <Grid container justifyContent="space-between" style={{ marginTop: '20px' }}>
                        <Grid item>
                            {currentStep > 1 && (
                                <StyledButton variant="contained" onClick={prevStep}>
                                    Previous
                                </StyledButton>
                            )}
                        </Grid>
                        <Grid item>
                            {currentStep < 6 && (
                                <StyledButton variant="contained" onClick={() => nextStep()}>
                                    Next
                                </StyledButton>
                            )}
                            {currentStep === 6 && (
                                <StyledButton type="submit" variant="contained" color="primary">
                                    Create Company
                                </StyledButton>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </StyledPaper>
        </StyledContainer>
    );
}

function Step1({ company, setCompany, categories, locations }) {
    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={company.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select labelId="category-label" id="category" name="category" value={company.category} label="Category" onChange={handleChange}>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="location-label">Headquarter</InputLabel>
                    <Select labelId="location-label" id="location" name="location" value={company.location} label="Location" onChange={handleChange}>
                        {locations.map((location) => (
                            <MenuItem key={location} value={location}>
                                {location}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="size-label">Size</InputLabel>
                    <Select labelId="size-label" id="size" name="size" value={company.size} label="Size" onChange={handleChange}>
                        <MenuItem value="Less than 50 employees">Less than 50 employees</MenuItem>
                        <MenuItem value="51 - 100 employees">51 - 100</MenuItem>
                        <MenuItem value="101 - 500 employees">101 - 500</MenuItem>
                        <MenuItem value="501 - 1000 employees">501 - 1000</MenuItem>
                        <MenuItem value="1001 - 10000employees">1001 - 10000</MenuItem>
                        <MenuItem value="More than 10000 employees">More than 10000</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

function Step2({ company, setCompany }) {
    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Website" name="website" value={company.website} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Founded Date" type="date" name="founded" value={company.founded} onChange={handleChange} InputLabelProps={{ shrink: true }}/>
            </Grid>
        </Grid>
    );
}

function Step3({ company, setCompany }) {
    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Revenue" name="revenue" type="number" value={company.revenue} onChange={handleChange} />
            </Grid>
        </Grid>
    );
}

function Step4({ company, setCompany, handleQuillChange }) {
    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Mission
                </Typography>
                <ReactQuill value={company.mission} onChange={(content) => handleQuillChange(content, 'mission')} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Description
                </Typography>
                <ReactQuill value={company.description} onChange={(content) => handleQuillChange(content, 'description')} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Company Values (comma-separated)" name="company_values" value={company.company_values} onChange={handleChange} />
            </Grid>
        </Grid>
    );
}

function Step5({ company, setCompany, logoPreview, setLogoPreview, handleLogoChange, jsonFields, handleFileChange, handleTopicChange, handleJsonChange, addJsonField, removeJsonField, handleActionChange, handleLinkChange, actionOptions }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                    Logo
                </Typography>
                <input type="file" accept="image/*" onChange={handleLogoChange} />
                {logoPreview && <img src={logoPreview} alt="Company Logo Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
            </Grid>
            {jsonFields.map((field) => (
                <Grid item xs={12} key={field.name}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        {field.label}
                    </Typography>
                    {company[field.name].map((item, index) => (
                        <div key={index}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Topic" name="key" value={item.key} onChange={(e) => handleTopicChange(index, field.name, e)} />
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: '5px', marginBottom: '5px' }}>
                                <div>
                                    <ReactQuill value={item.value} onChange={(content) => handleJsonChange(index, field.name, content)} placeholder="Details" />
                                </div>
                            </Grid>
                            <Grid item xs={12} container spacing={2} alignItems="center" style={{ marginTop: '5px', marginBottom: '5px' }}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id={`action-label-${index}`}>Action</InputLabel>
                                        <Select labelId={`action-label-${index}`} id={`action-${index}`} name="action" value={item.action} label="Action" onChange={(e) => handleActionChange(index, field.name, e)}>
                                            {actionOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Link" name="link" value={item.link} onChange={(e) => handleLinkChange(index, field.name, e)} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" onChange={(e) => handleFileChange(index, field.name, e)} />
                            </Grid>
                            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={() => removeJsonField(index, field.name)}>
                                    <Remove />
                                </IconButton>
                            </Grid>
                        </div>
                    ))}
                    <Button onClick={() => addJsonField(field.name)}>Add Field</Button>
                </Grid>
            ))}
        </Grid>
    );
}

function Step6({ dynamicSections, setDynamicSections, handleDynamicFileChange, handleDynamicTopicChange, handleDynamicSectionChange, addDynamicItem, removeDynamicItem, addDynamicSection, removeDynamicSection, handleDynamicActionChange, handleDynamicLinkChange, actionOptions }) {
    return (<Grid container spacing={3}>
        {dynamicSections.map((section, sectionIndex) => (
            <Grid item xs={12} key={`section-${sectionIndex}`}>
                <TextField
                    fullWidth
                    label="Section Title"
                    value={section.key}
                    onChange={(e) => {
                        const sections = [...dynamicSections];
                        sections[sectionIndex].key = e.target.value;
                        setDynamicSections(sections);
                    }}
                />
                {section.value.map((item, itemIndex) => (
                    <div key={`item-${itemIndex}`} style={{ marginTop: '5px', marginBottom: '5px' }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Topic"
                                name="key"
                                value={item.key}
                                onChange={(e) => handleDynamicTopicChange(sectionIndex, itemIndex, e)}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginBottom: '5px' }}>
                            <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                                <ReactQuill
                                    value={item.value}
                                    onChange={(content) => handleDynamicSectionChange(sectionIndex, itemIndex, content)}
                                />
                            </div>
                        </Grid><Grid item xs={12} container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id={`dynamic-action-label-${sectionIndex}-${itemIndex}`}>Action</InputLabel>
                                    <Select labelId={`dynamic-action-label-${sectionIndex}-${itemIndex}`} id={`dynamic-action-${sectionIndex}-${itemIndex}`} name="action" value={item.action} label="Action" onChange={(e) => handleDynamicActionChange(sectionIndex, itemIndex, e)}>
                                        {actionOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Link" name="link" value={item.link} onChange={(e) => handleDynamicLinkChange(sectionIndex, itemIndex, e)} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '5px' }}>
                            <input type="file" onChange={(e) => handleDynamicFileChange(sectionIndex, itemIndex, e)} />
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => removeDynamicItem(sectionIndex, itemIndex)}>
                                <Remove />
                            </IconButton>
                        </Grid>
                    </div>
                ))}
                <Button onClick={() => addDynamicItem(sectionIndex)}>Add Item</Button>
                <IconButton onClick={() => removeDynamicSection(sectionIndex)}>
                    <Remove />
                </IconButton>
            </Grid>
        ))}
        <Grid item xs={12}>
            <Button onClick={addDynamicSection}>Add Section</Button>
        </Grid>
    </Grid>
    );
}

export default CompanyForm;