const Subscriber = require('../models/subscriber');
const SubscriberBalance = require('../models/subscriberBalance');
const SubscriberBeneficiary = require('../models/subscriberBeneficiary');

class SubscriberController {
  static async createSubscriber(req, res) {
    try {
      const subscriberData = req.body;

      if (!subscriberData.firstname || !subscriberData.surname || !subscriberData.mobile) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const subscriberId = await Subscriber.create(subscriberData);

      // Create balance record
      await SubscriberBalance.create(subscriberId);

      const subscriber = await Subscriber.findById(subscriberId);

      res.status(201).json({ success: true, data: subscriber });
    } catch (error) {
      console.error('Create subscriber error:', error);
      res.status(500).json({ error: 'Failed to create subscriber' });
    }
  }

  static async getSubscriber(req, res) {
    try {
      const { id } = req.params;
      const subscriber = await Subscriber.findById(id);

      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      // Get balance
      const balance = await SubscriberBalance.findBySubscriberId(id);

      res.json({ success: true, data: { ...subscriber, balance } });
    } catch (error) {
      console.error('Get subscriber error:', error);
      res.status(500).json({ error: 'Failed to fetch subscriber' });
    }
  }

  static async updateSubscriber(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const subscriber = await Subscriber.update(id, updateData);

      res.json({ success: true, data: subscriber });
    } catch (error) {
      console.error('Update subscriber error:', error);
      res.status(500).json({ error: 'Failed to update subscriber' });
    }
  }

  static async deleteSubscriber(req, res) {
    try {
      const { id } = req.params;
      await Subscriber.delete(id);

      res.json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
      console.error('Delete subscriber error:', error);
      res.status(500).json({ error: 'Failed to delete subscriber' });
    }
  }

  static async getAllSubscribers(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const subscribers = await Subscriber.getAll(parseInt(limit), parseInt(offset));

      res.json({ success: true, data: subscribers });
    } catch (error) {
      console.error('Get all subscribers error:', error);
      res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
  }

  // Balance operations
  static async getSubscriberBalance(req, res) {
    try {
      const { id } = req.params;
      const balance = await SubscriberBalance.findBySubscriberId(id);

      if (!balance) {
        return res.status(404).json({ error: 'Balance not found' });
      }

      res.json({ success: true, data: balance });
    } catch (error) {
      console.error('Get subscriber balance error:', error);
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  }

  static async updateSubscriberBalance(req, res) {
    try {
      const { id } = req.params;
      const balanceData = req.body;

      const balance = await SubscriberBalance.updateBalance(id, balanceData);

      res.json({ success: true, data: balance });
    } catch (error) {
      console.error('Update subscriber balance error:', error);
      res.status(500).json({ error: 'Failed to update balance' });
    }
  }

  // Beneficiaries
  static async addBeneficiary(req, res) {
    try {
      const { id } = req.params;
      const { beneficiary_surname, percent_benefit } = req.body;

      if (!beneficiary_surname || !percent_benefit) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await SubscriberBeneficiary.create({
        subscriber_id: id,
        beneficiary_surname,
        percent_benefit
      });

      const beneficiaries = await SubscriberBeneficiary.findBySubscriberId(id);

      res.status(201).json({ success: true, data: beneficiaries });
    } catch (error) {
      console.error('Add beneficiary error:', error);
      res.status(500).json({ error: 'Failed to add beneficiary' });
    }
  }

  static async getBeneficiaries(req, res) {
    try {
      const { id } = req.params;
      const beneficiaries = await SubscriberBeneficiary.findBySubscriberId(id);

      res.json({ success: true, data: beneficiaries });
    } catch (error) {
      console.error('Get beneficiaries error:', error);
      res.status(500).json({ error: 'Failed to fetch beneficiaries' });
    }
  }
}

module.exports = SubscriberController;
