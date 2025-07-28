import fetch from 'node-fetch';
import EcfrDAO from '../../DAO/EcfrDAO.js';

export default class EcfrControllers {
    // Download and store eCFR agencies data
    static async apiDownloadAndStoreAgencies(req, res, next) {
        try {
            console.log('Downloading agencies data from eCFR API...');
            const response = await fetch("https://www.ecfr.gov/api/admin/v1/agencies.json");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const agencies = await response.json();

            // Store in database
            console.log('Storing agencies data in database...');
            const storeResult = await EcfrDAO.storeAgencies(agencies);

            const responseData = {
                message: 'eCFR agencies data downloaded and stored successfully',
                stored: storeResult.success,
                total_agencies: agencies.agencies ? agencies.agencies.length : 0
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error downloading and storing agencies:", error);
            res.status(500).json({ error: 'Failed to download and store agencies', message: error.message });
        }
    }

    // Get stored agencies data (for backward compatibility)
    static async apiGetAgencies(req, res, next) {
        try {
            const agencies = await EcfrDAO.getAgenciesAnalysis();

            const responseData = {
                agencies: agencies,
                message: 'Returned stored agencies successfully'
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error fetching stored agencies:", error);
            res.status(500).json({ error: 'Failed to fetch stored agencies', message: error.message });
        }
    }

    // Get word count analysis per agency
    static async apiGetWordCountAnalysis(req, res, next) {
        try {
            const agencies = await EcfrDAO.getAgenciesAnalysis();
            const stats = await EcfrDAO.getWordCountStats();

            const responseData = {
                summary: stats,
                agencies: agencies.map(agency => ({
                    name: agency.name,
                    short_name: agency.short_name,
                    word_count: agency.word_count,
                    cfr_reference_count: agency.cfr_reference_count,
                    checksum: agency.checksum
                })),
                message: 'Word count analysis completed successfully'
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error generating word count analysis:", error);
            res.status(500).json({ error: 'Failed to generate word count analysis', message: error.message });
        }
    }

    // Get historical changes
    static async apiGetHistoricalChanges(req, res, next) {
        try {
            const changes = await EcfrDAO.getHistoricalChanges();

            const responseData = {
                changes: changes,
                total_changes: changes.length,
                message: 'Historical changes retrieved successfully'
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error fetching historical changes:", error);
            res.status(500).json({ error: 'Failed to fetch historical changes', message: error.message });
        }
    }

    // Get checksums for each agency
    static async apiGetAgencyChecksums(req, res, next) {
        try {
            const agencies = await EcfrDAO.getAgenciesAnalysis();

            const responseData = {
                checksums: agencies.map(agency => ({
                    name: agency.name,
                    short_name: agency.short_name,
                    checksum: agency.checksum,
                    last_updated: agency.updated_at
                })),
                message: 'Agency checksums retrieved successfully'
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error fetching agency checksums:", error);
            res.status(500).json({ error: 'Failed to fetch agency checksums', message: error.message });
        }
    }

    // Custom metric: Regulatory Complexity Score
    static async apiGetComplexityScore(req, res, next) {
        try {
            const complexity = await EcfrDAO.getComplexityScore();

            const responseData = {
                complexity_analysis: complexity,
                description: 'Regulatory Complexity Score combines word count (70%) and CFR reference count (30%) to measure agency regulatory burden',
                message: 'Complexity analysis completed successfully'
            };
            res.json(responseData);
        } catch (error) {
            console.error("Error calculating complexity score:", error);
            res.status(500).json({ error: 'Failed to calculate complexity score', message: error.message });
        }
    }
}
