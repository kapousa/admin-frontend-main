import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Import your logo
import Companies from './pages/Companies';
import CreateCompany from './pages/CreateCompany';
import EditCompany from './pages/EditCompany';
import ViewCompany from './pages/ViewCompany';
import LoginPage from './components/LoginPage';
import UserList from './components/UserList'; // Import UserList
import UserForm from './components/UserForm'; // Import UserForm
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSuccess = (user, pass) => {
    setIsLoggedIn(true);
    setUsername(user);
    setPassword(pass);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img
            src={logo}
            alt="Company Logo"
            style={{ height: '40px', marginRight: '16px', flexGrow: 0 }}
          />
          </Typography>
          
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/admin/companies">Companies</Button>
              <Button color="inherit" component={Link} to="/admin/users">Users</Button> {/* Add Users Link */}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/admin/companies" replace /> : <Navigate to="/login" replace />} />
          <Route path="/admin/companies" element={isLoggedIn ? <Companies username={username} password={password} /> : <Navigate to="/login" replace />} />
          <Route path="/admin/companies/add" element={isLoggedIn ? <CreateCompany username={username} password={password} /> : <Navigate to="/login" replace />} />
          <Route path="/companies/edit/:id" element={isLoggedIn ? <EditCompany username={username} password={password} /> : <Navigate to="/login" replace />} />
          <Route path="/companies/:id" element={isLoggedIn ? <ViewCompany username={username} password={password} /> : <Navigate to="/login" replace />} />
          <Route path="/admin/users" element={isLoggedIn ? <UserList username={username} password={password} /> : <Navigate to="/login" replace />} /> {/* User list route */}
          <Route path="/admin/users/add" element={isLoggedIn ? <UserForm username={username} password={password} /> : <Navigate to="/login" replace />} /> {/* Add user route */}
          <Route path="/admin/users/edit/:id" element={isLoggedIn ? <UserForm username={username} password={password} /> : <Navigate to="/login" replace />} /> {/* Edit user route */}
          <Route path="*" element={<Navigate to="/login" replace />}/>
        </Routes>
      </div>
    </Router>
     </ThemeProvider>
  );
}

export default App;