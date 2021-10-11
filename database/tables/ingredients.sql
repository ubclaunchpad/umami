USE `umami_db`;
DROP procedure IF EXISTS `createIngredientsTable`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `ingredients_table`;
SET FOREIGN_KEY_CHECKS = 1;

DELIMITER $$

USE `umami_db`$$
CREATE PROCEDURE `createIngredientsTable` ()
BEGIN

CREATE TABLE `ingredients_table` (
  `ingredient_id` INT NOT NULL auto_increment,
  `recipe_id` INT NOT NULL,
  `ingredient_name` VARCHAR(50),
  `category` VARCHAR(50),
  PRIMARY KEY (`ingredient_id`),
  CONSTRAINT fk_recipe_ingredient FOREIGN KEY (`recipe_id`)
  REFERENCES `recipes_table`(`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

END$$

DELIMITER ;