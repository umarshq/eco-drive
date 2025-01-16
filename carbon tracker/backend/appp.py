from datetime import datetime, timedelta

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key
    title = db.Column(db.String(100), nullable=False)  # Challenge title
    description = db.Column(db.Text, nullable=False)  # Challenge description
    points = db.Column(db.Integer, nullable=False)  # Reward points for completing the challenge
    start_date = db.Column(db.DateTime, nullable=False)  # Start date of the challenge
    end_date = db.Column(db.DateTime, nullable=False)  # End date of the challenge

# Sample challenges
sample_challenges = [
    Challenge(
        title="Walk 10,000 Steps",
        description="Achieve a total of 10,000 steps in a day.",
        points=100,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=7)
    ),
    Challenge(
        title="Cycle 5 Miles",
        description="Cycle a distance of 5 miles.",
        points=150,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=7)
    ),
    Challenge(
        title="Reduce Carbon Footprint",
        description="Reduce your carbon footprint by 20% this week.",
        points=200,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=7)
    ),
    Challenge(
        title="Carpool to Work",
        description="Carpool with colleagues for a week.",
        points=250,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=7)
    ),
    Challenge(
        title="Plant a Tree",
        description="Participate in a tree planting event.",
        points=300,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=7)
    )
]

# Insert into database
with app.app_context():
    for challenge in sample_challenges:
        db.session.add(challenge)
    db.session.commit()
