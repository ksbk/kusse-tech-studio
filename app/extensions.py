"""Flask extensions initialization."""

import os

# Import extensions here as they're added
# from flask_sqlalchemy import SQLAlchemy
# from flask_mail import Mail
# from flask_wtf.csrf import CSRFProtect

# Initialize extensions
# db = SQLAlchemy()
# mail = Mail()
# csrf = CSRFProtect()


def init_sentry(app):
    """Initialize Sentry error tracking (production only)."""
    if not app.debug:
        sentry_dsn = os.getenv("SENTRY_DSN")
        if sentry_dsn:
            try:
                import sentry_sdk
                from sentry_sdk.integrations.flask import FlaskIntegration
                from sentry_sdk.integrations.logging import LoggingIntegration

                # Configure logging integration
                logging_integration = LoggingIntegration(
                    level=None,  # Capture records from INFO level and above
                    event_level=None,  # Send records as breadcrumbs
                )

                sentry_sdk.init(
                    dsn=sentry_dsn,
                    integrations=[
                        FlaskIntegration(transaction_style="endpoint"),
                        logging_integration,
                    ],
                    # Set traces_sample_rate to 1.0 to capture 100% of transactions
                    # We recommend adjusting this value in production
                    traces_sample_rate=float(
                        os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")
                    ),
                    profiles_sample_rate=float(
                        os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.1")
                    ),
                    # Set environment
                    environment=os.getenv("FLASK_ENV", "production"),
                    # Set release version
                    release=os.getenv("APP_VERSION", "2.0.0"),
                    # Additional configuration
                    attach_stacktrace=True,
                    send_default_pii=False,  # Don't send personally identifiable information
                )
                app.logger.info("Sentry error tracking initialized")
            except ImportError:
                app.logger.warning("Sentry SDK not installed - error tracking disabled")
            except Exception as e:
                app.logger.error(f"Sentry initialization failed: {e}")
        else:
            app.logger.debug("Sentry DSN not configured - error tracking disabled")
    else:
        app.logger.debug("Sentry error tracking disabled in debug mode")


def init_posthog(app):
    """Initialize PostHog analytics (disabled in debug mode)."""
    if not app.debug:
        try:
            import posthog

            api_key = os.getenv("POSTHOG_API_KEY")
            if api_key:
                posthog.api_key = api_key
                posthog.host = os.getenv("POSTHOG_HOST", "https://app.posthog.com")
                app.logger.info("PostHog analytics initialized")
            else:
                app.logger.warning("PostHog API key not found - analytics disabled")
        except ImportError:
            app.logger.warning("PostHog not installed - analytics disabled")
        except Exception as e:
            app.logger.error(f"PostHog initialization failed: {e}")
    else:
        app.logger.debug("PostHog analytics disabled in debug mode")


def init_extensions(app):
    """Initialize Flask extensions."""
    # db.init_app(app)
    # mail.init_app(app)
    # csrf.init_app(app)

    # Initialize error tracking and analytics
    init_sentry(app)
    init_posthog(app)
