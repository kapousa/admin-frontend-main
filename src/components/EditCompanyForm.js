import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Box,
} from '@mui/material';
import { Remove } from '@mui/icons-material';
import { styled } from '@mui/system';
import { getCompany } from '../services/api';
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

function EditCompanyForm({ username, password }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [dynamicSections, setDynamicSections] = useState([{ key: '', value: [{ key: '', value: '', action: '', link: '' }] }]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    getCompany(id, username, password)
      .then((response) => {
        const companyData = {
          ...response.data,
          company_values: response.data.company_values.join(', '),
        };
        setCompany(companyData);
        setLogoPreview(response.data.logo);
        if (response.data.dynamicSections) {
          setDynamicSections(response.data.dynamicSections);
        }
      })
      .catch((error) => console.error('Error fetching company details:', error));
  }, [id, username, password]);

  useEffect(() => {
    if (company && company.dynamicSections) {
      setDynamicSections(company.dynamicSections);
    }
  }, [company]);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleTopicChange = (index, field, e) => {
    const values = [...company[field]];
    values[index].key = e.target.value;
    setCompany({ ...company, [field]: values });
  };

  const handleDynamicTopicChange = (sectionIndex, itemIndex, e) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value[itemIndex].key = e.target.value;
    setDynamicSections(sections);
  };

  const handleJsonChange = (index, field, content) => {
    const values = [...company[field]];
    values[index].value = content;
    setCompany({ ...company, [field]: values });
  };

  const handleDynamicSectionChange = (sectionIndex, itemIndex, content) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value[itemIndex].value = content;
    setDynamicSections(sections);
  };

  const addJsonField = (field) => {
    setCompany({ ...company, [field]: [...company[field], { key: '', value: '', action: '', link: '' }] });
  };

  const removeJsonField = (index, field) => {
    const values = [...company[field]];
    values.splice(index, 1);
    setCompany({ ...company, [field]: values });
  };

  const addDynamicItem = (sectionIndex) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value.push({ key: '', value: '', action: '', link: '' });
    setDynamicSections(sections);
  };

  const removeDynamicItem = (sectionIndex, itemIndex) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value.splice(itemIndex, 1);
    setDynamicSections(sections);
  };

  const addDynamicSection = () => {
    setDynamicSections([...dynamicSections, { key: '', value: [{ key: '', value: '', action: '', link: '' }] }]);
  };

  const removeDynamicSection = (sectionIndex) => {
    const sections = [...dynamicSections];
    sections.splice(sectionIndex, 1);
    setDynamicSections(sections);
  };

  const handleFileChange = (index, field, e) => {
    const file = e.target.files[0];
    const values = [...company[field]];
    values[index].file = file;
    values[index].fileName = file.name;
    setCompany({ ...company, [field]: values });
  };

  const handleDynamicFileChange = (sectionIndex, itemIndex, e) => {
    const file = e.target.files[0];
    const sections = [...dynamicSections];
    sections[sectionIndex].value[itemIndex].file = file;
    sections[sectionIndex].value[itemIndex].fileName = file.name;
    setDynamicSections(sections);
  };

  const handleActionChange = (index, field, e) => {
    const values = [...company[field]];
    values[index].action = e.target.value;
    setCompany({ ...company, [field]: values });
  };

  const handleLinkChange = (index, field, e) => {
    const values = [...company[field]];
    values[index].link = e.target.value;
    setCompany({ ...company, [field]: values });
  };

  const handleDynamicActionChange = (sectionIndex, itemIndex, e) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value[itemIndex].action = e.target.value;
    setDynamicSections(sections);
  };

  const handleDynamicLinkChange = (sectionIndex, itemIndex, e) => {
    const sections = [...dynamicSections];
    sections[sectionIndex].value[itemIndex].link = e.target.value;
    setDynamicSections(sections);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    let companyData = {
      ...company,
      company_values: company.company_values.split(',').map((value) => value.trim()),
      dynamicSections: dynamicSections,
    };

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    for (let field of ['financialStatement', 'investors', 'assessment', 'portfolio']) {
      for (let item of companyData[field]) {
        if (item.file) {
          formData.append('request_files', item.file);
          item.value = item.fileName;
          delete item.file;
        }
      }
    }

    for (let section of companyData.dynamicSections) {
      for (let item of section.value) {
        if (item.file) {
          formData.append('request_files', item.file);
          item.value = item.fileName;
          delete item.file;
        }
      }
    }

    for (const key in companyData) {
      if (
        key === 'company_values' ||
        key === 'investors' ||
        key === 'financialStatement' ||
        key === 'assessment' ||
        key === 'portfolio' ||
        key === 'dynamicSections'
      ) {
        formData.append(key, JSON.stringify(companyData[key]));
      } else if (key !== 'logoFile') {
        formData.append(key, companyData[key]);
      }
    }

    console.log(formData);

    try {
      await axios.put(`${API_BASE_URL}/admin/companies/${id}`, formData, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      });
      navigate('/admin/companies');
    } catch (error) {
      console.error('Error updating company:', error);
      console.log(error.response.data);
    }
  };

  const categories = [
    'Technology',
    'Retail',
    'Health Care',
    'Finance',
    'Manufacturing',
    'Education',
    'Hospitality',
    'Transportation',
    'Energy',
    'Agriculture',
  ];

  const locations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Australia',
    'South Africa',
    'Nigeria',
    'Mexico',
    'Russia',
    'Italy',
    'Spain',
    'Netherlands',
    'Switzerland',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Singapore',
    'South Korea',
    'Argentina',
    'Turkey',
    'Indonesia',
    'Saudi Arabia',
    'Egypt',
    'Thailand',
    'Vietnam',
    'Malaysia',
    'Philippines',
    'Pakistan',
    'Bangladesh',
    'Ireland',
    'Portugal',
    'Austria',
    'Belgium',
    'Poland',
    'Hungary',
    'Czech Republic',
    'Greece',
    'Romania',
    'Ukraine',
    'United Arab Emirates',
    'Kuwait',
    'Qatar',
    'New Zealand',
    'Chile',
    'Colombia',
    'Peru',
    'Morocco',
    'Algeria',
  ];

  const jsonFields = [
    { name: 'financialStatement', label: 'Financial Statement' },
    { name: 'portfolio', label: 'Portfolio' },
    { name: 'investors', label: 'Investors' },
    { name: 'assessment', label: 'Assessment' },
  ];
  const actionOptions = ['contact us', 'apply', 'purchase'];

  if (!company) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Edit Company
        </Typography>
        <form onSubmit={handleSubmit}>
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
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Website" name="website" value={company.website} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Founded Date" name="founded" value={company.founded} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Headquarters" name="headquarters" value={company.headquarters} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Revenue" name="revenue" type="number" value={company.revenue} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Mission
              </Typography>
              <ReactQuill
                value={company.mission}
                onChange={(content) => handleJsonChange(0, 'mission', content)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Description
              </Typography>
              <ReactQuill
                value={company.description}
                onChange={(content) => handleJsonChange(0, 'description', content)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Company Values (comma-separated)" name="company_values" value={company.company_values} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
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
                    <Box display="flex" gap="8px">
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id={`action-label-${field.name}-${index}`}>Action</InputLabel>
                          <Select
                            labelId={`action-label-${field.name}-${index}`}
                            id={`action-${field.name}-${index}`}
                            name={`action-${field.name}-${index}`}
                            value={item.action}
                            label="Action"
                            onChange={(e) => handleActionChange(index, field.name, e)}
                          >
                            {actionOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Link"
                          name="link"
                          value={item.link}
                          onChange={(e) => handleLinkChange(index, field.name, e)}
                        />
                      </Grid>
                    </Box>
                    <Grid item xs={12}>
                      <input type="file" onChange={(e) => handleFileChange(index, field.name, e)} />
                      {item.fileName && (
                        <a
                          href={`${item.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      )}
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
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Dynamic Sections
              </Typography>
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
                      </Grid>
                      <Box display="flex" gap="8px">
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id={`dynamic-action-label-${sectionIndex}-${itemIndex}`}>Action</InputLabel>
                            <Select
                              labelId={`dynamic-action-label-${sectionIndex}-${itemIndex}`}
                              id={`dynamic-action-${sectionIndex}-${itemIndex}`}
                              name={`dynamic-action-${sectionIndex}-${itemIndex}`}
                              value={item.action}
                              label="Action"
                              onChange={(e) => handleDynamicActionChange(sectionIndex, itemIndex, e)}
                            >
                              {actionOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Link"
                            name="link"
                            value={item.link}
                            onChange={(e) => handleDynamicLinkChange(sectionIndex, itemIndex, e)}
                          />
                        </Grid>
                      </Box>
                      <Grid item xs={12}>
                        <input type="file" onChange={(e) => handleDynamicFileChange(sectionIndex, itemIndex, e)} />
                        {item.fileName && (
                          <a
                            href={`${item.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        )}
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
              <Button onClick={addDynamicSection}>Add Section</Button>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <StyledButton type="submit" variant="contained" color="primary">
                Update Company
              </StyledButton>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
}

export default EditCompanyForm;