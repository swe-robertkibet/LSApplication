const { Customer, Project } = require('../models');
const { Op } = require('sequelize');

exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};

exports.getAllCustomers = async (req, res, next) => {
    try {
        const { search, isArchived } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ];
        }

        if (isArchived !== undefined) {
            where.isArchived = isArchived === 'true';
        }

        const customers = await Customer.findAll({ where });
        res.json(customers);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{ model: Project }],
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const [updated] = await Customer.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const updatedCustomer = await Customer.findByPk(req.params.id);
        res.json(updatedCustomer);
    } catch (error) {
        next(error);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const deleted = await Customer.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.archiveCustomer = async (req, res, next) => {
    try {
        const [updated] = await Customer.update(
            { isArchived: true },
            { where: { id: req.params.id } }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer archived successfully' });
    } catch (error) {
        next(error);
    }
};

exports.bulkArchiveCustomers = async (req, res, next) => {
    try {
        const { ids } = req.body;
        await Customer.update(
            { isArchived: true },
            { where: { id: ids } }
        );
        res.json({ message: 'Customers archived successfully' });
    } catch (error) {
        next(error);
    }
};

exports.checkEmailExists = async (req, res, next) => {
    try {
        const { email } = req.query;
        const customer = await Customer.findOne({ where: { email } });
        res.json({ exists: !!customer });
    } catch (error) {
        next(error);
    }
};