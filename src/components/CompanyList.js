// components/CompanyList.js
import React, { useState, useEffect } from 'react';
import { getCompanies } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Avatar,
  Typography,
} from '@mui/material';

function CompanyList({ username, password }) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompanies(username, password)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, [username, password]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Company</b></TableCell>
            <TableCell><b>Category</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {company.logo && (
                    <Avatar
                      src={company.logo}
                      alt={`${company.name} Logo`}
                      sx={{ width: 40, height: 40, marginRight: 1 }}
                    />
                  )}
                  <Typography>{company.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{company.category}</TableCell>
              <TableCell>
                <Button component={Link} to={`/companies/${company.id}`} variant="outlined" size="small">
                  View
                </Button>
                <Button component={Link} to={`/companies/edit/${company.id}`} variant="outlined" size="small">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button component={Link} to="/admin/companies/add" variant="contained" style={{ margin: '20px' }}>
        Create Company
      </Button>
    </TableContainer>
  );
}

export default CompanyList;