// components/CompanyDetails.js
import React, { useState, useEffect } from 'react';
import { getCompany } from '../services/api';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Box, Avatar } from '@mui/material';


function CompanyDetails({ username, password }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompany(id, username, password)
      .then((response) => {
        const adjustedCompany = adjustCompanyData(response.data);
        setCompany(adjustedCompany);
      })
      .catch((error) => console.error('Error fetching company details:', error));
  }, [id, username, password]);

  const adjustCompanyData = (companyData) => {
    const adjustItems = (items) => {
      return items.map((item) => {
        // Check for fileName directly in the item
        if (typeof item.value === 'string' && item.fileName) {
          return {
            ...item,
            file: {
              file_url: `${item.fileName}`, // Construct the URL
              filename: item.fileName,
            },
          };
        }
        return item;
      });
    };
  
    const adjustSections = (sections) => {
      return sections.map((section) => ({
        ...section,
        value: adjustItems(section.value),
      }));
    };
  
    return {
      ...companyData,
      financialStatement: adjustItems(companyData.financialStatement),
      transformation_plan: adjustItems(companyData.transformation_plan),
      portfolio: adjustItems(companyData.portfolio),
      investors: adjustItems(companyData.investors),
      assessment: adjustItems(companyData.assessment),
      dynamicSections: companyData.dynamicSections ? adjustSections(companyData.dynamicSections) : [],
    };
  };

  if (!company) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          {company.logo && (
            <Avatar
              src={company.logo}
              alt={`${company.name} Logo`}
              sx={{ width: 60, height: 60, marginRight: 2 }}
            />
          )}
          <Typography variant="h4" gutterBottom>
            {company.name}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Category:</strong> {company.category}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Size:</strong> {company.size}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Headquarter:</strong> {company.location}</Typography>
          </Grid>
          {/*
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Employees:</strong> {company.employees}</Typography>
          </Grid>
          */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Website:</strong> {company.website}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Revenue:</strong> {company.revenue}</Typography>
          </Grid>
          {/*
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Profit:</strong> {company.profit}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Assets:</strong> {company.assets}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Liabilities:</strong> {company.liabilities}</Typography>
          </Grid>
          */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Founded:</strong> {company.founded}</Typography>
          </Grid>
          {/*
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><strong>Headquarters:</strong> {company.headquarters}</Typography>
          </Grid>
          */}
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Description</strong>
              <div dangerouslySetInnerHTML={{ __html: company.description }} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Mission</strong>
              <div dangerouslySetInnerHTML={{ __html: company.mission }} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Company Values</strong> 
              <div>
                {company.company_values.join(', ')}
              </div>
              </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"><h3>Portfolio</h3></Typography>
            {company.portfolio.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.key}
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
                {item.file && item.file.filename && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                      Download
                    </a>
                  </Typography>
                )}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"><h3>Financial Statement</h3></Typography>
            {company.financialStatement.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.key}
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
                {item.file && item.file.filename && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                      Download
                    </a>
                  </Typography>
                )}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"><h3>Assessment</h3></Typography>
            {company.transformation_plan.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.key}
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
                {item.file && item.file.filename && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                      Download
                    </a>
                  </Typography>
                )}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"><h3>Investors</h3></Typography>
            {company.investors.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.key}
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
                {item.file && item.file.filename && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                      Download
                    </a>
                  </Typography>
                )}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"><h3>Assessment</h3></Typography>
            {company.assessment.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.key}
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
                {item.file && item.file.filename && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                      Download
                    </a>
                  </Typography>
                )}
              </Typography>
            ))}
          </Grid>
          {company.dynamicSections && company.dynamicSections.map((section, sectionIndex) => (
            <Grid item xs={12} key={`section-${sectionIndex}`}>
              <Typography variant="subtitle1">
                <h3>{section.key}</h3>
              </Typography>
              {section.value.map((item, itemIndex) => (
                <Typography key={`item-${itemIndex}`} variant="body2">
                  {item.key}
                  <div dangerouslySetInnerHTML={{ __html: item.value }} />
                  {item.file && item.file.filename && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" download={item.file.filename}>
                        Download
                      </a>
                    </Typography>
                  )}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default CompanyDetails;