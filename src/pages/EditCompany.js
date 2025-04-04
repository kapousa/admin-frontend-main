// pages/EditCompany.js
import React from 'react';
import EditCompanyForm from '../components/EditCompanyForm';
import { useParams } from 'react-router-dom';

function EditCompany({ username, password }) {
  const { id } = useParams(); // Get the company ID from the URL

  return <EditCompanyForm username={username} password={password} id={id} />;
}

export default EditCompany;