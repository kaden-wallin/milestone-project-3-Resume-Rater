from models import Users, Resumes, CommentsAndRatings, UserToken
from database import session

def generate_data():
    user1 = Users(username='JeffWingman', email='jeffwinger@greendale.com')
    user2 = Users(username='T-Bone', email='tbarnes@greendale.com')

    resume1 = Resumes(resume='Lorem ipsum dolor sit amet', user=user1)
    resume2 = Resumes(resume='Consectetur adipiscing elit', user=user2)

    c_and_r1 = CommentsAndRatings(comment='Great resume!', rating=4, user=user1, resume=resume1)
    c_and_r2 = CommentsAndRatings(comment='Needs improvement', rating=2, resume=resume2)

    token1 = UserToken(token='abc123', user=user1)
    token2 = UserToken(token='xyz456', user=user2)

    session.add_all([user1, user2, resume1, resume2, c_and_r1, c_and_r2, token1, token2])
    session.commit()

generate_data()
