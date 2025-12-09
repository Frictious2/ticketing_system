INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2a$12$1r1i6.8qvzcMNNRY8S7Qp.U5XjAW1avIVFSfpm6ovb9JbBmN1p5GS', 'admin'),
('Tech One', 'tech1@example.com', '$2a$12$Zc6OGpNxfbdFTMoJjJyOZulvijxr.V20eHir6aPRvskF38iTo8Pai', 'technician'),
('Requester One', 'req1@example.com', '$2a$12$r7wYEVWblJfpvEjepxhtMuyFmJeh2snYbgZRHCd9u14IQ146rID0i', 'requester');

INSERT INTO tickets (title, description, priority, issue_type, status, creator_id, assignee_id) VALUES
('Assignment 1: System Setup Correction', 'Corrected setup steps and configuration applied', 'high', 'software', 'open', 3, 2),
('Assignment 2: Network Troubleshooting Correction', 'Resolved network IP configuration and DNS', 'medium', 'network', 'open', 3, 2);

