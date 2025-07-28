import { pool } from '../index.js';
import crypto from 'crypto';

export default class EcfrDAO {
    static connection = null;

    static async injectDB(conn) {
        if (EcfrDAO.connection) {
            return;
        }

        try {
            EcfrDAO.connection = conn;
            console.log("eCFR DAO successfully connected to database");
        } catch (e) {
            console.error(`Unable to establish a collection handle in EcfrDAO: ${e}`);
        }
    }

    // Helper function to calculate word count
    static countWords(text) {
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Helper function to calculate checksum
    static calculateChecksum(data) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(data));
        return hash.digest('hex');
    }

    // Helper method to track changes
    static async trackChange(connection, entityType, entityId, changeType, oldData = null, newData = null) {
        try {
            const oldChecksum = oldData ? this.calculateChecksum(oldData) : null;
            const newChecksum = newData ? this.calculateChecksum(newData) : null;
            const oldWordCount = oldData ? (oldData.word_count || 0) : null;
            const newWordCount = newData ? (newData.word_count || 0) : null;

            await connection.execute(`
                INSERT INTO data_history (entity_type, entity_id, change_type, old_checksum, new_checksum, old_word_count, new_word_count)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [entityType, entityId, changeType, oldChecksum, newChecksum, oldWordCount, newWordCount]);
        } catch (error) {
            console.error('Error tracking change:', error);
            // Don't throw - we don't want change tracking to break the main operation
        }
    }

    // Store agencies data
    static async storeAgencies(agenciesData) {
        try {
            const connection = await pool.getConnection();
            
            // Process agencies with parent-child relationships
            const agencyMap = new Map();
            const agencies = agenciesData.agencies || agenciesData;
            
            // First pass: Create all agencies without parent relationships
            for (const agency of agencies) {
                const checksum = this.calculateChecksum(agency);
                const wordCount = this.countWords(`${agency.name} ${agency.display_name}`);
                
                // Check if agency already exists
                const [existing] = await connection.execute(`
                    SELECT id, checksum, word_count FROM agencies WHERE slug = ?
                `, [agency.slug]);
                
                const [result] = await connection.execute(`
                    INSERT INTO agencies (name, short_name, display_name, sortable_name, slug, checksum, word_count)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    short_name = VALUES(short_name),
                    display_name = VALUES(display_name),
                    sortable_name = VALUES(sortable_name),
                    checksum = VALUES(checksum),
                    word_count = VALUES(word_count),
                    updated_at = CURRENT_TIMESTAMP
                `, [
                    agency.name,
                    agency.short_name || null,
                    agency.display_name,
                    agency.sortable_name,
                    agency.slug,
                    checksum,
                    wordCount
                ]);
                
                const agencyId = result.insertId || existing[0]?.id;
                agencyMap.set(agency.slug, agencyId);
                
                // Track changes
                if (existing.length === 0) {
                    // New agency
                    await this.trackChange(connection, 'agency', agencyId, 'created', null, {
                        checksum: checksum,
                        word_count: wordCount
                    });
                } else if (existing[0].checksum !== checksum) {
                    // Updated agency
                    await this.trackChange(connection, 'agency', agencyId, 'updated', {
                        checksum: existing[0].checksum,
                        word_count: existing[0].word_count
                    }, {
                        checksum: checksum,
                        word_count: wordCount
                    });
                }
                
                // Store CFR references
                if (agency.cfr_references && agency.cfr_references.length > 0) {
                    for (const ref of agency.cfr_references) {
                        await connection.execute(`
                            INSERT INTO cfr_references (agency_id, title, chapter, subtitle)
                            VALUES (?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            chapter = VALUES(chapter),
                            subtitle = VALUES(subtitle)
                        `, [
                            agencyId,
                            ref.title,
                            ref.chapter || null,
                            ref.subtitle || null
                        ]);
                    }
                }
            }
            
            // Second pass: Handle child agencies (if any)
            for (const agency of agencies) {
                if (agency.children && agency.children.length > 0) {
                    const parentId = agencyMap.get(agency.slug);
                    
                    for (const child of agency.children) {
                        const checksum = this.calculateChecksum(child);
                        const wordCount = this.countWords(`${child.name} ${child.display_name}`);
                        
                        // Check if child agency already exists
                        const [existingChild] = await connection.execute(`
                            SELECT id, checksum, word_count FROM agencies WHERE slug = ?
                        `, [child.slug]);
                        
                        const [childResult] = await connection.execute(`
                            INSERT INTO agencies (name, short_name, display_name, sortable_name, slug, parent_id, checksum, word_count)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            name = VALUES(name),
                            short_name = VALUES(short_name),
                            display_name = VALUES(display_name),
                            sortable_name = VALUES(sortable_name),
                            parent_id = VALUES(parent_id),
                            checksum = VALUES(checksum),
                            word_count = VALUES(word_count),
                            updated_at = CURRENT_TIMESTAMP
                        `, [
                            child.name,
                            child.short_name || null,
                            child.display_name,
                            child.sortable_name,
                            child.slug,
                            parentId,
                            checksum,
                            wordCount
                        ]);
                        
                        const childId = childResult.insertId || existingChild[0]?.id;
                        
                        // Track changes for child agencies
                        if (existingChild.length === 0) {
                            // New child agency
                            await this.trackChange(connection, 'agency', childId, 'created', null, {
                                checksum: checksum,
                                word_count: wordCount
                            });
                        } else if (existingChild[0].checksum !== checksum) {
                            // Updated child agency
                            await this.trackChange(connection, 'agency', childId, 'updated', {
                                checksum: existingChild[0].checksum,
                                word_count: existingChild[0].word_count
                            }, {
                                checksum: checksum,
                                word_count: wordCount
                            });
                        }
                    }
                }
            }
            
            connection.release();
            return { success: true, message: 'Agencies stored successfully' };
            
        } catch (error) {
            console.error('Error storing agencies:', error);
            throw error;
        }
    }

    // Get all agencies with analysis data
    static async getAgenciesAnalysis() {
        try {
            const connection = await pool.getConnection();
            
            const [agencies] = await connection.execute(`
                SELECT 
                    a.id,
                    a.name,
                    a.short_name,
                    a.display_name,
                    a.slug,
                    a.checksum,
                    a.word_count,
                    a.created_at,
                    a.updated_at,
                    COUNT(c.id) as cfr_reference_count,
                    GROUP_CONCAT(DISTINCT c.title ORDER BY c.title) as cfr_titles
                FROM agencies a
                LEFT JOIN cfr_references c ON a.id = c.agency_id
                WHERE a.parent_id IS NULL
                GROUP BY a.id
                ORDER BY a.word_count DESC
            `);
            
            connection.release();
            return agencies;
            
        } catch (error) {
            console.error('Error getting agencies analysis:', error);
            throw error;
        }
    }

    // Get word count statistics
    static async getWordCountStats() {
        try {
            const connection = await pool.getConnection();
            
            const [stats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_agencies,
                    SUM(word_count) as total_words,
                    AVG(word_count) as avg_words_per_agency,
                    MAX(word_count) as max_words,
                    MIN(word_count) as min_words
                FROM agencies
                WHERE parent_id IS NULL
            `);
            
            connection.release();
            return stats[0];
            
        } catch (error) {
            console.error('Error getting word count stats:', error);
            throw error;
        }
    }

    // Get historical changes
    static async getHistoricalChanges() {
        try {
            const connection = await pool.getConnection();
            
            const [changes] = await connection.execute(`
                SELECT 
                    h.*,
                    CASE 
                        WHEN h.entity_type = 'agency' THEN a.name
                        ELSE CONCAT('Entity ID: ', h.entity_id)
                    END as entity_name
                FROM data_history h
                LEFT JOIN agencies a ON h.entity_type = 'agency' AND h.entity_id = a.id
                ORDER BY h.changed_at DESC
                LIMIT 100
            `);
            
            connection.release();
            return changes;
            
        } catch (error) {
            console.error('Error getting historical changes:', error);
            throw error;
        }
    }

    // Custom metric: Calculate regulatory complexity score
    static async getComplexityScore() {
        try {
            const connection = await pool.getConnection();
            
            const [complexity] = await connection.execute(`
                SELECT 
                    a.name,
                    a.short_name,
                    a.word_count,
                    COUNT(c.id) as cfr_reference_count,
                    -- Complexity score based on word count and CFR references
                    ROUND(
                        (a.word_count * 0.7) + 
                        (COUNT(c.id) * 1000 * 0.3)
                    ) as complexity_score
                FROM agencies a
                LEFT JOIN cfr_references c ON a.id = c.agency_id
                WHERE a.parent_id IS NULL
                GROUP BY a.id
                ORDER BY complexity_score DESC
            `);
            
            connection.release();
            return complexity;
            
        } catch (error) {
            console.error('Error calculating complexity score:', error);
            throw error;
        }
    }

    // Helper method to create sample history data (for testing purposes)
    static async createSampleHistoryData() {
        try {
            const connection = await pool.getConnection();
            
            // Get a few agencies to create sample history for
            const [agencies] = await connection.execute(`
                SELECT id, name FROM agencies WHERE parent_id IS NULL LIMIT 3
            `);
            
            if (agencies.length > 0) {
                // Create some sample historical entries
                for (let i = 0; i < agencies.length; i++) {
                    const agency = agencies[i];
                    
                    // Create a 'created' entry from a few days ago
                    await connection.execute(`
                        INSERT INTO data_history (entity_type, entity_id, change_type, old_checksum, new_checksum, old_word_count, new_word_count, changed_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))
                    `, ['agency', agency.id, 'created', null, 'sample_checksum_' + i, null, 1000 + (i * 500), 3 - i]);
                    
                    // Create an 'updated' entry from yesterday
                    await connection.execute(`
                        INSERT INTO data_history (entity_type, entity_id, change_type, old_checksum, new_checksum, old_word_count, new_word_count, changed_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 1 DAY))
                    `, ['agency', agency.id, 'updated', 'sample_checksum_' + i, 'updated_checksum_' + i, 1000 + (i * 500), 1200 + (i * 500)]);
                }
            }
            
            connection.release();
            return { success: true, message: 'Sample history data created' };
            
        } catch (error) {
            console.error('Error creating sample history data:', error);
            throw error;
        }
    }
}
