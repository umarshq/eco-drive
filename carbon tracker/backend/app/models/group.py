from app import db

user_group = db.Table('user_group',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'))
)

class Group(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    total_distance = db.Column(db.Float, default=0.0)
    total_emissions = db.Column(db.Float, default=0.0)
    members = db.relationship('User', secondary=user_group, backref=db.backref('groups', lazy='dynamic'))