const { Project, Customer } = require('../models');
const { Op } = require('sequelize');

exports.createProject = async (req, res, next) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

exports.getAllProjects = async (req, res, next) => {
    try {
        const { search, isArchived } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        if (isArchived !== undefined) {
            where.isArchived = isArchived === 'true';
        }

        const projects = await Project.findAll({
            where,
            include: [{ model: Customer, attributes: ['id', 'name'] }],
        });
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [{ model: Customer }],
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const [updated] = await Project.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const updatedProject = await Project.findByPk(req.params.id);
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const deleted = await Project.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.archiveProject = async (req, res, next) => {
    try {
        const [updated] = await Project.update(
            { isArchived: true },
            { where: { id: req.params.id } }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project archived successfully' });
    } catch (error) {
        next(error);
    }
};

exports.bulkArchiveProjects = async (req, res, next) => {
    try {
        const { ids } = req.body;
        await Project.update(
            { isArchived: true },
            { where: { id: ids } }
        );
        res.json({ message: 'Projects archived successfully' });
    } catch (error) {
        next(error);
    }
};
