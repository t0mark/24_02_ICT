CREATE DATABASE community default CHARACTER SET UTF8;
grant all privileges on comunity.* to MySQL82

CREATE TABLE user
  (
     id        VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
     password  VARCHAR(255) DEFAULT NULL,
     nickname  VARCHAR(255) DEFAULT NULL,
     createdat DATETIME DEFAULT NULL,
     idx       BIGINT UNSIGNED NOT NULL auto_increment comment '사용자 인덱스',
     img       LONGBLOB,
     imgtitle  VARCHAR(255) DEFAULT NULL,
     PRIMARY KEY (idx)
  );
  
CREATE TABLE board
  (
     id        INT NOT NULL auto_increment,
     title     VARCHAR(255) DEFAULT NULL,
     content   TEXT,
     createdat DATETIME DEFAULT NULL,
     updatedat DATETIME DEFAULT NULL,
     writerid  INT DEFAULT NULL,
     viewcount INT DEFAULT NULL,
     img       LONGBLOB,
     imgtitle  VARCHAR(255) DEFAULT NULL,
     PRIMARY KEY (id)
  );
  
CREATE TABLE comment
  (
     idx       INT NOT NULL auto_increment,
     boardid   INT DEFAULT NULL,
     writerid  INT DEFAULT NULL,
     content   TEXT,
     createdat DATETIME DEFAULT NULL,
     PRIMARY KEY (idx)
  );