-- Database: eco_drive
CREATE DATABASE eco_drive;
USE eco_drive;

-- user Table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    travel_mode VARCHAR(50),
    profile_image VARCHAR(255),
    points INT DEFAULT 0,
    invitedEmails VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communities Table
CREATE TABLE communities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES user(id)
);

-- Community Members Table
CREATE TABLE community_members (
    community_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (community_id, user_id),
    FOREIGN KEY (community_id) REFERENCES communities(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Commutes Table
CREATE TABLE commutes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    travel_mode VARCHAR(50) NOT NULL,
    distance FLOAT NOT NULL,
    duration INT NOT NULL,
    carbon_footprint FLOAT NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_manual BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Achievements Table
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points INT DEFAULT 0,
    icon VARCHAR(255)
);

-- User Achievements Table
CREATE TABLE user_achievements (
    user_id INT,
    achievement_id INT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

-- Challenges Table
CREATE TABLE challenges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    points INT DEFAULT 0
);

-- User Challenges Table
CREATE TABLE user_challenges (
    user_id INT,
    challenge_id INT,
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- User Settings Table
CREATE TABLE user_settings (
    user_id INT PRIMARY KEY,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    share_stats BOOLEAN DEFAULT TRUE,
    show_in_leaderboard BOOLEAN DEFAULT TRUE,
    auto_detect_activity BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);