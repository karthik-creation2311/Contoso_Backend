const { prisma } = require('../integrations/prisma');

class MasterRepository {
    async getAllRecords(masterType) {
        const config = this.getMasterConfig(masterType);
        if (!config.table) {
            throw new Error(`Invalid master type: ${masterType}`);
        }

        try {
            const records = await prisma[config.table].findMany({
                include: {
                    ...(config.i18nTable ? {
                        [`${config.table}_i18n`]: true
                    } : {}),
                    ...(config.relations || {})
                }
            });

            // Transform records to match frontend requirements
            return records.map(record => this.transformRecord(record, config));
        } catch (error) {
            console.error(`Error fetching ${masterType}:`, error);
            throw error;
        }
    }

    async createRecord(masterType, data) {
        const config = this.getMasterConfig(masterType);
        if (!config.table) {
            throw new Error(`Invalid master type: ${masterType}`);
        }

        try {
            const { i18n, ...mainData } = this.prepareData(data, config);
            
            // Create main record
            const record = await prisma[config.table].create({
                data: {
                    ...mainData,
                    // Handle i18n data if available
                    ...(config.i18nTable && i18n ? {
                        [`${config.table}_i18n`]: {
                            create: i18n
                        }
                    } : {})
                },
                include: config.i18nTable ? {
                    [`${config.table}_i18n`]: true
                } : undefined
            });

            return this.transformRecord(record, config);
        } catch (error) {
            console.error(`Error creating ${masterType}:`, error);
            throw error;
        }
    }

    async updateRecord(masterType, data) {
        const config = this.getMasterConfig(masterType);
        if (!config.table) {
            throw new Error(`Invalid master type: ${masterType}`);
        }

        try {
            const { i18n, ...mainData } = this.prepareData(data, config);
            const keyField = config.key || 'code';
            
            // Update main record
            const record = await prisma[config.table].update({
                where: { [keyField]: data[keyField] },
                data: {
                    ...mainData,
                    // Handle i18n data if available
                    ...(config.i18nTable && i18n ? {
                        [`${config.table}_i18n`]: {
                            upsert: i18n.map(translation => ({
                                where: {
                                    [`${config.table}_id_locale`]: {
                                        [`${config.table}_id`]: data[keyField],
                                        locale: translation.locale
                                    }
                                },
                                create: translation,
                                update: translation
                            }))
                        }
                    } : {})
                },
                include: config.i18nTable ? {
                    [`${config.table}_i18n`]: true
                } : undefined
            });

            return this.transformRecord(record, config);
        } catch (error) {
            console.error(`Error updating ${masterType}:`, error);
            throw error;
        }
    }

    async deleteRecord(masterType, code) {
        const config = this.getMasterConfig(masterType);
        if (!config.table) {
            throw new Error(`Invalid master type: ${masterType}`);
        }

        try {
            const keyField = config.key || 'code';
            await prisma[config.table].delete({
                where: { [keyField]: code }
            });
            return { success: true };
        } catch (error) {
            console.error(`Error deleting ${masterType}:`, error);
            throw error;
        }
    }

    async deleteAllRecords(masterType) {
        const config = this.getMasterConfig(masterType);
        if (!config.table) {
            throw new Error(`Invalid master type: ${masterType}`);
        }

        try {
            await prisma[config.table].deleteMany({});
            return { success: true };
        } catch (error) {
            console.error(`Error deleting all ${masterType}:`, error);
            throw error;
        }
    }

    getMasterConfig(masterType) {
        const configs = {
            departments: {
                table: 'departments',
                i18nTable: 'departments_i18n',
                key: 'dept_id',
                schema: 'mst',
                relations: {
                    organizations: true
                }
            },
            properties: {
                table: 'properties',
                i18nTable: 'properties_i18n',
                key: 'property_id',
                schema: 'mst',
                relations: {
                    organizations: true
                }
            },
            roles: {
                table: 'roles',
                i18nTable: 'roles_i18n',
                key: 'role_id',
                schema: 'ums',
                relations: {
                    organizations: true
                }
            }
            // Add more configurations based on your schema
        };
        return configs[masterType] || {};
    }

    transformRecord(record, config) {
        if (!record) return null;

        // Handle i18n data
        if (config.i18nTable && record[`${config.table}_i18n`]) {
            const defaultTranslation = record[`${config.table}_i18n`][0];
            if (defaultTranslation) {
                record.name = defaultTranslation.name;
                record.description = defaultTranslation.description;
            }
        }

        // Remove complex nested objects
        const { [`${config.table}_i18n`]: _, ...cleanRecord } = record;
        
        return {
            ...cleanRecord,
            active: record.is_active
        };
    }

    prepareData(data, config) {
        const { name, description, locale = 'en', ...mainData } = data;

        // Prepare i18n data if the table supports it
        const i18n = config.i18nTable && name ? [{
            locale,
            name,
            description
        }] : undefined;

        return {
            ...mainData,
            is_active: data.active,
            i18n
        };
    }
}

module.exports = new MasterRepository();
