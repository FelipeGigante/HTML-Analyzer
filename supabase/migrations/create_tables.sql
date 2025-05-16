-- Create tables for the HTML analyzer and quiz system

-- Table to store website analysis results
CREATE TABLE IF NOT EXISTS site_analyses (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  a_tags INTEGER DEFAULT 0,
  button_tags INTEGER DEFAULT 0,
  select_tags INTEGER DEFAULT 0,
  input_tags INTEGER DEFAULT 0,
  img_tags INTEGER DEFAULT 0,
  video_tags INTEGER DEFAULT 0
);

-- Table to store quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER NOT NULL, -- Index of the correct answer
  tr_model_principle TEXT, -- The TR-Model principle this question relates to
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store quiz results
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  analysis_id INTEGER REFERENCES site_analyses(id),
  score NUMERIC NOT NULL,
  answers JSONB NOT NULL, -- Array of selected answers
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample quiz questions
INSERT INTO quiz_questions (question, options, correct_answer, tr_model_principle) VALUES
(
  'The website has {a_tags} links. Based on TR-Model principles, what percentage should have descriptive text?',
  '["Less than 50%", "At least 75%", "100%", "It depends on the context"]',
  2,
  'Perceivable'
),
(
  'There are {img_tags} images on the site. According to accessibility standards, how many should have alt text?',
  '["Only decorative images", "Only informational images", "All images", "None if the site has good context"]',
  2,
  'Perceivable'
),
(
  'The site has {button_tags} buttons. What is the minimum requirement for keyboard accessibility?',
  '["All buttons must be focusable and activatable with keyboard", "Only main navigation buttons need keyboard access", "Touch devices don''t need keyboard accessibility", "Keyboard accessibility is optional"]',
  0,
  'Operable'
),
(
  'For the {input_tags} input fields on the site, what should be provided to make them accessible?',
  '["Visual styling only", "Labels and error messages", "No requirements for inputs", "Only placeholder text"]',
  1,
  'Understandable'
),
(
  'Based on TR-Model principles, what is required for the {video_tags} videos on the site?',
  '["Captions and audio descriptions", "Just high quality video", "No special requirements", "Only captions for foreign language"]',
  0,
  'Perceivable'
);
