import httpx
    
def getGithubToken(github_client_id: str, github_client_secret: str, code: str, redirect_uri: str):
    url = "https://github.com/login/oauth/access_token"
    params = {
        'client_id': github_client_id,
        'client_secret': github_client_secret,
        'code': code,
        'redirect_uri': redirect_uri,
    }
    headers = {
        'Accept': 'application/json', 
        "Accept-Encoding": "application/json"
    }
    # 获取github token
    github_token_res = httpx.get(url, params=params, headers=headers)
    github_token_res_json = github_token_res.json()
    return github_token_res_json

def getGithubEmail(token: str):
    url = "https://api.github.com/user/emails"
    headers = {
        'Accept': 'application/vnd.github+json', 
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    # 获取github token
    github_email_res = httpx.get(url, headers=headers)
    github_email_res_json = github_email_res.json()
    return github_email_res_json

def getGithubUserInfo(token: str):
    url = "https://api.github.com/user"
    headers = {
        'Accept': 'application/vnd.github+json', 
        "Accept-Encoding": "application/json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    # 获取github token
    github_user_info_res = httpx.get(url, headers=headers)
    github_user_info_res_json = github_user_info_res.json()
    return github_user_info_res_json