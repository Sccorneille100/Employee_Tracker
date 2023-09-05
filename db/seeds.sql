-- Insert data into the department table
INSERT INTO department (name) VALUES
    ("Recieving"),
    ("Management"),
    ("Paint"),
    ("Front End"),
    ("Lawn and garden");
SELECT * FROM department;
-- Insert data into the role table
INSERT INTO role (title, salary, department_id) VALUES
    ("Cashier", 50000, 4),
    ("Head Cashier", 60000, 4),
    ("Sales Associate", 60000, 5),
    ("Assistant Manager", 70000, 2);
SELECT * FROM role;

INSERT INTO employee (firstname, lastname, role_id, manager_id) VALUES
('mike', 'anderson', 2, NULL),
('Kate', 'miller', 2, 1),
('kevin', 'smith', 2, 1);