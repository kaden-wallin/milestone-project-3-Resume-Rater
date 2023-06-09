# Rotten Resumes

## Description
    This application is a social media platform where you can upload resumes, comment and rate other resumes, and see what others think about your resume.

## Inspiration
    My inspiration for this app was the fact that this class is ending and I will need to start putting my resume out there to find a job. I got the idea for the title from the site Rotten Tomatoes.

## Demo
    Here are the links where the app is deployed, I had to use two different sites because my Flask backend refused to go up otherwise

### Frontend:
    [Vercel frontend](https://rotten-resumes-frontend.vercel.app/)

### Backend:
    [Pyhtonanywhere backend]https://rottenresumes.pythonanywhere.com/

## Technologies

### Frontend:
    I used Javascript's React for the framework, Vercel for the deployment, and here are a list of the libraries used.

#### Libraries:
    [frontend libraries](./frontend_libraries.md)

### Backend:
    I used Python's Flask for the framework, Pythonanywhere for the deployment, and here are a list of the libraries used.
    
#### Libraries:
    [backend libraries](./backend_libraries.md)

        Since the backend is being deployed on pythonanywhere I couldn't really use the repo, so I uploaded the backend file and that is why towards the end there aren't very many commits to the backend. I did, however, add all of the changes made in the pythonanywhere files so you can see what the code looks like in this repo.

## Issues
    Currently the main issue is that Resumes can't load in the deployed version of Rotten Resumes, this is due to the way I send files and how it's not secure but I haven't been able to crack it, I continue to revert my code anytime what I do doesn't fix the issue because I am very worried I FUBAR (or should I say foobar) it before it is graded.

    I should also explain here why I didn't use CSS files for my styling. I could not for the life of me get them to import correctly, this coupled with the fact that I had far more important things on my plate trying to deal with the errors is why it is all inline. Once I had time that I could have tried to fix it there was a whole system in place and I thought it was kind of impressive what I was able to do with inline. Also when I presented I thought that my mobile view was really good but it only was on Edge so I ended up changing it to actually look good. This is why sizes are in different metrics.

        Something to note is that in the localhosted flask application, every feature currently implemented works perfectly.

    Some things that I may or may not count as issues are the features I haven't added yet. These might not technically be issues but may detract from user experience.

## Special thanks/ extra info
    frnsys on stackoverflow answered/asked a question that took me days to try and figure out. While the methods they used were deprecated, it still helped me figure out the solution.
    [stackoverflow post](https://stackoverflow.com/questions/22752521/uwsgi-flask-sqlalchemy-and-postgres-ssl-error-decryption-failed-or-bad-reco)

    Michael Kerr was the instructor for literally half of the courses including the React and Python courses which is where I learned what I used in this project

    ChatGPT was a big help in finding libraries for my use cases and helping me with errors.

    I was able to save up enough money to be able to quit my job and do this program. That really helped me be able to get this project done and I truly believe I wouldn't have been able to otherwise.

        Another note is that I have ADHD and only May 3rd was I able to start taking medication for it so while some of my code will seem pretty chaotic, that is the reason for it. I would also be up for days at a time so there are a lot of choices I made that looking back on are pretty weird. Sorry in advance (unless you read this after seeing the code).

## Changelog
    While I don't expect anyone to read it because it is almost 400 line long, I did want to include a changelog as it showed the process in a way that is easily digestible. It shows exactly what I was thinking and working on in the commits.

    [Changelog](CHANGELOG.md)
