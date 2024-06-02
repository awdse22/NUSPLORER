# NUSPLORER

## For Developers
Make sure you have npm installed.
Install dependencies for the project by running (in the directory)
```
npm install
```

### Setting up Android Studio 

1. Download and install Android studio. You may leave the settings at default.

2. After launching android studio, there should be a window 'Welcome to Android Studio' without any projects.
Select `More Actions` > `Virtual Device Manager`.

3. There should be a virtual device present, click the play button to run the emulator.
Some time will be needed the first time you run the emulator, wait for it to show the Home Screen.

If there is no virtual device present, you can create a virtual device by pressing the `+` button.
Select `Pixel 3a`, then `Next`. Download the UpsideDownCake API level 34 system image and select it.
Click `Next` > `Finish`.

### Setting up PostgreSQL using pgadmin 

1. Download and install pgadmin. If prompted to set up a password, you can set it up to any password you want. 
(Or just set the password as `postgres`)

2. After launching pgadmin, there should be a default server (e.g. "PostgreSQL 16").
Login
If there isn't a server, you can register a server by right-clicking `Servers` > `Register` > `Server`.
Enter a name for the server. Under the connections tab, fill in "localhost" under Host name/address and the password set up when installing pgadmin. 

3. Open up the server and there should be a default database called `postgres` (Alternatively you can create another database).
Select the database and open up the Query Tool (`Alt+Shift+Q` by default, or click the icon beside 'Object Explorer').
Create a table by entering the following query and executing it:
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(16) NOT NULL CHECK (LENGTH(user_name) >= 3),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8)
);
```

Note: In the `.env` file for the repository, you may need to change the name of the variables depending on the username, password and the name of database you're using.

### Running the app

Ensure that the android emulator is running.
For BackEnd, run (in main directory)
```
npm start
```

For FrontEnd, run (in main directory)
```
npx expo start
```
You will be given a few options, press `a` to run the app on the android emulator.
(The first time you run this, this will prompt the emulator to download expo go app)

In a case where a few attempts of `npx expo start` fails to run the app, try `npx expo start -c`.

If the map requires you to update google play services:
1. Under 'More Actions' in Android Studio, select SDK Manager.
2. Look for the SDK Tools tab, check the 'Google Play services' packages and click Apply to download the package.
3. After downloading, select Finish > Apply > OK and restart the android emulator.
## Overview
### Proposed Level of Achievement:
Project Gemini
### Problem Motivation:
To assist people in navigating the campus more effectively, as first-time students often find themselves lost. Although platforms like NUS Mods provide maps to certain locations, many areas remain unmapped and direct routes, including bus routes and walking paths, are not clearly provided.
### Target Audience:
Students, visitors…
### Aim:
To create a campus navigation system, for both indoor and outdoor use, to help people reach specific destinations efficiently, including newly opened areas.
### User Stories:
1. As a user I want to be able to easily access a map of the campus.
2. As a user I want to be able to find my destination and be given a fast route from my location to my destination.
3. As a student needing to keep track of my class locations, I want to bookmark these places.
4. As a student having various classes on certain days, I want to be able to find a route between each location and get their travel times.
5. As a user I want to have my bookmarks, timetable and data saved and be able to access it through my devices.
### Features
1. Feature 1 (core): A map with available buildings, faculties, and facilities.
2. Feature 2 (core): An accurate and updated navigation system for the entire campus, providing routes to various destinations (e.g., faculties).
3. Feature 3 (core): An indoor wayfinding system containing all relevant room locations, including lifts and staircases.
4. Feature 4 (extension): A feature allowing users to bookmark locations for their various activities or based on their schedules/timetables.
5. Feature 5 (extension): Timetable feature which allows users to input their timetable and have the app create a route to class locations for the day.
6. Feature 6 (extension): I want to have my data such as bookmarked locations and timetable saved so I can access them through different mobile devices.
7. Feature 7 (optional extension): A map integrated with real-life pictures to make it more visually appealing and efficient. 
### Scope of Project:
The Android App provides a comprehensive campus navigation system at NUS, featuring both indoor and outdoor maps, real-time canteen crowd indicators, bookmarking capabilities (and integration with bus routes and real-life imagery).
#### Features to be completed by milestone 2:
1. Map section: Explore Campus with Ease
People can effortlessly locate buildings, classrooms, and more from a comprehensive view of campus facilities.
For indoor maps, the basic template for implementation should be set up and data on floor plans for accessible buildings should be collected.
2. Navigation section: Navigate with Precision
Users can easily find the fastest routes to their desired buildings within NUS.
#### Features to be completed by milestone 3: 
1.  Navigation section: Integration and navigation of both outdoor and indoor maps
Users can find routes for both outdoor and indoor linked together to reach their desired destinations.
2. Timetable section: Plan Your Day Seamlessly
Students can input their timetable and plan routes to various locations accordingly.
3. Bookmark section: Personalise Your Campus Experience
People can bookmark their frequently visited locations based on their schedules.
### Tech Stack
1. React Native (FrontEnd)
2. NodeJS (BackEnd)
3. Google Maps API (Map API)
4. PostgreSQL (Database for user information)
### How are we different from similar platforms?
1. Nusmods: The application lacks location information for all classrooms, particularly the newly constructed ones. Additionally, it does not have a mapping function to help students navigate to specific places.
2. Google map: The application only guides students to specific buildings or faculties but does not provide information on the classrooms and how to reach them.
### Plan and Design
1) 3rd week of May: Read up on relevant materials (e.g. React Native, Google maps API)
2) 4th week of May: Implement basic FrontEnd and UI
3) 5th week of May: Integrate basic features (e.g. basic authentication, account registration and map API) and connect FrontEnd to BackEnd and PostgreSQL)
4) 1st week of June: Update and improve user authentication to keep track of user session and implement the forget password feature/email verification feature. Improve map UI and search function.
5) 2nd week of June: Implement Navigation UI and integrate the outdoor navigation system. 
6) 3rd week of June: Data collection for indoor maps, creating sample floor plans and implementing indoor map UI.
7) 4th week of June: Develop the indoor wayfinding system.
8) 1st week of July: Finish up overall navigation UI and integrate both outdoor and indoor systems.
9) 2nd week of July: Implement bookmark section.
10) 3rd week of July: Develop timetable section that can let students input their timetable and find ways to different locations accordingly.
11) 4th week of July: Overall testing and refinements.

![1717335463733](https://github.com/awdse22/NUSPLORER/assets/169813987/94d77f85-1f7c-4087-8d4f-470529c89bbe)
