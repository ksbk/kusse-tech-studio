"""GitHub API client for repository information."""

from typing import Dict, List, Optional

import requests
from flask import current_app


class GitHubClient:
    """GitHub API client for fetching repository information."""

    def __init__(self, token: Optional[str] = None):
        """Initialize GitHub client."""
        self.token = token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "KusseTechStudio-Portfolio",
        }

        if self.token:
            self.headers["Authorization"] = f"Bearer {self.token}"

    def get_repository(self, owner: str, repo: str) -> Optional[Dict]:
        """Get repository information."""
        try:
            url = f"{self.base_url}/repos/{owner}/{repo}"
            response = requests.get(url, headers=self.headers, timeout=10)

            if response.status_code == 200:
                return response.json()
            else:
                current_app.logger.warning(f"GitHub API error: {response.status_code}")
                return None

        except requests.RequestException as e:
            current_app.logger.error(f"GitHub API request failed: {e}")
            return None

    def get_user_repositories(self, username: str) -> List[Dict]:
        """Get user's public repositories."""
        try:
            url = f"{self.base_url}/users/{username}/repos"
            response = requests.get(
                url,
                headers=self.headers,
                params={"type": "public", "sort": "updated"},
                timeout=10,
            )

            if response.status_code == 200:
                return response.json()
            else:
                current_app.logger.warning(f"GitHub API error: {response.status_code}")
                return []

        except requests.RequestException as e:
            current_app.logger.error(f"GitHub API request failed: {e}")
            return []

    def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Get repository language statistics."""
        try:
            url = f"{self.base_url}/repos/{owner}/{repo}/languages"
            response = requests.get(url, headers=self.headers, timeout=10)

            if response.status_code == 200:
                return response.json()
            else:
                return {}

        except requests.RequestException as e:
            current_app.logger.error(f"GitHub languages API request failed: {e}")
            return {}

    def get_repository_stats(self, owner: str, repo: str) -> Optional[Dict]:
        """Get repository statistics (stars, forks, etc.)."""
        repo_data = self.get_repository(owner, repo)

        if repo_data:
            return {
                "stars": repo_data.get("stargazers_count", 0),
                "forks": repo_data.get("forks_count", 0),
                "watchers": repo_data.get("watchers_count", 0),
                "issues": repo_data.get("open_issues_count", 0),
                "language": repo_data.get("language"),
                "created_at": repo_data.get("created_at"),
                "updated_at": repo_data.get("updated_at"),
                "description": repo_data.get("description"),
                "homepage": repo_data.get("homepage"),
            }

        return None
