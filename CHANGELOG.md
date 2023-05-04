Date:   Wed Apr 19 22:14:49 2023 -0600

    Probably should have committed earlier but currently have the most basic boilerplate down for flask and react to exchange data

Date:   Fri Apr 21 22:31:20 2023 -0600

    added a few libraries, and some pieces of the supabase db. Will be making different branches tomorrow

Date:   Sat Apr 22 14:20:12 2023 -0600

    Been messing with the database stuff. Should work but I need to figure out the migration error

Date:   Sun Apr 23 13:27:30 2023 -0600

    finally figured out the migration stuff, I might just be stupid   

Date:   Sun Apr 23 13:28:33 2023 -0600

    got rid of print message because it probably isn't the best idea to have lying around

Date:   Sun Apr 23 16:21:56 2023 -0600

    added some organization to the code and got rid of some unneeded logos and what have you

Date:   Sun Apr 23 17:09:54 2023 -0600

    made sure data can be pulled from database to backend to frontend 

Date:   Sun Apr 23 21:13:45 2023 -0600

    Merge pull request #1 from kaden-wallin/database-stuff

    Database stuff

Date:   Sun Apr 23 19:08:45 2023 -0600

    added a libraries text file into the backend to show what is currently loaded into the venv


Date:   Mon Apr 24 21:07:38 2023 -0600

    I'll figure out what's wrong eventually

Date:   Mon Apr 24 22:30:39 2023 -0600

    still working out cors issue but otherwise the login and registration features are looking good. I'll get more done tomorrow when my brain isn't fried

Date:   Tue Apr 25 15:29:59 2023 -0600

    adjusted the code so now it's a different error

Date:   Tue Apr 25 17:13:49 2023 -0600

    got registration working okay but still need to work on login stuff further

Date:   Tue Apr 25 19:47:29 2023 -0600

    Merge pull request #2 from kaden-wallin/login-and-registration    

    Login and registration

Date:   Tue Apr 25 21:53:20 2023 -0600

    forgot to make a new branch >:(

Date:   Wed Apr 26 13:48:30 2023 -0600

    decided to go with a new hashing library for passwords. Now I'm getting a different error. Still forgot to switch off of main before coding so I'll do that after this commit

Date:   Wed Apr 26 16:44:07 2023 -0600

    still on main but finally have login feature workinggit add .! Never been happier to see this same app.py file for the thousandth time  

Date:   Thu Apr 27 16:16:55 2023 -0600

    AHHHHHHH I HATE AUTHENTICATIONgit add .! I was able to get a bunch of the other stuff done but can't currently test it...

Date:   Thu Apr 27 17:39:45 2023 -0600

    got rid of current authorization code and am going to start setting up new authorization

Date:   Thu Apr 27 21:33:25 2023 -0600

    tried my best but now I am getting login errors again. I really hope I can get the code working before its due

Date:   Fri Apr 28 01:17:35 2023 -0600

    finally got login working again, authorization works okay still need to add setAuthToken function to other pages. Now working on resume 
upload not uploading the actual file but only the file name

Date:   Fri Apr 28 01:18:14 2023 -0600

    Merge pull request #3 from kaden-wallin/authorization-issues      

    Authorization issues

Date:   Fri Apr 28 01:22:19 2023 -0600

    added setAuthToken function to home component real quick before switching to different branch

Date:   Fri Apr 28 01:23:13 2023 -0600

    Merge pull request #4 from kaden-wallin/authorization-issues      

    added setAuthToken function to home component real quick before switc…

Date:   Fri Apr 28 02:06:45 2023 -0600

    starting to see weird shapes so I best get to sleep. Will continue in the morning but I'm glad I got the things working I was struggling with

Date:   Fri Apr 28 13:49:56 2023 -0600

    Not only got resume upload working but I got it to have text content too so you can search keywords. SO PSYCHED, LETSSSS GOOOO!

Date:   Fri Apr 28 14:51:49 2023 -0600

    Need a little break but currently making a download-resume route to send the file to frontend where it can be viewed, this specific route will be used as a redirect after you upload your resume

Date:   Fri Apr 28 14:53:00 2023 -0600

    Merge pull request #5 from kaden-wallin/resume-upload-issues      

    Resume upload issues

Date:   Fri Apr 28 14:55:37 2023 -0600

    starting with a blank slate for the resumeViewer component mostly 
so I can close vscode without losing this branch

Date:   Fri Apr 28 15:39:27 2023 -0600

    updated the requirements.txt because I wanna code on my laptop for a little while

Date:   Fri Apr 28 19:23:32 2023 -0600

    Got resumes to be able to be viewed but the api they library is using is no longer around so I'll need to change it, set up the ability to search keywords on the backend but haven't quite got it done on the frontend so I will need to work more on it in a little bit

Date:   Fri Apr 28 20:33:09 2023 -0600

    got the search function to work, it's pretty cool

Date:   Fri Apr 28 21:01:06 2023 -0600

    got it to not error out when you search something that doesn't exist

Date:   Fri Apr 28 22:30:45 2023 -0600

    Now you can actually see the resume but txt files can no longer be accepted as proper files. I will work on the comment and rating part 
later and hopefully be able to start styling and deploying

Date:   Sat Apr 29 00:00:53 2023 -0600

    Merge pull request #6 from kaden-wallin/resume-viewing-code       

    Resume viewing code

Date:   Sat Apr 29 01:06:23 2023 -0600

    added comments and rating system code but too tired to test them now so I'll do it tomorrow

Date:   Sat Apr 29 10:33:41 2023 -0600

    don't code when tired

Date:   Sat Apr 29 16:33:22 2023 -0600

    idk why it won't let me use css files but since it didn't this is what I had to resort to

Date:   Sat Apr 29 18:00:29 2023 -0600

    Should deploy it soon, I just need to add messages to errors and clean up code

Date:   Sat Apr 29 20:48:06 2023 -0600

    now all I need to do is clean up the code and it should be ready for deployment

Date:   Sat Apr 29 20:49:50 2023 -0600

    Merge pull request #7 from kaden-wallin/rating-and-comments       

    Rating and comments

Date:   Sat Apr 29 20:54:56 2023 -0600

    just wanted to have this branch saved

Date:   Sun Apr 30 14:17:33 2023 -0600

    cleaned up the routes code and added username section to feedback. Now I need to change the request links so it works with the deployment things I'm using and I'll be done

Date:   Sun Apr 30 15:46:20 2023 -0600

    finished changing the endpoint and will hopefully just need to change the proxy url and cors url when I deploy it to AWS Amplify        

Date:   Sun Apr 30 15:47:14 2023 -0600

    Merge pull request #8 from kaden-wallin/code-cleanup

    Code cleanup

Date:   Sun Apr 30 15:57:00 2023 -0600

    forgot to move the requirments.txt

Date:   Sun Apr 30 15:58:10 2023 -0600

    Merge pull request #9 from kaden-wallin/code-cleanup

    forgot to move the requirments.txt

Date:   Sun Apr 30 16:08:14 2023 -0600

    moved the venv and requirments.txt to backend so AWS Amplify can find it easier

Date:   Sun Apr 30 23:20:11 2023 -0600

    Update requirements.txt

Date:   Sun Apr 30 23:27:24 2023 -0600

    Update requirements.txt

    got rid of version for pywin32

Date:   Sun Apr 30 23:36:05 2023 -0600

    Hopefully getting rid of pywin doesn't break it

Date:   Sun Apr 30 23:50:56 2023 -0600

    changed the urls to the correct ones

Date:   Sun Apr 30 23:51:03 2023 -0600

    Merge branch 'main' of https://github.com/kaden-wallin/milestone-project-3-Resume-Rater

Date:   Mon May 1 01:16:35 2023 -0600

    Not using vercel so for backend so I will change back the requirements.txt

Date:   Mon May 1 01:41:13 2023 -0600

    Add or update the Azure App Service build and deployment workflow config

Date:   Mon May 1 01:42:41 2023 -0600

    Update setupProxy.js

Date:   Mon May 1 12:29:40 2023 -0600

    changed placeholder text to hopefully make it more intuitive      

Date:   Mon May 1 12:30:04 2023 -0600

    Merge branch 'main' of https://github.com/kaden-wallin/milestone-project-3-Resume-Rater

Date:   Mon May 1 16:45:13 2023 -0600

    Update setupProxy.js

Date:   Mon May 1 16:55:18 2023 -0600

    got the correct localhost url

Date:   Mon May 1 17:02:56 2023 -0600

    had to change place holder text for search bar

Date:   Mon May 1 17:13:06 2023 -0600

    Hopefully this actually deploys

Date:   Mon May 1 18:04:07 2023 -0600

    hard coded the urls until I can properly deploy the backend       

Date:   Tue May 2 14:22:47 2023 -0600

    got my backend running on pythoneverywhere so I really hope it works

Date:   Tue May 2 14:31:46 2023 -0600

    URLs changed

Date:   Tue May 2 14:46:11 2023 -0600

    oof, hail mary

Date:   Tue May 2 15:45:25 2023 -0600

    Update resumeViewer.jsx

Date:   Wed May 3 13:14:52 2023 -0600

    Update resumeViewer.jsx

    forgot the wrap the back button and no comments message in a div  

Date:   Wed May 3 14:08:00 2023 -0600

    Update resumeViewer.jsx

    gonna start replacing https with http to reduce server overload   

Date:   Wed May 3 14:08:38 2023 -0600

    Update commentsAndRatings.jsx

Date:   Wed May 3 14:09:11 2023 -0600

    Update home.jsx

Date:   Wed May 3 14:10:35 2023 -0600

    Update searchResumes.jsx

Date:   Wed May 3 14:14:55 2023 -0600

    Update home.jsx

Date:   Wed May 3 14:16:27 2023 -0600

    Update searchResumes.jsx

Date:   Wed May 3 14:27:31 2023 -0600

    Update commentsAndRatings.jsx

Date:   Wed May 3 14:28:32 2023 -0600

    Update resumeViewer.jsx

Date:   Wed May 3 15:27:50 2023 -0600

    Update resumeUploader.jsx

Date:   Wed May 3 15:31:44 2023 -0600

    Update resumeUploader.jsx

Date:   Thu May 4 01:43:27 2023 -0600

    added better styling after being wrong about my mobile view       

Date:   Thu May 4 01:44:43 2023 -0600

    Merge pull request #10 from kaden-wallin/localhost-styling        

    added better styling after being wrong about my mobile view       

Date:   Thu May 4 15:12:16 2023 -0600

    hoping this fixes the issue I am having with the server and also it should DRY up my code


Date:   Thu May 4 16:16:21 2023 -0600

    added comments to all the code so you can see what I did and my thought process was

Date:   Thu May 4 17:40:21 2023 -0600

    