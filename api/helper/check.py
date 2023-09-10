import os


def check_env(required):
    """
    Check if all required environment variables are set
    """
    for env in required:
        if not os.environ.get(env):
            raise EnvironmentError(f"Environment variable {env} is not set")
