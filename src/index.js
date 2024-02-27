require('dotenv').config()
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const middlewareLogRequest = require('./middleware/logs');
app.use(middlewareLogRequest);

const apiKeyMiddleware = require('./middleware/x-api-key');
app.use(apiKeyMiddleware);


// route authentication
const authenticationRoutes = require('./routes/authentication');
app.use('/authentication', authenticationRoutes);


// route service user
const usersRoutes = require('./routes/cms/users');
app.use('/cms/users', usersRoutes);

// route service roles
const rolesRoutes = require('./routes/cms/roles');
app.use('/cms/roles', rolesRoutes);

// route service roles
const managementRolesRoutes = require('./routes/cms/management-roles');
app.use('/cms/management-roles', managementRolesRoutes);



app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
})