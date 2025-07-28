use ecfrdb;

-- eCFR Assessment Database Schema
-- Main agencies table (handles both parent agencies and sub-agencies)
CREATE TABLE agencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NULL,
    display_name VARCHAR(255) NOT NULL,
    sortable_name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    parent_id INT NULL,
    checksum VARCHAR(64) NULL,
    word_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES agencies(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_short_name (short_name)
);

-- CFR references for each agency
CREATE TABLE cfr_references (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agency_id INT NOT NULL,
    title INT NOT NULL,
    chapter VARCHAR(20) NULL,
    subtitle VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    INDEX idx_agency_id (agency_id),
    INDEX idx_title_chapter (title, chapter)
);

-- Historical changes tracking
CREATE TABLE data_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('agency', 'title', 'part') NOT NULL,
    entity_id INT NOT NULL,
    change_type ENUM('created', 'updated', 'deleted') NOT NULL,
    old_checksum VARCHAR(64) NULL,
    new_checksum VARCHAR(64) NULL,
    old_word_count INT NULL,
    new_word_count INT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_changed_at (changed_at)
);
