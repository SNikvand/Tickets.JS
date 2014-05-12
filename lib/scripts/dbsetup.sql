CREATE TABLE users
(
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  type VARCHAR(8) NOT NULL,
  CONSTRAINT pk_userID PRIMARY KEY (id)
)

CREATE TABLE departments
(
  id SERIAL NOT NULL,
  name VARCHAR(100) NOT NULL,
  CONSTRAINT pk_departmentID PRIMARY KEY (id)
)

CREATE TABLE user-dept
(
  user_id INT NOT NULL,
  dept_id INT NOT NULL,
  CONSTRAINT pk_userDept PRIMARY KEY (user_id, dept_id),
  CONSTRAINT fk_userID FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_deptID FOREIGN KEY (dept_id) REFERENCES departments(id)
)

CREATE TABLE tickets
(
  id SERIAL NOT NULL,
  hash VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  create_date DATE NOT NULL,
  department INT NOT NULL,
  description TEXT NOT NULL,
  priority INT NOT NULL,
  due_date date NOT NULL,
  altered_by INT,
  altered_date DATE,
  assigned_to INT,
  complete_date date,
  CONSTRAINT pk_ticketID PRIMARY KEY (id),
  CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES departments(id),
  CONSTRAINT fk_alteredBy FOREIGN KEY (altered_by) REFERENCES users(id),
  CONSTRAINT fk_assignedTo FOREIGN KEY (assigned_to) REFERENCES users(id)
)

CREATE TABLE tickets_archive
(
  id SERIAL NOT NULL,
  hash VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  create_date DATE NOT NULL,
  department INT NOT NULL,
  description TEXT NOT NULL,
  priority INT NOT NULL,
  due_date date NOT NULL,
  altered_by INT,
  altered_date DATE,
  assigned_to INT,
  complete_date date NOT NULL,
  CONSTRAINT pk_ticket_archiveID PRIMARY KEY (id),
  CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES departments(id),
  CONSTRAINT fk_alteredBy FOREIGN KEY (altered_by) REFERENCES users(id),
  CONSTRAINT fk_assignedTo FOREIGN KEY (assigned_to) REFERENCES users(id)
)

CREATE TABLE comments
(
  id SERIAL NOT NULL,
  ticket_id INT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created DATE NOT NULL,
  description TEXT NOT NULL,
  CONSTRAINT pk_commentID PRIMARY KEY (id),
  CONSTRAINT fk_ticketID FOREIGN KEY (ticket_id) REFERENCES tickets(id)
)

CREATE TABLE comments_archive
(
  id SERIAL NOT NULL,
  ticket_id INT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created DATE NOT NULL,
  description TEXT NOT NULL,
  CONSTRAINT pk_comment_archiveID PRIMARY KEY (id),
  CONSTRAINT fk_ticket_archiveID FOREIGN KEY (ticket_id) REFERENCES tickets_archive(id)
)
