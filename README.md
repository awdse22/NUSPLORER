# NUSPLORER

## Installation instructions for reviewers

### Setting up Android Studio 

1. Download and install Android studio. You may leave the settings at default.

2. After launching android studio, there should be a window 'Welcome to Android Studio' without any projects.
Select `More Actions` > `Virtual Device Manager`.

3. There should be a virtual device present, click the play button to run the emulator.
Some time will be needed the first time you run the emulator, wait for it to show the Home Screen.

If there is no virtual device present, you can create a virtual device by pressing the `+` button.
Select `Pixel 3a`, then `Next`. Download the UpsideDownCake API level 34 system image and select it.
Click `Next` > `Finish`.

### Running the app
Make sure you have the android emulator open.
Download the [APK](https://drive.google.com/file/d/1zMpya4dwKzHNVIjhVnZWP97y4mDFMsjY/view?usp=sharing) .

Locate the downloaded file (it's probably in your downloads folder), drag and drop it on the android emulator.
This should enable the android emulator to start installing the apk.

If the app requires you to update google play services:
1. Under 'More Actions' in Android Studio, select SDK Manager.
2. Look for the SDK Tools tab, check the 'Google Play services' packages and click Apply to download the package.
3. After downloading, select Finish > Apply > OK and restart the android emulator.

## For Developers
Make sure you have npm installed.
Install dependencies for the project by running (in the directory)
```
npm install
```

### Running the app

Ensure that the android emulator is running.

For FrontEnd, run (in main directory)
```
npx expo start
```
You will be given a few options, press `a` to run the app on the android emulator.
(The first time you run this, this will prompt the emulator to download expo go app)

If the app requires you to update google play services:
1. Under 'More Actions' in Android Studio, select SDK Manager.
2. Look for the SDK Tools tab, check the 'Google Play services' packages and click Apply to download the package.
3. After downloading, select Finish > Apply > OK and restart the android emulator.

## Project Overview
### Proposed Level of Achievement:
Project Gemini
### Problem Motivation:
To assist people in navigating the campus more effectively, as first-time students often find themselves lost. Although platforms like NUS Mods provide maps to certain locations, many areas remain unmapped and direct routes, including how to get certain rooms within buildings and walking paths on campus, are not clearly provided.
### Target Audience:
Students, visitors…
### Aim:
To create a campus navigation system for outdoor use and forum for indoor locations, to help people reach specific destinations efficiently, including newly opened areas.
### User Stories:
1. As a user I want to be able to easily access a map of the campus.
2. As a user I want to be able to find my destination and be given a fast route from my location to my destination.
3. As a student having various classes on certain days, I want to be able to find and get data of the rooms of my class. 
4. As a student looking for the classrooms for the first time, I want to be able to know what the locations or entrances to those rooms look like and if possible, find maps to those rooms.
5. As a user, I want to share relevant information and my experience finding a newly opened area so that more people can benefit from it.
6. As a user, I want to help contribute to the student community by upvoting accurate data and I want to find data which have been deemed credible by community votes.
7. As a user, I want to be able to avoid viewing irrelevant or inappropriate data by reporting them.
8. As a student needing to keep track of my class locations, I want to bookmark these places.
9. As a user I want to have my bookmarks and data saved and be able to access it through my devices.
10. As a user, I want to retrieve the most updated information about each room and their respective areas or help to maintain them.

### Features
1. Feature 1 (core): A map with available buildings, faculties, and facilities.
2. Feature 2 (core): A user authentication system so users can have their bookmarks or data saved and upload data.
3. Feature 3 (core): An accurate and updated navigation system for the outside the entire campus, providing routes to various destinations (e.g., faculties, rooms available under nusmods-venues).
4. Feature 4 (core): An indoor wayfinding forum that provides a comprehensive and up-to-date resource for navigating indoor areas. Users can create and read posts through this community-driven approach.
5. Feature 5 (core): A page for users to find maps or photos of their indoor destinations, or upload them to help other future users.
6. Feature 6 (extension): A feature associated with the forum feature that allows users to upvote and downvote posts. Posts with more upvotes will be displayed first.
7. Feature 7 (extension): Users may report various content so they can avoid seeing irrelevant data. Multiple reports from different users of a data for the same reason will subject the data to deletion.
8. Feature 8 (extension): A feature allowing users to bookmark locations for their various activities or based on their schedules/timetables. 
### Scope of Project:
The Android App provides a comprehensive campus navigation system at NUS, featuring outdoor maps, outdoor navigation system, indoor navigation forum, and bookmarking capabilities.
#### User Authentication: (Milestone 1)
![image](https://github.com/user-attachments/assets/9d19f9c1-48b2-4fab-928c-25b7b78a022e)
![image](https://github.com/user-attachments/assets/e1ba716f-38d9-4d3e-9079-891e51497ea0)
![image](https://github.com/user-attachments/assets/d81aadf3-8cb2-4986-a58b-e5f7925bc759)
#### Outdoor Map: (Milestone 2)
After login successfully, users can automatically see the map section displayed on the screen. Here users can enter the location they want to find in the search bar, which features predictive text input to assist users in finding their desired location. Upon clicking "search," the map will automatically navigate to the searched location. Users can also zoom in and out to adjust the size.
![image](https://github.com/user-attachments/assets/ce250081-4657-47e0-8ac8-f60089dd4386)
#### Outdoor navigation system: (Milestone 2)
Users can input their current location and desired destination in the navigation feature. By integrating coordinate information from NUSMods-Venues about room locations, users can input not only locations existing in Google Maps (such as Biz2, Kent Ridge MRT), but also can directly enter room numbers (like AS1-0201, S17-0405) for navigation. For two waypoints, users can choose between driving, bicycling, transit, and walking to find the best route. After selecting driving, bicycling, or walking, the map interface will simulate the specific route planning. Clicking the "Next" button allows users to view the next navigation step. If "Next" is clicked accidentally, users can click "Prev" to return to the previous navigation step.For transit, due to limited free resources provided by Google Maps API, clicking transit will automatically open the Google Maps web interface in the browser for public transit suggestions. Additionally, the outdoor navigation system developed here supports multiple waypoints for route planning. Specifically, users can add waypoints using "add destination below" and remove waypoints as needed. However, for transit, Google Maps itself does not support providing public transit routes with multiple waypoints, which will display a warning. For other modes of transportation, route planning can proceed as normal.
![image](https://github.com/user-attachments/assets/9521df0e-f1ca-4f40-8517-9527a5de7017)



#### Problems encountered
1. For the outdoor navigation function, fully implementing the real-time navigation process is challenging due to its reliance on an emulator and the limitations of available free resources online. Therefore, we have modified this feature to focus on route planning, which can display a simulated route in written form. This allows users to use it as a reference.
2. For the outdoor navigation function, given the limitations of available free resources online, the "add stops" function is not supported for public transportation and cannot be properly displayed in the app. Therefore, we have modified this feature to include a link that opens "maps" on the phone when users tap “transit”, where more details are provided.
3. Previously, we planned to develop an indoor navigation system using official floor plans and have maps displayed along with pathfinding for users. However, due to the complicated process of obtaining floor plans from school and the immature indoor navigation tools available online, we have decided to take a more community-driven approach and switched this feature to a forum-based on indoor navigation. This forum allows users to share and read relevant information about different rooms to navigate more efficiently.
a. Some advantages include less requirement for overall maintenance as indoor maps or floor plans of various buildings may change over time. Having a community-driven approach lets users update real-time information without the need to re-map areas which would have been required of the old approach. It is also not very feasible for us to map the indoor areas of the entire campus within such a short time.
b. However, this new approach would require users to contribute data for the application to be useful to a wider audience.
4. Previously, we used PgAdmin4 for backend development. However, upon deciding to implement a forum feature, we found that MongoDB would be more suitable as it allows us to scale more horizontally and more easily implement new features as we need. As a result, we switched our database to MongoDB.
#### Plan for milestone 3
1. Extension feature of indoor navigation forum
Including upvote, downvote, and report bad data. This will be what we plan to have our application use in order to determine more accurate or “good” data. Data that has been highly upvoted will be displayed first to ensure users find accurate data easily. On the other hand, data that is reported a large amount of times may be subjected to removal. This ensures that the data stays updated and accurate based on the community’s input.
2. Email verification, forget/change password
3. bookmark feature to personalise your campus experience: People can bookmark their frequently visited locations based on their schedules. Users may bookmark rooms or certain posts.
4. Improve content of posts, user settings and other quality of life features.
Instead of just posting information about a room, users may add “Directions” info where they specify a starting point and they may write a navigation/procedure to go to certain rooms from the starting point using landmarks and photos. We’re planning to go for this design since there are many possible ways to go to a specific room with many possible starting points. Users may be able to search for a starting point and if directions to the room have been uploaded by other users, they may easily navigate to their desired destination.
### Tech Stack
1. React Native (FrontEnd)
2. NodeJS (BackEnd)
3. Google Maps API (Map API)
4. MongoDB (Database for user information)
### How are we different from similar platforms?
1. Nusmods: The application lacks location information for all classrooms, particularly the newly constructed ones. Additionally, it does not have a mapping function to help students navigate to specific places.
2. Google map: The application only guides students to specific buildings or faculties but does not provide information on the classrooms and how to reach them.
### SWE Practices:
1. Version Control and Collaboration: practice pull and push requests, make use of multiple branches and commit proper messages via github.
2. Security Practices: use tokens for authentication to keep the database secure.
3. API Integration: leverage existing, well-tested functionalities.
### Diagram

### Timeline
#### [current progress]
1) 3rd week of May: Read up on relevant materials (e.g. React Native, Google maps API)
2) 4th week of May: Implement basic FrontEnd and UI
3) 5th week of May: Integrate basic features (e.g. basic authentication, account registration and map API) and connect FrontEnd to BackEnd and PostgreSQL)
4) 1st week of June: Update and improve user authentication to keep track of user session and implement the forget password feature/email verification feature. Improve map UI and search function.
5) 2nd week of June: Implement Navigation UI and integrate the outdoor navigation system. 
6) 3rd week of June: Data collection for indoor maps, creating sample floor plans and trying to develop an indoor navigation system.
7) 4th week of June: Switch to indoor navigation forum and implement this feature.
#### [proposed]
9) 1st week of July: Implement extension features of the forum.
10) 2nd week of July: Finish up overall navigation UI and integrate both outdoor and indoor systems.
11) 3rd week of July: Implement bookmark section.
12) 4th week of July: Overall testing and refinements.
### Design (UI may be improved):
#### -Login page
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/9c8aa351-08a3-4b9e-90f2-1fbb84b6c3fe)
#### -Map section
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/e340662e-4a17-4e41-a3f8-89345ec03498)
Users can enter the location they want to find in the search bar, which features predictive text input to assist users in finding their desired location. Upon clicking "search," the map will automatically navigate to the searched location. Users can also zoom in and out to adjust the size.
#### -Navigation section
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/cdd1eeb0-1228-4c6a-8f0b-907dbcc99429)
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/29dfac24-0807-47df-a47d-224068712c41)

Users can input their current location and desired destination in the navigation feature. By integrating coordinate information from NUSMods-Venues about room locations, users can input not only locations existing in Google Maps (such as Biz2, Kent Ridge MRT), but also can directly enter room numbers (like AS1-0201, S17-0405) for navigation. For two waypoints, users can choose between driving, bicycling, transit, and walking to find the best route. After selecting driving, bicycling, or walking, the map interface will simulate the specific route planning. Clicking the "Next" button allows users to view the next navigation step. If "Next" is clicked accidentally, users can click "Prev" to return to the previous navigation step.For transit, due to limited free resources provided by Google Maps API, clicking transit will automatically open the Google Maps web interface in the browser for public transit suggestions. 

Additionally, the outdoor navigation system developed here supports multiple waypoints for route planning. Specifically, users can add waypoints using "add destination below" and remove waypoints as needed. However, for transit, Google Maps itself does not support providing public transit routes with multiple waypoints, which will display a warning. For other modes of transportation, route planning can proceed as normal.
#### -Indoor section
!! Note that the data is NOT meant to reflect actual data of our campus, all room data, posts and photos were created specifically for testing !!
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/1beef191-ddbd-4d38-91ec-8c9591975980)
![image](https://github.com/awdse22/NUSPLORER/assets/169813987/79010c2c-36ca-4931-9257-bc5bcf5ecf9b)
The indoor navigation forum allows users to share and access information related to classroom locations. Specifically, users can create a room by providing a room code, building name, floor number, and room name. Once a room is created, users can click into it to view detailed information, including uploaded entrance photos, floor plans/maps, and textual information or directions.

Clicking "View" allows users to see relevant photos and information uploaded by other users, and they can also contribute by uploading photos or creating posts within the community.

Other extended features will be developed by milestone 3.



