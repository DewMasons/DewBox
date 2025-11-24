-- ============================================
-- Contribution System Setup
-- ============================================
-- This script sets up the ICA and Piggy contribution system
-- Run this script to add necessary columns and tables

-- Add contribution tracking columns to subscribers table
ALTER TABLE subscribers 
ADD COLUMN contribution_mode ENUM('auto', 'all_ica') DEFAULT 'auto' COMMENT 'auto = date-based, all_ica = always ICA';

ALTER TABLE subscribers 
ADD COLUMN ica_balance DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Total ICA contributions (yearly, with interest)';

ALTER TABLE subscribers 
ADD COLUMN piggy_balance DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Total Piggy savings (monthly, no interest)';

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    type ENUM('ICA', 'PIGGY') NOT NULL COMMENT 'ICA = Investment Cooperative Account, PIGGY = Piggy Savings',
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    contribution_date DATE NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    interest_earned DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Interest earned on ICA contributions',
    description TEXT,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user_type (userId, type),
    INDEX idx_date (contribution_date),
    INDEX idx_year_month (year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Update transaction table to support ICA and PIGGY types
ALTER TABLE transaction 
MODIFY COLUMN type ENUM('contribution','withdrawal','ica','piggy','ICA','PIGGY') NOT NULL;

-- Update existing subscribers to have default values
UPDATE subscribers 
SET contribution_mode = 'auto', 
    ica_balance = 0.00, 
    piggy_balance = 0.00 
WHERE contribution_mode IS NULL;

-- Show results
SELECT 'Contribution system setup completed!' AS status;
SELECT COUNT(*) AS total_subscribers FROM subscribers;
SELECT COUNT(*) AS total_contributions FROM contributions;
