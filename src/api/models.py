from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    is_cliente = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    is_cocina = db.Column(db.Boolean(), unique=False, nullable=False, default=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False, default=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        """
        Serialize the user object without exposing sensitive information.
        """
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "is_cliente": self.is_cliente,
            "is_cocina": self.is_cocina,
            "is_admin": self.is_admin,
        }
