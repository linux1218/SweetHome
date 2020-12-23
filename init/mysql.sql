CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT ,
    authId VARCHAR(50) NOT NULL ,
    username VARCHAR(30),
    password VARCHAR(255),
    salt VARCHAR(255),
    displayName VARCHAR(50),
    email VARCHAR(50) NOT NULL ,
    PRIMARY KEY (id),
    UNIQUE (authId)
) ENGINE = InnoDB;
