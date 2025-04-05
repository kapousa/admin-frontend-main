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
    'London, China',
    'Madrid, Japan',
    'London, France',
    'Berlin, Japan',
    'Berlin, Netherlands',
    'Sydney, Canada',
    'Sydney, Germany',
    'New York, Sweden',
    'Paris, Spain',
    'Amsterdam, China',
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
            {/* ... other form fields ... */}
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
                    <Grid item xs={12}>
                      {item.fileName ? (
                        <a
                          href={`${item.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        <input type="file" onChange={(e) => handleFileChange(index, field.name, e)} />
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
            {/* ... dynamic sections ... */}
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
                      <Grid item xs={12}>
                        {item.fileName ? (
                          <a
                            href={`${item.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        ) : (
                          <input type="file" onChange={(e) => handleDynamicFileChange(sectionIndex, itemIndex, e)} />
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
            {/* ... submit button ... */}
          </Grid>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
}

export default EditCompanyForm;