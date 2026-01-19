const Grant = require('../models/grant');

class GrantController {
  static async createGrant(req, res) {
    try {
      const grantData = req.body;

      if (!grantData.grants_year) {
        return res.status(400).json({ error: 'Missing grants_year' });
      }

      const grant = await Grant.create(grantData);

      res.status(201).json({ success: true, data: grant });
    } catch (error) {
      console.error('Create grant error:', error);
      res.status(500).json({ error: 'Failed to create grant' });
    }
  }

  static async getGrant(req, res) {
    try {
      const { year } = req.params;
      const grant = await Grant.findByYear(year);

      if (!grant) {
        return res.status(404).json({ error: 'Grant not found' });
      }

      res.json({ success: true, data: grant });
    } catch (error) {
      console.error('Get grant error:', error);
      res.status(500).json({ error: 'Failed to fetch grant' });
    }
  }

  static async updateGrant(req, res) {
    try {
      const { year } = req.params;
      const updateData = req.body;

      const grant = await Grant.update(year, updateData);

      res.json({ success: true, data: grant });
    } catch (error) {
      console.error('Update grant error:', error);
      res.status(500).json({ error: 'Failed to update grant' });
    }
  }

  static async getAllGrants(req, res) {
    try {
      const grants = await Grant.getAll();

      res.json({ success: true, data: grants });
    } catch (error) {
      console.error('Get all grants error:', error);
      res.status(500).json({ error: 'Failed to fetch grants' });
    }
  }

  static async recordGrantGiven(req, res) {
    try {
      const { year } = req.params;
      const { grantType } = req.body;

      if (!['cash01', 'cash02', 'cash03', 'cash04', 'egfed'].includes(grantType)) {
        return res.status(400).json({ error: 'Invalid grant type' });
      }

      const grant = await Grant.incrementGrantGiven(year, grantType);

      res.json({ success: true, data: grant });
    } catch (error) {
      console.error('Record grant given error:', error);
      res.status(500).json({ error: 'Failed to record grant' });
    }
  }
}

module.exports = GrantController;
