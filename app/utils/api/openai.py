"""OpenAI API client for content generation and enhancement."""


import openai
from flask import current_app


class OpenAIClient:
    """OpenAI API client for content generation."""

    def __init__(self, api_key: str | None = None):
        """Initialize OpenAI client."""
        self.api_key = api_key or current_app.config.get("OPENAI_API_KEY")
        if self.api_key:
            openai.api_key = self.api_key

    def generate_project_description(
        self, project_title: str, technologies: list[str]
    ) -> str | None:
        """Generate an enhanced project description."""
        if not self.api_key:
            return None

        try:
            prompt = f"""
            Create a professional project description for a portfolio website.

            Project: {project_title}
            Technologies: {", ".join(technologies)}

            Write a compelling 2-3 sentence description that highlights:
            - The problem solved
            - Technical approach
            - Business impact

            Keep it professional and engaging for potential clients.
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional technical writer specializing in portfolio content.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=150,
                temperature=0.7,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            current_app.logger.error(f"OpenAI API error: {e}")
            return None

    def enhance_service_description(
        self, service_title: str, current_description: str
    ) -> str | None:
        """Enhance a service description."""
        if not self.api_key:
            return None

        try:
            prompt = f"""
            Enhance this service description for a professional portfolio:

            Service: {service_title}
            Current description: {current_description}

            Rewrite to be more compelling and professional while keeping the same length.
            Focus on client benefits and technical expertise.
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional copywriter specializing in technical services.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=100,
                temperature=0.6,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            current_app.logger.error(f"OpenAI API error: {e}")
            return None

    def generate_blog_post_outline(self, topic: str) -> dict | None:
        """Generate a blog post outline."""
        if not self.api_key:
            return None

        try:
            prompt = f"""
            Create a blog post outline for a technical blog about: {topic}

            Return a JSON structure with:
            - title: Engaging blog post title
            - introduction: Brief intro paragraph
            - sections: Array of section objects with title and key_points
            - conclusion: Brief conclusion

            Focus on practical, actionable content for developers.
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a technical content strategist. Return valid JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=300,
                temperature=0.7,
            )

            import json

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            current_app.logger.error(f"OpenAI blog outline error: {e}")
            return None
