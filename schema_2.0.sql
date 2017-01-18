-- CREATE DATABASE  IF NOT EXISTS `Detail_Wash` 
-- USE `Detail_Wash`;

CREATE DATABASE IF NOT EXISTS `heroku_fb3dc2d4bdd13bf` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `heroku_fb3dc2d4bdd13bf`;

-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: Detail_Wash
-- ------------------------------------------------------
-- Server version 5.5.49-0ubuntu0.14.04.1

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  PRIMARY KEY (`id`),
  KEY `washerid` (`washerid`),
  KEY `vehicleid` (`vehicleid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES (6,'43.8368386','-79.5143801',NULL,14,100,1,1,0,0,0,1,1,1,'Canada','48 Greenock Dr','ON','Vaughan','L6A 1P2','available'),(7,'43.8368386','-79.5143801',14,13,125,1,1,1,0,1,1,1,1,'Canada','48 Greenock Dr','ON','Vaughan','L6A 1P2','complete'),(8,'43.8368331','-79.5141575',NULL,13,35,0,0,0,1,1,1,0,0,'Canada','48 Greenock Dr','ON','Maple','L6A 1P3','available');
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES (1,13,12),(2,12,13),(3,NULL,NULL),(4,NULL,NULL),(7,14,10),(8,14,13),(9,14,14);
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
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
  `content` text,
  `rating` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subjectid` (`subjectid`),
  KEY `authorid` (`authorid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,13,12,'GREAT JOB',4,'0000-00-00 00:00:00'),(2,12,13,'Even better job GREAT JOB',4,'0000-00-00 00:00:00');
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
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isadmin` tinyint(1) NOT NULL DEFAULT '0',
  `month` varchar(255) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Fullchee, George, Jonathan, Ross','z@z.z','$2a$10$FqBcOeM5bSTW4EreRt1oQuyINue/.hU2l4ljHvXGKaZXL1czlbWEi',1,'January',1,2016,''),(10,'Ross Bevacqua','r.bevacqua94@gmail.com','$2a$10$VmiiHb0dluQYcbutufCsMebSLSGFggt9YoxEEDAfiBp./PtuPMw/2',0,'October',13,2004,''),(11,'Mysterion','whois@myserion.com','$2a$10$kA6DAeHoxNYMyYR5Svs3Ae8RPyKmBzbiEC8J0zGrfbB9qGb9lYOHq',1,'January',1,2016,''),(13,'asdfasdf','b@b.b','$2a$10$Lp6Sjp.GUtG3wFvFDQooVegzcHDb4zMA4a1i7NCvbqGm7c2QfU77O',0,'January',21,1999,''),(14,'George','George@gmail.com','$2a$10$5L9ipudplZctCFWWt.xfR.WMWujtwqX48e9IXQzxGb0xWHZ1MW6mu',0,'April',20,1995,'');
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
  `image` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (2,'Nissan','GT-R',2014,'abshabs',13,'/images/bob_porsche-911-2.jpg'),(12,'aaaaaa','N/A',1969,'AAAA 111',12,'images/placeholder_car.jpg'),(13,'Nissan','GT-R',2014,'ABCD555',10,'/images/r.bevacqua94@gmail.complaceholder_car.jpg'),(14,'Porche','911',2014,'ABCD234',10,'/images/r.bevacqua94@gmail.comclose_up_1.jpg');
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

-- Dump completed on 2016-07-30 16:24:05
