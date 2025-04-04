// pages/CreateCompany.js
import React from 'react';
import CompanyForm from '../components/CompanyForm';

function CreateCompany({ username, password }) {
  return <CompanyForm username={username} password={password} />;
}

export default CreateCompany;