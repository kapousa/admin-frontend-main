import React from 'react';
import CompanyList from '../components/CompanyList';

function Companies({ username, password }) {
  return <CompanyList username={username} password={password} />;
}

export default Companies;