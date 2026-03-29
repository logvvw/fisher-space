-- 创建数据库
CREATE DATABASE IF NOT EXISTS fisher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fisher;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'venue_admin', 'angler') DEFAULT 'angler',
  nickname VARCHAR(50),
  avatar VARCHAR(255),
  gender VARCHAR(10),
  province VARCHAR(50),
  city VARCHAR(50),
  status ENUM('active', 'banned') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 钓场表
CREATE TABLE IF NOT EXISTS venues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  address VARCHAR(255),
  area DECIMAL(10,2),
  facilities JSON,
  business_hours VARCHAR(100),
  phone VARCHAR(20),
  cover_image VARCHAR(255),
  description TEXT,
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 鱼种表
CREATE TABLE IF NOT EXISTS species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  category ENUM('freshwater', 'saltwater') DEFAULT 'freshwater',
  avg_weight DECIMAL(10,2),
  quantity INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 收费表
CREATE TABLE IF NOT EXISTS pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  type ENUM('per_weight', 'per_day', 'per_hour', 'membership') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  description VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 鱼讯表
CREATE TABLE IF NOT EXISTS fish_infos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  images JSON,
  bite_rate VARCHAR(50),
  rules TEXT,
  is_top BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 资讯文章表
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500),
  cover VARCHAR(255),
  category ENUM('technique', 'encyclopedia', 'news') NOT NULL,
  tags JSON,
  author_id INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  view_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  venue_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  UNIQUE KEY uk_user_venue (user_id, venue_id)
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  image VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  position ENUM('home_leisure', 'home_business') DEFAULT 'home_leisure',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 话题表
CREATE TABLE IF NOT EXISTS topics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  color VARCHAR(50) DEFAULT '#667eea',
  post_count INT DEFAULT 0,
  follow_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_hot TINYINT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 鱼讯统计字段（补充）
ALTER TABLE fish_infos ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;
ALTER TABLE fish_infos ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;
ALTER TABLE fish_infos ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;