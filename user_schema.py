from pydantic import BaseModel, EmailStr

# --------------------
# USER REGISTER
# --------------------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


# --------------------
# USER LOGIN
# --------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# --------------------
# USER RESPONSE
# --------------------
class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr


# --------------------
# TOKEN SCHEMA (FIX YOUR ERROR)
# --------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"