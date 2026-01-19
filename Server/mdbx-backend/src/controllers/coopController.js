const Coop = require('../models/coop');
const CoopMember = require('../models/coopMember');

class CoopController {
  static async createCoop(req, res) {
    try {
      const coopData = req.body;

      if (!coopData.coop_id || !coopData.coop_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const coop = await Coop.create(coopData);

      res.status(201).json({ success: true, data: coop });
    } catch (error) {
      console.error('Create coop error:', error);
      res.status(500).json({ error: 'Failed to create coop' });
    }
  }

  static async getCoop(req, res) {
    try {
      const { id } = req.params;
      const coop = await Coop.findById(id);

      if (!coop) {
        return res.status(404).json({ error: 'Coop not found' });
      }

      res.json({ success: true, data: coop });
    } catch (error) {
      console.error('Get coop error:', error);
      res.status(500).json({ error: 'Failed to fetch coop' });
    }
  }

  static async updateCoop(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const coop = await Coop.update(id, updateData);

      res.json({ success: true, data: coop });
    } catch (error) {
      console.error('Update coop error:', error);
      res.status(500).json({ error: 'Failed to update coop' });
    }
  }

  static async deleteCoop(req, res) {
    try {
      const { id } = req.params;
      await Coop.delete(id);

      res.json({ success: true, message: 'Coop deleted successfully' });
    } catch (error) {
      console.error('Delete coop error:', error);
      res.status(500).json({ error: 'Failed to delete coop' });
    }
  }

  static async getAllCoops(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const coops = await Coop.getAll(parseInt(limit), parseInt(offset));

      res.json({ success: true, data: coops });
    } catch (error) {
      console.error('Get all coops error:', error);
      res.status(500).json({ error: 'Failed to fetch coops' });
    }
  }

  // Coop Members
  static async addCoopMember(req, res) {
    try {
      const memberData = req.body;

      if (!memberData.coop_id || !memberData.member_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const member = await CoopMember.create(memberData);

      res.status(201).json({ success: true, data: member });
    } catch (error) {
      console.error('Add coop member error:', error);
      res.status(500).json({ error: 'Failed to add coop member' });
    }
  }

  static async getCoopMembers(req, res) {
    try {
      const { coopId } = req.params;
      const members = await CoopMember.findByCoopId(coopId);

      res.json({ success: true, data: members });
    } catch (error) {
      console.error('Get coop members error:', error);
      res.status(500).json({ error: 'Failed to fetch coop members' });
    }
  }

  static async updateCoopMember(req, res) {
    try {
      const { coopId } = req.params;
      const updateData = req.body;

      const member = await CoopMember.update(coopId, updateData);

      res.json({ success: true, data: member });
    } catch (error) {
      console.error('Update coop member error:', error);
      res.status(500).json({ error: 'Failed to update coop member' });
    }
  }
}

module.exports = CoopController;
