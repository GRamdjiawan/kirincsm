-- Full SQL schema including new domains logic

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `nebula-cms`;
USE `nebula-cms`;

-- ------------------------------
-- Table: users
-- ------------------------------
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` TEXT DEFAULT NULL,
  `email` TEXT NOT NULL,
  `password` TEXT NOT NULL,
  `role` TEXT DEFAULT NULL CHECK (`role` IN ('admin','editor','client')),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Alice Admin', 'alice@example.com', 'hashed_password_1', 'admin'),
(2, 'Eddie Editor', 'eddie@example.com', 'hashed_password_2', 'editor'),
(3, 'Clara Client', 'clara@example.com', 'hashed_password_3', 'client');

-- ------------------------------
-- Table: domains
-- ------------------------------
CREATE TABLE `domains` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_domains_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Optional example domains
INSERT INTO `domains` (`id`, `name`, `user_id`) VALUES
(1, 'example.com', 1),
(2, 'projecthub.io', 2);

-- ------------------------------
-- Table: pages
-- ------------------------------
CREATE TABLE `pages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` TEXT DEFAULT NULL,
  `slug` TEXT DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `cover_image_url` TEXT DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `domain_id` INT(11) DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`) USING HASH,
  KEY `user_id` (`user_id`),
  KEY `domain_id` (`domain_id`),
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_pages_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `cover_image_url`, `user_id`, `domain_id`, `updated_at`) VALUES
(1, 'Home', 'home', 'Welcome to our homepage!', 'https://example.com/images/home.jpg', 2, 1, '2025-05-12 18:09:53'),
(2, 'About Us', 'about-us', 'We are a creative digital agency.', 'https://example.com/images/about.jpg', 2, 1, '2025-05-12 18:09:53'),
(3, 'Contact', 'contact', 'Reach out to us via this page.', 'https://example.com/images/contact.jpg', 1, 1, '2025-05-12 18:09:53');

-- ------------------------------
-- Table: seo
-- ------------------------------
CREATE TABLE `seo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `domain_id` INT(11) DEFAULT NULL,
  `meta_title` TEXT DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `keywords` TEXT DEFAULT NULL,
  `og_image_url` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain_id` (`domain_id`),
  CONSTRAINT `fk_seo_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `seo` (`id`, `domain_id`, `meta_title`, `meta_description`, `keywords`, `og_image_url`) VALUES
(1, 1, 'Home - MySite', 'This is the homepage of MySite.', 'home, welcome, mysite', 'https://example.com/images/og_home.jpg'),
(2, 2, 'About Us - ProjectHub', 'Learn more about ProjectHub.', 'about, team, company', 'https://example.com/images/og_about.jpg');

-- ------------------------------
-- Table: media
-- ------------------------------
CREATE TABLE `media` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `file_url` TEXT DEFAULT NULL,
  `alt_text` TEXT DEFAULT NULL,
  `uploaded_by` INT(11) DEFAULT NULL,
  `page_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `page_id` (`page_id`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_media_page_id` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `media` (`id`, `file_url`, `alt_text`, `uploaded_by`, `page_id`) VALUES
(1, 'https://example.com/uploads/logo.png', 'Company Logo', 1, 1),
(2, 'https://example.com/uploads/team.jpg', 'Our Team', 2, 2),
(3, 'https://example.com/uploads/contact-map.png', 'Map Location', 1, 3);

COMMIT;
