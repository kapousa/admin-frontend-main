// pages/ViewCompany.js
import React from 'react';
import CompanyDetails from '../components/CompanyDetails';
import { useParams } from 'react-router-dom';

function ViewCompany({ username, password }) {
  const { id } = useParams(); // Get the company ID from the URL

  return <CompanyDetails username={username} password={password} id={id} />;
}

export default ViewCompany;