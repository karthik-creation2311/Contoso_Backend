const masterRepo = require('../repositories/master.repo');

class MasterService {
    async getMasterData(masterType) {
        const masterConfig = this.getMasterConfig(masterType);
        const rows = await masterRepo.getAllRecords(masterType);
        return {
            label: masterConfig.label,
            desc: masterConfig.desc,
            key: masterConfig.key || 'code',
            columns: masterConfig.columns,
            rows
        };
    }

    async createMasterRecord(masterType, data) {
        return await masterRepo.createRecord(masterType, data);
    }

    async updateMasterRecord(masterType, data) {
        return await masterRepo.updateRecord(masterType, data);
    }

    async deleteMasterRecord(masterType, code) {
        return await masterRepo.deleteRecord(masterType, code);
    }

    async resetMasterData(masterType) {
        // Implement reset logic based on masterType
        const sampleData = this.getSampleData(masterType);
        await masterRepo.deleteAllRecords(masterType);
        for (const record of sampleData) {
            await masterRepo.createRecord(masterType, record);
        }
        return { success: true };
    }

    getMasterConfig(masterType) {
        const configs = {
            departments: {
                label: 'Departments',
                desc: 'Organizational departments and their translations',
                key: 'code',
                columns: [
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Name' },
                    { key: 'description', label: 'Description' }
                ],
                table: 'departments',
                i18nTable: 'departments_i18n'
            },
            properties: {
                label: 'Properties',
                desc: 'Hotel properties and outlets',
                key: 'code',
                columns: [
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Name' },
                    { key: 'city', label: 'City' },
                    { key: 'state', label: 'State' },
                    { key: 'country', label: 'Country' }
                ],
                table: 'properties',
                i18nTable: 'properties_i18n'
            }
            // Add more master configurations as needed
        };
        return configs[masterType] || { label: masterType, columns: [] };
    }

    getSampleData(masterType) {
        const samples = {
            departments: [
                { code: 'FO', name: 'Front Office', description: 'Front Office Operations', active: true },
                { code: 'HK', name: 'Housekeeping', description: 'Housekeeping Operations', active: true },
                { code: 'FB', name: 'F&B', description: 'Food & Beverage', active: true }
            ],
            properties: [
                { code: 'HQ', name: 'Headquarters', city: 'Mumbai', state: 'Maharashtra', country: 'India', active: true },
                { code: 'BLR1', name: 'Bengaluru Central', city: 'Bengaluru', state: 'Karnataka', country: 'India', active: true }
            ]
            // Add more sample data as needed
        };
        return samples[masterType] || [];
    }
}

module.exports = new MasterService();
