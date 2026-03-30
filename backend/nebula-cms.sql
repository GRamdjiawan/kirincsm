-- phpMyAdmin SQL Dump
-- version 5.2.3-1.fc42
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 30, 2026 at 09:27 PM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nebula-cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int(11) NOT NULL,
  `domain_id` int(11) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `record` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`record`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

CREATE TABLE `domains` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domains`
--

INSERT INTO `domains` (`id`, `name`, `user_id`) VALUES
(1, 'gianni-ramdjiawan.com', 6),
(2, 'projecthub.io', 2),
(3, 'gkr-production.com', 6);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `file_url` text DEFAULT NULL,
  `text` text DEFAULT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `type` enum('image','text') DEFAULT 'image',
  `title` varchar(255) NOT NULL,
  `aspect_ratio` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `file_url`, `text`, `domain_id`, `uploaded_by`, `section_id`, `project_id`, `type`, `title`, `aspect_ratio`) VALUES
(5, NULL, 'GR', 1, 6, 4, NULL, 'text', 'initials', NULL),
(6, NULL, 'Gianni Ramdjiawan', 1, 6, 4, NULL, 'text', 'title', NULL),
(26, '/uploads/test.jpg', '', 1, 6, NULL, 5, 'image', 'test.jpg', NULL),
(27, '/uploads/6gianni-ramdjiawan.com/Luffy.jpg', '', 1, 6, NULL, 5, 'image', 'Luffy.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `hierarchy` int(9) NOT NULL,
  `domain_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `hierarchy`, `domain_id`) VALUES
(1, 'Home', 1, 1),
(2, 'Gallery', 2, 1),
(5, 'Home page', 1, 2),
(6, 'About page', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `domain_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `domain_id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(5, 1, 'Project Nike', 'Test project', '2026-03-30 22:19:48', '2026-03-30 22:19:48'),
(6, 1, 'Smiles for serve', 'Padel and networking event', '2026-03-30 22:49:50', '2026-03-30 22:49:50');

-- --------------------------------------------------------

--
-- Table structure for table `project_fields`
--

CREATE TABLE `project_fields` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `field_definition_id` int(11) DEFAULT NULL,
  `field_key` varchar(255) NOT NULL,
  `field_value` text DEFAULT NULL,
  `field_type` varchar(50) DEFAULT 'text',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `project_fields`
--

INSERT INTO `project_fields` (`id`, `project_id`, `field_definition_id`, `field_key`, `field_value`, `field_type`, `created_at`, `updated_at`) VALUES
(4, 5, NULL, 'client_name', 'Nike', 'text', '2026-03-30 22:19:48', '2026-03-30 22:19:48'),
(5, 5, NULL, 'location', 'Rotterdam', 'text', '2026-03-30 22:19:48', '2026-03-30 22:19:48'),
(6, 5, NULL, 'size', '120m2', 'text', '2026-03-30 22:19:48', '2026-03-30 22:19:48'),
(7, 6, 2, 'location', 'Rotterdam', 'text', '2026-03-30 22:49:50', '2026-03-30 22:49:50'),
(8, 6, 4, 'date', 'June 2026', 'text', '2026-03-30 22:49:50', '2026-03-30 22:49:50');

-- --------------------------------------------------------

--
-- Table structure for table `project_field_definitions`
--

CREATE TABLE `project_field_definitions` (
  `id` int(11) NOT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `key_name` varchar(255) NOT NULL,
  `field_type` varchar(50) DEFAULT 'text',
  `is_required` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `project_field_definitions`
--

INSERT INTO `project_field_definitions` (`id`, `domain_id`, `name`, `key_name`, `field_type`, `is_required`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Client Name', 'client_name', 'text', 0, '2026-03-30 22:16:33', '2026-03-30 22:16:33'),
(2, NULL, 'Location', 'location', 'text', 0, '2026-03-30 22:16:33', '2026-03-30 22:16:33'),
(3, NULL, 'Project Size', 'size', 'text', 0, '2026-03-30 22:16:33', '2026-03-30 22:16:33'),
(4, NULL, 'Date', 'date', 'text', 0, '2026-03-30 22:16:33', '2026-03-30 22:29:29');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `position` int(11) DEFAULT 0,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `page_id`, `title`, `position`, `type`) VALUES
(4, 1, 'Hero Section', 1, 'HERO'),
(5, 1, 'Skills Section', 2, 'TEXT'),
(6, 1, 'Projects Section', 3, 'CARD'),
(7, 1, 'Timeline Section', 4, 'CARD'),
(8, 1, 'Photography & Videography Section', 5, 'GALLERY'),
(9, 2, 'Photography Gallery', 1, 'GALLERY'),
(10, 2, 'Videography Gallery', 2, 'GALLERY'),
(11, 1, 'is', 0, ''),
(12, 2, 'is', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `seo`
--

CREATE TABLE `seo` (
  `id` int(11) NOT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `icon` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo`
--

INSERT INTO `seo` (`id`, `domain_id`, `meta_title`, `meta_description`, `keywords`, `icon`) VALUES
(1, 1, 'Home - MySite', 'This is the homepage of MySite.', 'home, welcome, mysite', 'https://example.com/images/og_home.jpg'),
(2, 2, 'About Us - ProjectHub', 'Learn more about ProjectHub.', 'about, team, company', 'https://example.com/images/og_about.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` enum('admin','editor','client') DEFAULT 'client'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Gianni Ramdjiawan', 'gianni.ramdjiawan@gmail.com', '$2b$12$sxISKL7CnyhaC2/sKnfBKuYWZCHwq1ZFUkt7Qj0h3R80wpmdixhVe', 'admin'),
(2, 'Eddie Editor', 'eddie@example.com', 'hashed_password_2', 'editor'),
(3, 'Clara Client', 'clara@example.com', 'hashed_password_3', 'client'),
(6, 'Gianni test', 'test@gmail.com', '$2b$12$yAl5Gh2RJKEJP62XznBiFeVZYISmZJVNk9gHpSPYf1g2EQVByXR72', 'client'),
(7, 'Test Test', 'test1@email.com', '$2b$12$S6Ay5bKpCyWNX6FOp1e2l.P3KNXX7AwcTIkEGz2d/B.oLnBUQgzAi', 'client');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domains`
--
ALTER TABLE `domains`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `fk_domain` (`domain_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `project_fields`
--
ALTER TABLE `project_fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_definition_id` (`field_definition_id`),
  ADD KEY `idx_project_id` (`project_id`),
  ADD KEY `idx_field_key` (`field_key`);

--
-- Indexes for table `project_field_definitions`
--
ALTER TABLE `project_field_definitions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_key_per_domain` (`domain_id`,`key_name`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `seo`
--
ALTER TABLE `seo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_id` (`domain_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_fields`
--
ALTER TABLE `project_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `project_field_definitions`
--
ALTER TABLE `project_field_definitions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `seo`
--
ALTER TABLE `seo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `data_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domains`
--
ALTER TABLE `domains`
  ADD CONSTRAINT `domains_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_domain` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `media_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_fields`
--
ALTER TABLE `project_fields`
  ADD CONSTRAINT `project_fields_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_fields_ibfk_2` FOREIGN KEY (`field_definition_id`) REFERENCES `project_field_definitions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seo`
--
ALTER TABLE `seo`
  ADD CONSTRAINT `seo_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
