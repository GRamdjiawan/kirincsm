-- phpMyAdmin SQL Dump
-- versie 5.2.2-1.fc42
-- Host: localhost
-- Database: `nebula-cms`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
 /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
 /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 /*!40101 SET NAMES utf8mb4 */;

-- ------------------------------
-- Tabel: users
-- ------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` text DEFAULT NULL CHECK (`role` in ('admin','editor','client'))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Gianni Ramdjiawan', 'gianni.ramdjiawan@gmail.com', 'qwerty123', 'admin'),
(2, 'Eddie Editor', 'eddie@example.com', 'hashed_password_2', 'editor'),
(3, 'Clara Client', 'clara@example.com', 'hashed_password_3', 'client');

-- ------------------------------
-- Tabel: domains
-- ------------------------------
CREATE TABLE `domains` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `domains` (`id`, `name`, `user_id`) VALUES
(1, 'gianni-ramdjiawan.com', 1),
(2, 'projecthub.io', 2);

-- ------------------------------
-- Tabel: pages
-- ------------------------------
CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` text DEFAULT NULL,
  `slug` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `cover_image_url` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `cover_image_url`, `user_id`, `domain_id`, `updated_at`) VALUES
(1, 'Home', 'home', 'Welcome to our homepage!', 'https://example.com/images/home.jpg', 2, 1, '2025-05-12 18:09:53'),
(2, 'About Us', 'about-us', 'We are a creative digital agency.', 'https://example.com/images/about.jpg', 2, 1, '2025-05-12 18:09:53'),
(3, 'Contact', 'contact', 'Reach out to us via this page.', 'https://example.com/images/contact.jpg', 1, 1, '2025-05-12 18:09:53');

-- ------------------------------
-- Tabel: sections (nieuw!)
-- ------------------------------
CREATE TABLE `sections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `page_id` INT(11) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `position` INT(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `page_id` (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `sections` (`id`, `page_id`, `title`, `content`, `position`) VALUES
(1, 1, 'Intro Section', 'This is the intro of the homepage.', 1),
(2, 1, 'Features Section', 'Our features explained.', 2),
(3, 2, 'Team Section', 'Meet the team.', 1);

-- ------------------------------
-- Tabel: media (aangepast!)
-- ------------------------------
CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `file_url` text DEFAULT NULL,
  `alt_text` text DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `type` ENUM('image', 'text') DEFAULT 'image'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `media` (`id`, `file_url`, `alt_text`, `uploaded_by`, `section_id`, `type`) VALUES
(1, 'https://example.com/uploads/logo.png', 'Company Logo', 1, 1, 'image'),
(2, 'https://example.com/uploads/team.jpg', 'Our Team', 2, 3, 'image'),
(3, 'https://example.com/uploads/contact-map.png', 'Map Location', 1, 1, 'image'),
(4, 'Welcome to our site!', 'Intro text', 1, 1, 'text');

-- ------------------------------
-- Tabel: seo
-- ------------------------------
CREATE TABLE `seo` (
  `id` int(11) NOT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `og_image_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `seo` (`id`, `domain_id`, `meta_title`, `meta_description`, `keywords`, `og_image_url`) VALUES
(1, 1, 'Home - MySite', 'This is the homepage of MySite.', 'home, welcome, mysite', 'https://example.com/images/og_home.jpg'),
(2, 2, 'About Us - ProjectHub', 'Learn more about ProjectHub.', 'about, team, company', 'https://example.com/images/og_about.jpg');

-- ------------------------------
-- Primary keys en constraints
-- ------------------------------
ALTER TABLE `domains`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `section_id` (`section_id`);

ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`) USING HASH,
  ADD KEY `user_id` (`user_id`),
  ADD KEY `domain_id` (`domain_id`);

ALTER TABLE `seo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_id` (`domain_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`) USING HASH;

ALTER TABLE `sections`
  ADD CONSTRAINT `fk_sections_page_id` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE;

ALTER TABLE `domains`
  ADD CONSTRAINT `fk_domains_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_section_id` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

ALTER TABLE `pages`
  ADD CONSTRAINT `fk_pages_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `seo`
  ADD CONSTRAINT `fk_seo_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;

-- ------------------------------
-- Auto-increment waarden
-- ------------------------------
ALTER TABLE `domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `seo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
 /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
 /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
