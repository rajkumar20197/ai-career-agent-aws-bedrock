"""
Test Suite for AWS Bedrock Integration
Tests all AI-powered features
"""

import unittest
import json
import sys
import os
from unittest.mock import Mock, patch, MagicMock

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/lambda')))

from bedrock_integration import (
    analyze_resume,
    tailor_resume_for_job,
    generate_career_roadmap,
    get_market_insights,
    calculate_job_score,
    generate_interview_questions,
    analyze_email_for_interview
)


class TestBedrockIntegration(unittest.TestCase):
    """Test cases for Bedrock AI integration"""

    def setUp(self):
        """Set up test fixtures"""
        self.sample_resume = """
        John Doe
        Software Engineer
        
        EXPERIENCE:
        - 3 years of Python development
        - Built REST APIs with Flask
        - Worked with AWS services
        
        SKILLS:
        Python, JavaScript, AWS, Docker, SQL
        """
        
        self.sample_job_description = """
        Senior Software Engineer
        
        Requirements:
        - 5+ years Python experience
        - AWS expertise
        - Strong system design skills
        - Leadership experience
        """
        
        self.sample_user_profile = {
            'userId': 'test-user-1',
            'skills': ['Python', 'AWS', 'React'],
            'currentRole': 'Software Engineer',
            'targetRole': 'Senior Software Engineer',
            'careerStage': 'professional'
        }

    @patch('bedrock_integration.bedrock_runtime')
    def test_analyze_resume_structure(self, mock_bedrock):
        """Test resume analysis returns correct structure"""
        # Mock Bedrock response
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps({
                    'atsScore': 85,
                    'formatScore': 90,
                    'contentScore': 80,
                    'keywordMatch': 75,
                    'strengths': ['Clear structure', 'Good formatting'],
                    'weaknesses': ['Missing keywords', 'Needs metrics'],
                    'suggestions': ['Add achievements', 'Include certifications']
                })
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        # Test
        result = analyze_resume(self.sample_resume)
        
        # Assertions
        self.assertIsInstance(result, dict)
        self.assertIn('atsScore', result)
        self.assertIn('formatScore', result)
        self.assertIn('contentScore', result)
        self.assertIn('strengths', result)
        self.assertIn('weaknesses', result)
        self.assertIn('suggestions', result)
        
        self.assertIsInstance(result['strengths'], list)
        self.assertIsInstance(result['weaknesses'], list)
        self.assertIsInstance(result['suggestions'], list)

    @patch('bedrock_integration.bedrock_runtime')
    def test_tailor_resume_for_job(self, mock_bedrock):
        """Test resume tailoring functionality"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps({
                    'suggestions': ['Highlight AWS experience', 'Add leadership examples'],
                    'keywords_to_add': ['Python', 'AWS', 'Leadership'],
                    'skills_to_highlight': ['Python', 'System Design']
                })
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        result = tailor_resume_for_job(self.sample_resume, self.sample_job_description)
        
        self.assertIsInstance(result, dict)
        self.assertIn('suggestions', result)
        self.assertIn('keywords_to_add', result)
        self.assertIn('skills_to_highlight', result)

    @patch('bedrock_integration.bedrock_runtime')
    def test_generate_career_roadmap(self, mock_bedrock):
        """Test career roadmap generation"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps({
                    'timeline': '18-24 months',
                    'requiredSkills': [
                        {
                            'skill': 'System Design',
                            'currentLevel': 50,
                            'requiredLevel': 85,
                            'priority': 'high',
                            'resources': ['Course A', 'Book B']
                        }
                    ],
                    'milestones': [
                        {
                            'title': 'Get AWS Certification',
                            'description': 'Complete AWS Solutions Architect',
                            'timeframe': '3 months',
                            'actionItems': ['Study guide', 'Practice exams']
                        }
                    ],
                    'certifications': ['AWS Solutions Architect'],
                    'experiences': ['Lead a project', 'Mentor juniors']
                })
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        result = generate_career_roadmap(
            'Software Engineer',
            'Senior Software Engineer',
            ['Python', 'AWS']
        )
        
        self.assertIsInstance(result, dict)
        self.assertIn('timeline', result)
        self.assertIn('requiredSkills', result)
        self.assertIn('milestones', result)

    @patch('bedrock_integration.bedrock_runtime')
    def test_get_market_insights(self, mock_bedrock):
        """Test market insights generation"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps({
                    'demandLevel': 'high',
                    'averageSalary': 130000,
                    'growthTrend': '15%',
                    'topCompaniesHiring': ['Amazon', 'Google', 'Microsoft'],
                    'inDemandSkills': ['Python', 'AWS', 'Kubernetes'],
                    'insights': [
                        'Strong demand in tech sector',
                        'Remote positions increasing'
                    ]
                })
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        result = get_market_insights('Software Engineer', 'San Francisco')
        
        self.assertIsInstance(result, dict)
        self.assertIn('demandLevel', result)
        self.assertIn('averageSalary', result)
        self.assertIn('growthTrend', result)

    @patch('bedrock_integration.bedrock_runtime')
    def test_generate_interview_questions(self, mock_bedrock):
        """Test interview questions generation"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps([
                    'Tell me about your Python experience',
                    'Describe a system you designed',
                    'How do you handle technical debt?'
                ])
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        result = generate_interview_questions(self.sample_job_description)
        
        self.assertIsInstance(result, list)
        self.assertGreater(len(result), 0)

    @patch('bedrock_integration.bedrock_runtime')
    def test_analyze_email_for_interview(self, mock_bedrock):
        """Test email analysis for interview detection"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': json.dumps({
                    'isInterview': True,
                    'confidence': 95,
                    'interviewDetails': {
                        'date': '2025-10-25',
                        'time': '2:00 PM',
                        'location': 'Virtual',
                        'interviewType': 'video',
                        'company': 'TechCorp'
                    },
                    'suggestedAction': 'Add to calendar and prepare'
                })
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        email_content = """
        Dear Candidate,
        
        We would like to invite you for a video interview on October 25th at 2:00 PM.
        Please join via the Zoom link below.
        
        Best regards,
        TechCorp Recruiting
        """
        
        result = analyze_email_for_interview(email_content)
        
        self.assertIsInstance(result, dict)
        self.assertIn('isInterview', result)
        self.assertIn('confidence', result)
        self.assertTrue(result['isInterview'])

    def test_error_handling(self):
        """Test error handling in Bedrock integration"""
        with patch('bedrock_integration.bedrock_runtime') as mock_bedrock:
            # Simulate API error
            mock_bedrock.invoke_model.side_effect = Exception('API Error')
            
            with self.assertRaises(Exception):
                analyze_resume(self.sample_resume)


class TestJobScoring(unittest.TestCase):
    """Test job compatibility scoring"""

    @patch('bedrock_integration.bedrock_runtime')
    def test_calculate_job_score_range(self, mock_bedrock):
        """Test job score is within valid range"""
        mock_response = {
            'body': MagicMock()
        }
        mock_response['body'].read.return_value = json.dumps({
            'content': [{
                'text': '85'
            }]
        }).encode()
        
        mock_bedrock.invoke_model.return_value = mock_response
        
        score = calculate_job_score('user-1', 'job-1')
        
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 100)
        self.assertIsInstance(score, int)


def run_tests():
    """Run all tests"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestBedrockIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestJobScoring))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
