-- Users seeding
-- password for both users is 'password123'
INSERT INTO users (username, password, role)
VALUES
  ('admin', '$2a$10$9RlsuCn/hA7x4ZNZYUTP3un5PszSxlU828V9F7tuiJG.yyj3Te8zy', 'admin'),
  ('viewer', '$2a$10$9RlsuCn/hA7x4ZNZYUTP3un5PszSxlU828V9F7tuiJG.yyj3Te8zy', 'viewer')
ON CONFLICT DO NOTHING;

-- Posts seeding
INSERT INTO posts (user_id, title, content)
VALUES
  (1, 'Welcome Post', 'This is the first post from the admin user.'),
  (2, 'Viewer Post', 'This is a post created by the viewer user.'),
  (1, 'Another Admin Post', 'Admin testing CRUD functionality.'),
  (2, 'Viewer Insights', 'Viewer sharing some thoughts and ideas.'),
  (1, 'Admin Tips', 'Some useful tips from the admin.'),
  (2, 'Daily Update', 'Viewer posts a daily update.'),
  (1, 'Feature Release', 'Announcing a new feature from the admin.'),
  (2, 'User Experience', 'Viewer feedback on the app experience.'),
  (1, 'Maintenance Notice', 'Admin informs about scheduled maintenance.'),
  (2, 'Community Post', 'Viewer engaging with the community.')
ON CONFLICT DO NOTHING;

