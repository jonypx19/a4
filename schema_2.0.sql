CREATE DATABASE  IF NOT EXISTS `Detail_Wash` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `Detail_Wash`;

-- USE `heroku_fb3dc2d4bdd13bf`;

-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: Detail_Wash
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `followers`
--

DROP TABLE IF EXISTS `followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `follower_id` int(11) DEFAULT NULL,
  `followee_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES (1, 13, 12), (2, 12, 13);
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `chat_reply`
--

DROP TABLE IF EXISTS `chat_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` longtext NOT NULL,
  `chat_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_reply`
--

LOCK TABLES `chat_reply` WRITE;
/*!40000 ALTER TABLE `chat_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract` (
  `id` int(11) NOT NULL,
  `latitude` varchar(100) NOT NULL,
  `longitude` varchar(100) NOT NULL,
  `washerid` int(11) DEFAULT NULL,
  `vehicleid` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `full_vacuuming` tinyint(1) NOT NULL,
  `floor_mats` tinyint(1) NOT NULL,
  `vinyl_and_plastic` tinyint(1) NOT NULL,
  `centre_console` tinyint(1) NOT NULL,
  `button_cleaning` tinyint(1) NOT NULL,
  `hand_wash` tinyint(1) NOT NULL,
  `clean_tires` tinyint(1) NOT NULL,
  `hand_wax` tinyint(1) NOT NULL,
  `country` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `province` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `postal_code` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `chat_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chat_content_UNIQUE` (`chat_id`),
  KEY `washerid` (`washerid`),
  KEY `vehicleid` (`vehicleid`),
  CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`washerid`) REFERENCES `users` (`id`),
  CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`vehicleid`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES (1,'43.84519969999999','-79.5180752',13,1,30,1,1,0,0,0,0,0,0,'Canada','400 Greenock Dr','ON','Vaughan','L6A 1P2','available',1), (2,'43.84519969999999','-79.5180752',12,2,30,1,1,0,0,0,0,0,0,'Canada','400 Greenock Dr','ON','Vaughan','L6A 1P2','available',2);
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subjectid` int(11) NOT NULL,
  `authorid` int(11) NOT NULL,
  `contractid` int(11) NOT NULL,
  `content` text,
  `rating` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subjectid` (`subjectid`),
  KEY `authorid` (`authorid`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`subjectid`) REFERENCES `users` (`id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`authorid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1, 13, 12, 1, "GREAT JOB", 4),
(2, 12, 13, 2, "Even better job GREAT JOB", 4);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `isadmin` BOOLEAN NOT NULL DEFAULT FALSE,
  `month` VARCHAR(255) NOT NULL,
  `day` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Fullchee, George, Jonathan, Ross','z@z.z','$2a$10$FqBcOeM5bSTW4EreRt1oQuyINue/.hU2l4ljHvXGKaZXL1czlbWEi', TRUE ,'January', 1, 2016),
(11,'Mysterion','whois@myserion.com','$2a$10$kA6DAeHoxNYMyYR5Svs3Ae8RPyKmBzbiEC8J0zGrfbB9qGb9lYOHq', TRUE, 'January',1,2016),
(12,'Terry Yan','t@t.t','$2a$10$Lp6Sjp.GUtG3wFvFDQooVegzcHDb4zMA4a1i7NCvbqGm7c2QfU77O', FALSE, 'January',21,1999),
(13,'asdfasdf','b@b.b','$2a$10$Lp6Sjp.GUtG3wFvFDQooVegzcHDb4zMA4a1i7NCvbqGm7c2QfU77O', FALSE, 'January',21,1999);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `make` varchar(45) NOT NULL,
  `model` varchar(45) NOT NULL,
  `year` int(11) NOT NULL,
  `license_plate` varchar(45) NOT NULL,
  `ownerid` int(11) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (12,'aaaaaa','N/A',1969,'AAAA 111',12,'images/placeholder_car.jpg'),
(2,'Nissan','GT-R',2014,'abshabs',13,'/images/bob_porsche-911-2.jpg');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-07-24 21:32:44
