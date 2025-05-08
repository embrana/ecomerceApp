from datetime import datetime
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
    is_waiter = db.Column(db.Boolean(), unique=False, nullable=False, default=False)

    # Relationship to orders
    orders = db.relationship("Order", backref="user", lazy=True)

     # Relationship to reserve
    reserve = db.relationship("Reserve", backref="user", lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "is_cliente": self.is_cliente,
            "is_cocina": self.is_cocina,
            "is_admin": self.is_admin,
            "is_waiter": self.is_waiter,
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=False, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(500), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    stock = db.Column(db.Integer, unique=False, nullable=False)
    image = db.Column(db.String(1500), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False, default=0)

    # Relationship to orders
    orders = db.relationship("OrderProduct", backref="ordered_product", lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "name": self.name,
            "description": self.description,
            "stock": self.stock,
            "is_active": self.is_active,
            "image": self.image,
            "price": self.price
        }

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=True)
    capacity = db.Column(db.Integer, nullable=False, default=4)
    is_occupied = db.Column(db.Boolean(), nullable=False, default=False)
    
    # Relationship to orders
    orders = db.relationship("Order", backref="table", lazy=True)
    
    def __repr__(self):
        return f'<Table {self.number} - {"Occupied" if self.is_occupied else "Free"}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "number": self.number,
            "name": self.name,
            "capacity": self.capacity,
            "is_occupied": self.is_occupied,
            "active_order": self.get_active_order(),
        }
    
    def get_active_order(self):
        active_order = Order.query.filter(
            Order.table_id == self.id,
            Order.status.in_(["Pending", "In Progress"])
        ).first()
        
        if active_order:
            # Return a simplified version to avoid recursion
            return {
                "id": active_order.id,
                "order_number": active_order.order_number,
                "status": active_order.status,
                "date": active_order.date.isoformat(),
                "is_open": active_order.is_open
            }
        return None


class OrderProduct(db.Model):
    __tablename__ = 'order_product'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    added_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationship to Product
    product = db.relationship('Product', backref='order_products', lazy=True)

    def __repr__(self):
        return f'<OrderProduct Order {self.order_id} - Product {self.product_id} - Quantity {self.quantity}>'

    def serialize(self):
        return {
            "product_id": self.product_id,
            "quantity": self.quantity,
            "name": self.product.name,  # Product name
            "description": self.product.description,  # Product description
            "price": self.product.price,  # Product price
            "image": self.product.image,  # Product image URL
            "type": self.product.type,  # Product type
            "added_at": self.added_at.isoformat(),  # When this item was added
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default="Pending")
    order_number = db.Column(db.String(100), nullable=False)
    is_open = db.Column(db.Boolean(), nullable=False, default=True)
    products = db.relationship('OrderProduct', backref='order', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Order {self.id} - Table {self.table_id} - OrderNumber {self.order_number}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "table_id": self.table_id,
            "table_number": self.table.number if self.table else None,
            "products": [product.serialize() for product in self.products],
            "date": self.date.isoformat(),
            "status": self.status,
            "order_number": self.order_number,
            "is_open": self.is_open,
        }
    
class Reserve(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Reserve {self.id} - User {self.user_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat(),
        }