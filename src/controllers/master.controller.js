const masterService = require('../services/master.service');

class MasterController {
    async getMasterData(req, res) {
        try {
            const { masterType } = req.params;
            const data = await masterService.getMasterData(masterType);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createMasterRecord(req, res) {
        try {
            const { masterType } = req.params;
            const data = req.body;

            // Handle reset action
            if (data.__action === 'reset') {
                const result = await masterService.resetMasterData(masterType);
                return res.json(result);
            }

            const result = await masterService.createMasterRecord(masterType, data);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateMasterRecord(req, res) {
        try {
            const { masterType } = req.params;
            const data = req.body;
            const result = await masterService.updateMasterRecord(masterType, data);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteMasterRecord(req, res) {
        try {
            const { masterType } = req.params;
            const { code } = req.query;
            const result = await masterService.deleteMasterRecord(masterType, code);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MasterController();
