const Coop = require('../models/coop');
const CoopMember = require('../models/coopMember');

class CoopService {
  static async createCoopWithMembers(coopData, membersData) {
    try {
      // Create coop
      const coop = await Coop.create(coopData);

      // Add members if provided
      if (membersData && membersData.length > 0) {
        for (const memberData of membersData) {
          await CoopMember.create({
            ...memberData,
            coop_id: coopData.coop_id
          });
        }
      }

      const members = await CoopMember.findByCoopId(coopData.coop_id);

      return { coop, members };
    } catch (error) {
      console.error('Create coop with members error:', error);
      throw error;
    }
  }

  static async getCoopDetails(coopId) {
    try {
      const coop = await Coop.findById(coopId);
      
      if (!coop) {
        throw new Error('Coop not found');
      }

      const members = await CoopMember.findByCoopId(coopId);

      return { coop, members };
    } catch (error) {
      console.error('Get coop details error:', error);
      throw error;
    }
  }

  static async processCoopLoan(coopId, memberData) {
    try {
      const {
        coop_mdbx_subscriber_id,
        coop_loan_collected,
        date_loan_disbursed,
        date_loan_matures,
        loan_repayment_frequency
      } = memberData;

      // Update member loan information
      await CoopMember.update(coopId, {
        coop_loan_collected,
        date_loan_disbursed,
        date_loan_matures,
        loan_repayment_frequency,
        coop_loan_repaid: 0
      });

      return await CoopMember.findByCoopId(coopId);
    } catch (error) {
      console.error('Process coop loan error:', error);
      throw error;
    }
  }

  static async recordLoanRepayment(coopId, repaymentAmount) {
    try {
      const members = await CoopMember.findByCoopId(coopId);
      
      if (!members || members.length === 0) {
        throw new Error('Coop member not found');
      }

      const member = members[0];
      const newRepayment = parseFloat(member.coop_loan_repayment || 0) + repaymentAmount;
      const newRepaid = parseFloat(member.coop_loan_repaid || 0) + repaymentAmount;

      await CoopMember.update(coopId, {
        coop_loan_repayment: newRepayment,
        coop_loan_repaid: newRepaid
      });

      return await CoopMember.findByCoopId(coopId);
    } catch (error) {
      console.error('Record loan repayment error:', error);
      throw error;
    }
  }

  static async processCoopInvestment(coopId, investmentData) {
    try {
      const {
        coop_investment,
        date_investment_begins,
        date_investment_matures,
        investment_repayment_frequency
      } = investmentData;

      await CoopMember.update(coopId, {
        coop_investment,
        date_investment_begins,
        date_investment_matures,
        investment_repayment_frequency,
        coop_investment_payback: 0
      });

      return await CoopMember.findByCoopId(coopId);
    } catch (error) {
      console.error('Process coop investment error:', error);
      throw error;
    }
  }
}

module.exports = CoopService;
