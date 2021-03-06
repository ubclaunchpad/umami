USE `umami_db`;
DROP procedure IF EXISTS `createUsersTable`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users_table`;
SET FOREIGN_KEY_CHECKS = 1;

DELIMITER $$

USE `umami_db`$$
CREATE PROCEDURE `createUsersTable` ()
BEGIN

CREATE TABLE `users_table` (
  `user_id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50),
  `first_name` VARCHAR(50),
  `last_name` VARCHAR(50),
  `email` VARCHAR(50),
  `location` VARCHAR(50),
  `profile_picture` VARCHAR(255),
  `recipe_driven` BOOLEAN,
  `vegetarian` BOOLEAN,
  `vegan` BOOLEAN,
  `pescatarian` BOOLEAN,
  `gluten_free` BOOLEAN,
  `dairy_free` BOOLEAN,
  `keto` BOOLEAN,
  `paleo` BOOLEAN,
  `style` VARCHAR(50),
  `experience` DECIMAL(10, 5),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

END$$

DELIMITER ;