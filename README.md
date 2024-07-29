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

## Project overview: 
## https://docs.google.com/document/d/1XOcAMLauap0hUdVym3BlmZrUb9W5Ia53-J1PcaqkxRs/edit?usp=sharing
## Project log: 
## https://docs.google.com/document/d/1EoQKT9ZZTKkdKZQgT9vsVGIvgeTSI4fL4S5qZLwpfSU/edit?usp=sharing
## Video: 
## https://drive.google.com/file/d/1kIA9IL68AjHzy5gcYNDUs6Y__5heHY0g/view?usp=drive_link
## Poster: 
## https://drive.google.com/file/d/1w9roUkLrq0_GuIa2zpS0QONYL81eoF7y/view?usp=drive_link
