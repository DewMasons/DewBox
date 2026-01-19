const { CoopType, TransactionType, DeviceType, ServiceChannel } = require('../models/lookupTables');
const locationService = require('../services/locationService');

class LookupController {
  // Coop Types
  static async getCoopTypes(req, res) {
    try {
      const types = await CoopType.getAll();
      res.json({ success: true, data: types });
    } catch (error) {
      console.error('Get coop types error:', error);
      res.status(500).json({ error: 'Failed to fetch coop types' });
    }
  }

  static async createCoopType(req, res) {
    try {
      const { coop_type_id, coop_type_description } = req.body;
      const type = await CoopType.create({ coop_type_id, coop_type_description });
      res.status(201).json({ success: true, data: type });
    } catch (error) {
      console.error('Create coop type error:', error);
      res.status(500).json({ error: 'Failed to create coop type' });
    }
  }

  // Transaction Types
  static async getTransactionTypes(req, res) {
    try {
      const types = await TransactionType.getAll();
      res.json({ success: true, data: types });
    } catch (error) {
      console.error('Get transaction types error:', error);
      res.status(500).json({ error: 'Failed to fetch transaction types' });
    }
  }

  static async createTransactionType(req, res) {
    try {
      const { transaction_type_id, transaction_type } = req.body;
      const type = await TransactionType.create({ transaction_type_id, transaction_type });
      res.status(201).json({ success: true, data: type });
    } catch (error) {
      console.error('Create transaction type error:', error);
      res.status(500).json({ error: 'Failed to create transaction type' });
    }
  }

  // Device Types
  static async getDeviceTypes(req, res) {
    try {
      const types = await DeviceType.getAll();
      res.json({ success: true, data: types });
    } catch (error) {
      console.error('Get device types error:', error);
      res.status(500).json({ error: 'Failed to fetch device types' });
    }
  }

  static async createDeviceType(req, res) {
    try {
      const { device_used_id, device_name } = req.body;
      const type = await DeviceType.create({ device_used_id, device_name });
      res.status(201).json({ success: true, data: type });
    } catch (error) {
      console.error('Create device type error:', error);
      res.status(500).json({ error: 'Failed to create device type' });
    }
  }

  // Service Channels
  static async getServiceChannels(req, res) {
    try {
      const channels = await ServiceChannel.getAll();
      res.json({ success: true, data: channels });
    } catch (error) {
      console.error('Get service channels error:', error);
      res.status(500).json({ error: 'Failed to fetch service channels' });
    }
  }

  static async createServiceChannel(req, res) {
    try {
      const { service_channel_id, service_channel_description } = req.body;
      const channel = await ServiceChannel.create({ service_channel_id, service_channel_description });
      res.status(201).json({ success: true, data: channel });
    } catch (error) {
      console.error('Create service channel error:', error);
      res.status(500).json({ error: 'Failed to create service channel' });
    }
  }

  // Location APIs - Countries, States, Cities, LGAs
  static async getCountries(req, res) {
    try {
      const countries = await locationService.getCountries();
      res.json({ success: true, data: countries });
    } catch (error) {
      console.error('Get countries error:', error);
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  }

  static async getStates(req, res) {
    try {
      const { country } = req.query;
      if (!country) {
        return res.status(400).json({ error: 'Country name is required' });
      }
      const states = await locationService.getStates(country);
      res.json({ success: true, data: states });
    } catch (error) {
      console.error('Get states error:', error);
      res.status(500).json({ error: 'Failed to fetch states' });
    }
  }

  static async getCities(req, res) {
    try {
      const { country, state } = req.query;
      if (!country || !state) {
        return res.status(400).json({ error: 'Country and state names are required' });
      }
      const cities = await locationService.getCities(country, state);
      res.json({ success: true, data: cities });
    } catch (error) {
      console.error('Get cities error:', error);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  }

  static async getLGAs(req, res) {
    try {
      const { country, state } = req.query;
      
      if (!state) {
        return res.status(400).json({ error: 'State name is required' });
      }
      
      console.log('📍 LGA request - Country:', country, 'State:', state);
      
      // For now, only Nigeria has LGA data
      // Other countries will return empty array
      if (country && country.toLowerCase() !== 'nigeria') {
        console.log('⚠️ Non-Nigerian country, returning empty array');
        return res.json({ success: true, data: [] });
      }
      
      console.log('🔍 Fetching Nigerian LGAs for state:', state);
      const lgas = await locationService.getNigerianLGAs(state);
      console.log('✅ Found', lgas.length, 'LGAs');
      res.json({ success: true, data: lgas });
    } catch (error) {
      console.error('❌ Get LGAs error:', error);
      res.status(500).json({ error: 'Failed to fetch LGAs' });
    }
  }

  static async getAllNigerianStatesWithLGAs(req, res) {
    try {
      const data = await locationService.getAllNigerianStatesWithLGAs();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Get Nigerian states with LGAs error:', error);
      res.status(500).json({ error: 'Failed to fetch Nigerian states with LGAs' });
    }
  }
}

module.exports = LookupController;
