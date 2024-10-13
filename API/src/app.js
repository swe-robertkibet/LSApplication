const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});