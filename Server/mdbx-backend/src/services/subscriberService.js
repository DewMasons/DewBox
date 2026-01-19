const Subscriber = require('../models/subscriber');
const SubscriberBalance = require('../models/subscriberBalance');
const SubscriberBeneficiary = require('../models/subscriberBeneficiary');
const YearlySummary = require('../models/yearlySummary');

class SubscriberService {
  static async createCompleteSubscriber(subscriberData, beneficiariesData = []) {
    try {
      // Create subscriber
      const subscriberId = await Subscriber.create(subscriberData);

      // Create balance record
      await SubscriberBalance.create(subscriberId);

      // Create yearly summary for current year
      const currentYear = new Date().getFullYear();
      await YearlySummary.create({
        year: currentYear,
        subscriber_id: subscriberId
      });

      // Add beneficiaries if provided
      if (beneficiariesData.length > 0) {
        for (const beneficiary of beneficiariesData) {
          await SubscriberBeneficiary.create({
            subscriber_id: subscriberId,
            ...beneficiary
          });
        }
      }

      return await this.getSubscriberProfile(subscriberId);
    } catch (error) {
      console.error('Create complete subscriber error:', error);
      throw error;
    }
  }

  static async getSubscriberProfile(subscriberId) {
    try {
      const subscriber = await Subscriber.findById(subscriberId);
      
      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      const balance = await SubscriberBalance.findBySubscriberId(subscriberId);
      const beneficiaries = await SubscriberBeneficiary.findBySubscriberId(subscriberId);
      const yearlyData = await YearlySummary.findBySubscriberId(subscriberId);

      return {
        subscriber,
        balance,
        beneficiaries,
        yearlyData
      };
    } catch (error) {
      console.error('Get subscriber profile error:', error);
      throw error;
    }
  }

  static async updateSubscriberProfile(subscriberId, updateData) {
    try {
      const { subscriberInfo, balanceInfo, beneficiaries } = updateData;

      // Update subscriber info
      if (subscriberInfo) {
        await Subscriber.update(subscriberId, subscriberInfo);
      }

      // Update balance info
      if (balanceInfo) {
        await SubscriberBalance.updateBalance(subscriberId, balanceInfo);
      }

      // Update beneficiaries
      if (beneficiaries) {
        // This is simplified - in production you'd handle add/update/delete
        for (const beneficiary of beneficiaries) {
          if (beneficiary.isNew) {
            await SubscriberBeneficiary.create({
              subscriber_id: subscriberId,
              ...beneficiary
            });
          }
        }
      }

      return await this.getSubscriberProfile(subscriberId);
    } catch (error) {
      console.error('Update subscriber profile error:', error);
      throw error;
    }
  }

  static async getSubscriberStats(subscriberId) {
    try {
      const balance = await SubscriberBalance.findBySubscriberId(subscriberId);
      const yearlyData = await YearlySummary.findBySubscriberId(subscriberId);

      const stats = {
        totalContributed: balance?.ytd_contributed || 0,
        availableBalance: balance?.available_balance || 0,
        monthlyContribution: balance?.mtd_contributed || 0,
        yearlyBreakdown: yearlyData || []
      };

      return stats;
    } catch (error) {
      console.error('Get subscriber stats error:', error);
      throw error;
    }
  }
}

module.exports = SubscriberService;
