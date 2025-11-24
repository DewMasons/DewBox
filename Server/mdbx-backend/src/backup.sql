-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydewbox
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `coop`
--

DROP TABLE IF EXISTS `coop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coop` (
  `coop_id` int NOT NULL,
  `type` int DEFAULT NULL,
  `coop_name` varchar(45) DEFAULT NULL,
  `coop_contact_name` varchar(45) DEFAULT NULL,
  `contact_phoneno` int DEFAULT NULL,
  `coop_adress_line1` varchar(45) DEFAULT NULL,
  `coop_adress_line2` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `state_registration#` varchar(45) DEFAULT NULL,
  `purpose` varchar(45) DEFAULT NULL,
  `motto` varchar(45) DEFAULT NULL,
  `country` varchar(4) DEFAULT NULL,
  `subscription` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`coop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coop`
--

LOCK TABLES `coop` WRITE;
/*!40000 ALTER TABLE `coop` DISABLE KEYS */;
/*!40000 ALTER TABLE `coop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coop_members`
--

DROP TABLE IF EXISTS `coop_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coop_members` (
  `coop_id` int NOT NULL,
  `membership_serial#` int DEFAULT NULL,
  `membership_officialid` varchar(12) DEFAULT NULL,
  `member_name` varchar(45) DEFAULT NULL,
  `member_phoneno` int DEFAULT NULL,
  `subscription_ytd` decimal(10,0) DEFAULT NULL,
  `coop_loan_collected` decimal(10,0) DEFAULT NULL,
  `coop_loan_repayment` decimal(10,0) DEFAULT NULL,
  `coop_loan_repaid` decimal(10,0) DEFAULT NULL,
  `coop_investment` decimal(10,0) DEFAULT NULL,
  `coop_investment_yield` decimal(10,0) DEFAULT NULL,
  `coop_investment_payback` decimal(10,0) DEFAULT NULL,
  `coop_mdbx_subscriber_id` int DEFAULT NULL,
  `date_loan_disbursed` date DEFAULT NULL,
  `date_loan_matures` date DEFAULT NULL,
  `loan_repayment_frequency` int DEFAULT NULL,
  `date_investment_begins` date DEFAULT NULL,
  `date_investment_matures` date DEFAULT NULL,
  `investment_repayment_frequency` int DEFAULT NULL,
  PRIMARY KEY (`coop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coop_members`
--

LOCK TABLES `coop_members` WRITE;
/*!40000 ALTER TABLE `coop_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `coop_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coop_types`
--

DROP TABLE IF EXISTS `coop_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coop_types` (
  `coop_type_id` int NOT NULL,
  `coop_type_description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`coop_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coop_types`
--

LOCK TABLES `coop_types` WRITE;
/*!40000 ALTER TABLE `coop_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `coop_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_used_type`
--

DROP TABLE IF EXISTS `device_used_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_used_type` (
  `device_used_id` int NOT NULL,
  `device_name` varchar(45) NOT NULL,
  PRIMARY KEY (`device_used_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_used_type`
--

LOCK TABLES `device_used_type` WRITE;
/*!40000 ALTER TABLE `device_used_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_used_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grants_yearly`
--

DROP TABLE IF EXISTS `grants_yearly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grants_yearly` (
  `grants_year` year NOT NULL,
  `cashgrant_01` decimal(10,0) DEFAULT NULL,
  `cashgrant_02` decimal(10,0) DEFAULT NULL,
  `cashgrant_03` decimal(10,0) DEFAULT NULL,
  `cashgrant_04` decimal(10,0) DEFAULT NULL,
  `grant_egfed` decimal(10,0) DEFAULT NULL,
  `cash01_year_limit` decimal(10,0) DEFAULT NULL,
  `cash02_year_limit` decimal(10,0) DEFAULT NULL,
  `cash03_year_limit` decimal(10,0) DEFAULT NULL,
  `cash04_year_limit` decimal(10,0) DEFAULT NULL,
  `egfed_year_limit` decimal(10,0) DEFAULT NULL,
  `cash01_ytdno_given` decimal(10,0) DEFAULT NULL,
  `cash02_ytdno_given` decimal(10,0) DEFAULT NULL,
  `cash03_ytdno_given` decimal(10,0) DEFAULT NULL,
  `cash04_ytdno_given` decimal(10,0) DEFAULT NULL,
  `egfed_ytdno_given` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`grants_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grants_yearly`
--

LOCK TABLES `grants_yearly` WRITE;
/*!40000 ALTER TABLE `grants_yearly` DISABLE KEYS */;
/*!40000 ALTER TABLE `grants_yearly` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_channels`
--

DROP TABLE IF EXISTS `service_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_channels` (
  `service_channel_id` int NOT NULL,
  `service_channel_description` varchar(45) DEFAULT NULL,
  `service_channel_ytdno` int DEFAULT NULL,
  `service_channel_ytdamount` decimal(10,0) DEFAULT NULL,
  `service_channel_mtdno` int DEFAULT NULL,
  `service_channel_mtdamount` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`service_channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_channels`
--

LOCK TABLES `service_channels` WRITE;
/*!40000 ALTER TABLE `service_channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriber_balance`
--

DROP TABLE IF EXISTS `subscriber_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber_balance` (
  `subscriber_id` int NOT NULL,
  `mtd_contributed` decimal(11,0) DEFAULT NULL,
  `ytd_contributed` decimal(12,0) DEFAULT NULL,
  `available_balance` decimal(12,0) NOT NULL,
  `mtd_wallets` decimal(12,0) DEFAULT NULL,
  `mtd_wallets_copy1` decimal(12,0) DEFAULT NULL,
  `mtd_esusu` decimal(12,0) DEFAULT NULL,
  `ytd_esusu` decimal(12,0) DEFAULT NULL,
  `mtd_purchases` decimal(12,0) DEFAULT NULL,
  `ytd_purchases` decimal(12,0) DEFAULT NULL,
  PRIMARY KEY (`subscriber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriber_balance`
--

LOCK TABLES `subscriber_balance` WRITE;
/*!40000 ALTER TABLE `subscriber_balance` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriber_balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriber_beneficiaries`
--

DROP TABLE IF EXISTS `subscriber_beneficiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber_beneficiaries` (
  `subscriber_id` int NOT NULL,
  `beneficiary_serial#` int NOT NULL,
  `beneficiary_surname` varchar(45) DEFAULT NULL,
  `percent_benefit` int DEFAULT NULL,
  PRIMARY KEY (`subscriber_id`),
  UNIQUE KEY `beneficiary_serial#_UNIQUE` (`beneficiary_serial#`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriber_beneficiaries`
--

LOCK TABLES `subscriber_beneficiaries` WRITE;
/*!40000 ALTER TABLE `subscriber_beneficiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriber_beneficiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `address1` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `alternatePhone` varchar(255) DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `referral` varchar(255) DEFAULT NULL,
  `referralPhone` varchar(255) DEFAULT NULL,
  `nextOfKinName` varchar(255) NOT NULL,
  `nextOfKinContact` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `othername` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_3e82da94a504e2d6dff5c9f393` (`userId`),
  CONSTRAINT `FK_3e82da94a504e2d6dff5c9f393f` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
INSERT INTO `subscribers` VALUES (1,'JOSHUA','Tedder hall UI IBADAN','DZ','10','2003-12-29','+2349034445673','+2349116896136','NGN','Joshua Oludimu','+2348153478944','Akeem','+2348153478944','OLUDIMU','Ibadan','Male','$2b$10$Cy.HaSFcGK8FVJOtZfbmUecTuVG/cgOOG2Wtt9SE25ZhpMdJC4ncK',NULL,NULL),(2,'JOSHUA','Tedder hall UI IBADAN','DZ','10','2003-12-29','+2349034445673','+2349116896136','NGN','Joshua Oludimu','+2348153478944','Akeem','+2348153478944','OLUDIMU','Ibadan','Male','$2b$10$VSHlQfw11wE6.91htsJj.eM1oXkdnSt0TYggTONHLZKGSxfDcXw.y',NULL,NULL),(3,'JOSHUA','Victoria Island','NG','OY','2005-06-11','+2349024565966','+2349023564968','NGN','Joshua Oludimu','+2348153478944','Akeem Oludimu','+2348153478944','OLUDIMU','Lagos','Male','$2b$10$mml5oO.eh3aR.aodn7Mf7O7wtBd4FRW5VnL6DFAMOfe6bfbLsEl0K','0cc454e5-3e80-11f0-a23e-d4bed9179397',NULL),(4,'Me','BayArea','US','CA','2003-07-11','+2349012345678','+123456784554','AUD','Anna Croft','+44678903445','Kim Dokja','+20345678903','Time','LA','Male','$2b$10$GKQthrbGGh7kRtTHNkt2jOxSK2HtSdawpufG9HZH11V0erIZHrwWC','8fbc95c9-3e91-11f0-a23e-d4bed9179397',NULL),(5,'Jojo','My Fist','BG','22','2003-06-07','+2349123456789','+2349014845195','NGN','Anna Croft','+2348153478944','Akeem Oludimu','+2349023564968','Jostar','Sofia','Male','$2b$10$Nkn/Y3p6/TDS3KCBNUP6z.8E72qc/c1sLi2wIPAt04/FiQArk4hu.',NULL,NULL),(6,'Eren','The walls','AG','05','1999-12-31','+2348012345678','+234911168961','BBD','Armin Arlet','+20815347894','Mikasa Ackermann','+443789023455','Jaeger','Maria','Male','Mikasa&4','a3000e61-40f2-11f0-8cd8-d4bed9179397','Tatakae'),(8,'Akeem','Penthouse, Embassy Towers','NG','OY','1967-03-20','+2348153478944','+2349014845195','USD','Joshua Oludimu','+2349023564968','JOSHUA OLUDIMU','+2349023564968','Oludimu','Ibadan','Male','$2b$10$s0FyasGrh7/kTZUVFeSvBuIuu37lr8jKs5yHSpLxYkNCPGhOxgUuK','45aa5b04-4334-11f0-86d7-d4bed9179397','Olasunkanmi'),(9,'JOSHUA','Tedder hall UI IBADAN','NG','OY','2005-06-11','+2348153478943','+2349116896136','BMD','Anna Croft','+2348153478944','Akeem Oludimu','+2348153478944','OLUDIMU','Ibadan','Male','$2b$10$MYqy5ABj/w7weS14qYEyQesRtMhZnR1V/z.c6wWQWq/w.RG9B.dP.','aa5f7f7c-4417-11f0-86d7-d4bed9179397','Olayiwola'),(11,'JOSHUA','Tedder hall UI IBADAN','NG','OY','2005-06-11','+2348127346590','+23480967844','USD','Anna Croft','+2349095848347','Akeem Oludimu','+234679949040','OLUDIMU','Ibadan','Male','$2b$10$VdxLmvZVM911T.0f3Oz.ueFRvqhtuj6.OxM8L8.00IaGO.Rqr0Vtm','c1afaeb6-4420-11f0-86d7-d4bed9179397','Olayiwola'),(12,'Finn','Adventure time','GB','SHN','1900-12-31','+2348127346500','+20904578343','USD','Anna Croft','+14443356688','Jake the dog','+44094747883','The-Human','Jump city','Male','$2b$10$jiZtNEIzRdu8dUkKJImX/OYIIRqkuiyMWDs/VcuI56UckYKq3ax56','8e9866fa-4422-11f0-86d7-d4bed9179397','Jake'),(13,'Shiki','Tokyo','JP','13','2006-04-01','+2348105504314','+23481169038','BYN','Orihime','+23480967435','Tachibana','+2347832993876','chan','Tokyo','Female','$2b$10$RguiDZJzObmLTeBqAaFKEOILic/wL/FYvlnqGTvsfX2AOMezu2Fx6','03acaee9-4424-11f0-86d7-d4bed9179397','Icecream'),(14,'Sarah','15 Adebayo Street, Bodija Estate','NG','OY','1993-03-14','+2348105504315','+2347014446789','NGN',' Michael Adebayo','+2348053334567','David Johnson','+2348092221234','Johnson',' Ibadan','Female','$2b$10$QJNBEdDPEUJl.c9/QFJ15eP/CZExeU5mP6SzaBJ/iQs4./EqWHQo6','9cc7a055-4425-11f0-86d7-d4bed9179397','Adeife'),(15,'Yetunde','Akara,Odo-ona kekere','NG','OY','1980-06-28','+2348065427739','+2347045815992','NGN','Joshua Oludimu','+2349023564968','JOSHUA OLUDIMU','+2349023564968','Oludimu','Ibadan','Female','$2b$10$bm6/6ZPCpjAdRclgW92uru3kQZ85LOCKcoo7LwkN7zgdjSio0IGp6','512abfa4-4427-11f0-86d7-d4bed9179397','Temitope'),(16,'Test','123 Test St','Testland','Teststate','1990-01-01','testuser567633','1234567891','USD','Referrer','9876543210','Kin Name','Kin Contact','User','Test City','Other','$2b$10$tRqDyiyHTIXVUKmKP35fguvModY4SbtTPIH/J2okE4qe7Bb4ETxzy','472570d2-6734-11f0-8ca8-d4bed9179397','Middle'),(17,'Test','123 Test St','Testland','Teststate','1990-01-01','testuser314687','1234567891','USD','Referrer','9876543210','Kin Name','Kin Contact','User','Test City','Other','$2b$10$KN0UVvfij9Igb0DoPlVGWeLmyyqRpXgHcfo4icba9F1F91NOMCp/G','ad38de78-6734-11f0-8ca8-d4bed9179397','Middle'),(18,'Test','123 Test St','Testland','Teststate','1990-01-01','testuser950537','1234567891','USD','Referrer','9876543210','Kin Name','Kin Contact','User','Test City','Other','$2b$10$kZ/O0ersiIaMtiKgQJTFIubTtP9uB.2KGrwldZFFRjTaB4oOoJmgW','15c1b932-6735-11f0-8ca8-d4bed9179397','Middle'),(19,'Test','123 Test St','Testland','Teststate','1990-01-01','testuser494682','1234567891','USD','Referrer','9876543210','Kin Name','Kin Contact','User','Test City','Other','$2b$10$WGU98WD4siTLkNrTJQJWB.vbkVtlnvq/3PfSwBCoDR3jrq/B8RTGO','4853e2ba-674b-11f0-8ce8-d4bed9179397','Middle');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` varchar(36) NOT NULL,
  `type` enum('contribution','withdrawal') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_605baeb040ff0fae995404cea37` (`userId`),
  CONSTRAINT `FK_605baeb040ff0fae995404cea37` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_type`
--

DROP TABLE IF EXISTS `transaction_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_type` (
  `transaction_type_id` int NOT NULL,
  `transaction_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transaction_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_type`
--

LOCK TABLES `transaction_type` WRITE;
/*!40000 ALTER TABLE `transaction_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions_mdbx`
--

DROP TABLE IF EXISTS `transactions_mdbx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions_mdbx` (
  `subscriber_id` int NOT NULL,
  `lineno` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `timestamp` timestamp(6) NULL DEFAULT NULL,
  `service_channel_id` int DEFAULT NULL,
  `transaction_type_id` int DEFAULT NULL,
  `device_used_id` int DEFAULT NULL,
  `opening_balance` decimal(10,0) DEFAULT NULL,
  `amount_transaction` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`subscriber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions_mdbx`
--

LOCK TABLES `transactions_mdbx` WRITE;
/*!40000 ALTER TABLE `transactions_mdbx` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions_mdbx` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `subscriber_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('03acaee9-4424-11f0-86d7-d4bed9179397','Shiki chan','a@gmail.com','+2348105504314','$2b$10$RguiDZJzObmLTeBqAaFKEOILic/wL/FYvlnqGTvsfX2AOMezu2Fx6',0.00,'13'),('0cc454e5-3e80-11f0-a23e-d4bed9179397','JOSHUA Olayiwola OLUDIMU','johxen77@gmail.com','+2349024565966','$2b$10$xTWRtrEF8nuUKh.TPwfUKOaRXkXjqv1fppaOZ2xG4kqkD19r8FU.O',0.00,'3'),('10f45f38-3e7f-11f0-a23e-d4bed9179397','JOSHUA Olayiwola OLUDIMU','joludimu243763@stu.ui.edu.ng','+2349034445673','$2b$10$QLVutI/RyzjuGPtXt1SMzO//4dTpB9rlDjs0S0NBWffXITtPMqNFS',0.00,'2'),('15c1b932-6735-11f0-8ca8-d4bed9179397','Test User','test1753213813772@example.com','testuser950537','$2b$10$kZ/O0ersiIaMtiKgQJTFIubTtP9uB.2KGrwldZFFRjTaB4oOoJmgW',1000.00,'18'),('45aa5b04-4334-11f0-86d7-d4bed9179397','Akeem Oludimu','hakeem.oludimu@gmail.com','+2348153478944','$2b$10$s0FyasGrh7/kTZUVFeSvBuIuu37lr8jKs5yHSpLxYkNCPGhOxgUuK',0.00,'8'),('472570d2-6734-11f0-8ca8-d4bed9179397','Test User','test1753213453253@example.com','testuser567633','$2b$10$tRqDyiyHTIXVUKmKP35fguvModY4SbtTPIH/J2okE4qe7Bb4ETxzy',1000.00,'16'),('4853e2ba-674b-11f0-8ce8-d4bed9179397','Test User','test1753223337365@example.com','testuser494682','$2b$10$WGU98WD4siTLkNrTJQJWB.vbkVtlnvq/3PfSwBCoDR3jrq/B8RTGO',1000.00,'19'),('512abfa4-4427-11f0-86d7-d4bed9179397','Yetunde Oludimu','temitopeyetoludimu@gmail.com','+2348065427739','$2b$10$bm6/6ZPCpjAdRclgW92uru3kQZ85LOCKcoo7LwkN7zgdjSio0IGp6',0.00,'15'),('8e9866fa-4422-11f0-86d7-d4bed9179397','Finn The-Human','unclegrandpa@cn.com','+2348127346500','$2b$10$jiZtNEIzRdu8dUkKJImX/OYIIRqkuiyMWDs/VcuI56UckYKq3ax56',0.00,'12'),('8fbc95c9-3e91-11f0-a23e-d4bed9179397','Me Huck Time','jo@gmail.com','+2349012345678','$2b$10$o44QwX2ZJAqgU7D6b5v3vetPr5fDVmm./FsHdPTyJy3cVM2MQckcm',0.00,'4'),('9cc7a055-4425-11f0-86d7-d4bed9179397','Sarah Johnson','sarah.johnson@example.com','+2348105504315','$2b$10$QJNBEdDPEUJl.c9/QFJ15eP/CZExeU5mP6SzaBJ/iQs4./EqWHQo6',0.00,'14'),('a3000e61-40f2-11f0-8cd8-d4bed9179397','Eren Jaeger','eren@gmail.com','+2348012345678','Mikasa&4',0.00,'6'),('aa5f7f7c-4417-11f0-86d7-d4bed9179397','JOSHUA OLUDIMU','joshuaoludimu007@gmail.com','+2348153478943','$2b$10$MYqy5ABj/w7weS14qYEyQesRtMhZnR1V/z.c6wWQWq/w.RG9B.dP.',0.00,'9'),('ad38de78-6734-11f0-8ca8-d4bed9179397','Test User','test1753213638147@example.com','testuser314687','$2b$10$KN0UVvfij9Igb0DoPlVGWeLmyyqRpXgHcfo4icba9F1F91NOMCp/G',1000.00,'17'),('c1afaeb6-4420-11f0-86d7-d4bed9179397','JOSHUA OLUDIMU','joshuaoludimutric00@gmail.com','+2348127346590','$2b$10$VdxLmvZVM911T.0f3Oz.ueFRvqhtuj6.OxM8L8.00IaGO.Rqr0Vtm',0.00,'11'),('fba544ac-3eac-11f0-a23e-d4bed9179397','Jojo Jostar','jjjj@gmail.com','+2349123456789','$2b$10$Nkn/Y3p6/TDS3KCBNUP6z.8E72qc/c1sLi2wIPAt04/FiQArk4hu.',0.00,'5');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `random_number` varchar(6) NOT NULL DEFAULT '381922',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d376a9f93bba651f32a2c03a7d` (`mobile`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'joshuaoludimutric007@gmail.com','$2b$10$b5hB/E7lBnsrl.GPNywxVeKj34j0ZBEakPZvZQnv67dyDcgwDgW0q','+2349023564968','336829'),(2,'johxen77@gmail.com','$2b$10$s.gBcrfjx6MzGQyCUcsJcepktg.Dif/GDS3QxsiOpk/V08TdfeaWu','+2349116896136','762815'),(3,'eren@gmail.com','Mikasa&4','+2348012345678','309620'),(5,'hakeem.oludimu@gmail.com','$2b$10$s0FyasGrh7/kTZUVFeSvBuIuu37lr8jKs5yHSpLxYkNCPGhOxgUuK','+2348153478944','230917'),(6,'joshuaoludimu007@gmail.com','$2b$10$MYqy5ABj/w7weS14qYEyQesRtMhZnR1V/z.c6wWQWq/w.RG9B.dP.','+2348153478943','365619'),(8,'joshuaoludimutric00@gmail.com','$2b$10$VdxLmvZVM911T.0f3Oz.ueFRvqhtuj6.OxM8L8.00IaGO.Rqr0Vtm','+2348127346590','110913'),(9,'unclegrandpa@cn.com','$2b$10$jiZtNEIzRdu8dUkKJImX/OYIIRqkuiyMWDs/VcuI56UckYKq3ax56','+2348127346500','563785'),(10,'a@gmail.com','$2b$10$RguiDZJzObmLTeBqAaFKEOILic/wL/FYvlnqGTvsfX2AOMezu2Fx6','+2348105504314','224576'),(11,'sarah.johnson@example.com','$2b$10$QJNBEdDPEUJl.c9/QFJ15eP/CZExeU5mP6SzaBJ/iQs4./EqWHQo6','+2348105504315','629672'),(13,'test1753213453253@example.com','$2b$10$tRqDyiyHTIXVUKmKP35fguvModY4SbtTPIH/J2okE4qe7Bb4ETxzy','testuser567633','356747'),(14,'test1753213638147@example.com','$2b$10$KN0UVvfij9Igb0DoPlVGWeLmyyqRpXgHcfo4icba9F1F91NOMCp/G','testuser314687','860483'),(15,'test1753213813772@example.com','$2b$10$kZ/O0ersiIaMtiKgQJTFIubTtP9uB.2KGrwldZFFRjTaB4oOoJmgW','testuser950537','655667'),(16,'test1753223337365@example.com','$2b$10$WGU98WD4siTLkNrTJQJWB.vbkVtlnvq/3PfSwBCoDR3jrq/B8RTGO','testuser494682','629455');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets_pay`
--

DROP TABLE IF EXISTS `wallets_pay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets_pay` (
  `wallet_id` int NOT NULL,
  `line_no` int NOT NULL,
  `paid_invoice_ref` decimal(10,0) DEFAULT NULL,
  `invoice_amount` decimal(10,0) DEFAULT NULL,
  `amount_paid` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`wallet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets_pay`
--

LOCK TABLES `wallets_pay` WRITE;
/*!40000 ALTER TABLE `wallets_pay` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets_pay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets_subscribers`
--

DROP TABLE IF EXISTS `wallets_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets_subscribers` (
  `subscriber_id` int NOT NULL,
  `wallets_serial#` int DEFAULT NULL,
  `wallets_amount_created` decimal(10,0) DEFAULT NULL,
  `wallets_available_balance` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`subscriber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets_subscribers`
--

LOCK TABLES `wallets_subscribers` WRITE;
/*!40000 ALTER TABLE `wallets_subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yearly_summary`
--

DROP TABLE IF EXISTS `yearly_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yearly_summary` (
  `year` year NOT NULL,
  `subscriber_id` int NOT NULL,
  `piggy` decimal(10,0) DEFAULT NULL,
  `ica` decimal(10,0) DEFAULT NULL,
  `wallets` decimal(10,0) DEFAULT NULL,
  `purchases` decimal(10,0) DEFAULT NULL,
  `loans` decimal(10,0) DEFAULT NULL,
  `coop_esusu` decimal(10,0) DEFAULT NULL,
  `coop_external` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`year`,`subscriber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yearly_summary`
--

LOCK TABLES `yearly_summary` WRITE;
/*!40000 ALTER TABLE `yearly_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `yearly_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mydewbox'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 17:58:28
