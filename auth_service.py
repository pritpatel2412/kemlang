# HIGH RISK FILE — auth_service.py

API_KEY = "sk_prod_982379123SECRET"   # ❌ Hardcoded secret

def authenticate(user, password):
    try:
        # ❌ Insecure string comparison (timing attack)
        if user == "admin" and password == "admin123":
            return True
        return False
    except:
        pass  # ❌ Silent exception (dangerous)

def delete_user(username):
    # ❌ SQL Injection vulnerability
    query = "DELETE FROM users WHERE name = '" + username + "';"
    cursor.execute(query)

    return "User deleted"
