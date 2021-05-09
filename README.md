# UNC Physics Simulation with PhET

## Overview
UNC Physics Simulation with PhET builds on the physics simulations provided by the University of Colorado Boulder to provide students and instructors with an interface better suited for an instructional environment. This interface is designed to allow instructors to present interactive/instructional content to students alongside a PhET simulation. This repository contains the source code for the UNC Physics Simulation application, and this document provides a guide for developers to initialize the project locally.

## Getting Started -- Installing the Application
  1. Clone the repository into a local directory and navigate to `<local directory>/PhysicsSimulation/frontend` in a terminal window.
  2. '*' Download and install node+npm and ensure that it is accessible from `<local directory>/PhysicsSimulation/frontend`.
  3. Run `npm update` to collect all of the application's dependencies.
  4. At this point, the frontend of the application has been installed, and from this point forward, you will need the Firebase Configuration settings for the              project from the current system administrator.
  6. Inside of `<local directory>/PhysicsSimulation/frontend/src/Firebase/firebase.js` you will see an empty JS object titled firebaseConfig; copy and paste the            Firebase Configuration settings into this JS object ( e.g., const firebaseConfig = { apiKey: `<key>`, authDomain: `<domain>`, etc.}; ).
  7. Navigate back to `<local directory>/PhysicsSimulation/frontend` and run `npm start` to launch the application locally.
  8. At this point, the application should successfully launch in a new browser tab/window with the url `http://localhost:3000`.
  9. The system is installed locally and you are ready to start developing.

## Getting Started -- Installing Firebase CLI
  0. This section requires access to a Google account that is linked to the UNC Physics Simulation Firebase project.
  1. To deploy an updated version of the application, first navigate to `<local directory>/PhysicsSimulation/frontend` in a terminal window.
  2. Run `npm run build` to build a production version of the application.
  3. Next, navigate to `<local directory>/PhysicsSimulation/` in a terminal window.
  5. '*' Run `npm install -g firebase-tools` to install the Firebase CLI.
  6. Run `firebase login` and follow the steps to login with a Google account that is linked to the UNC Physics Simulation Firebase project.
  7. Run `firebase init`.
  8. When presented with options in the terminal window, select `Firestore` and `Hosting` then press enter.
  9. Accept the default options presented in the terminal window by pressing enter UNTIL the beginning of "Hosting Setup"
  10. When prompted with "What do you want to use as your public directory?" type in `./frontend/build` and press enter.
  11. Next, you'll be prompted with "Configure as a single-page app (rewrite all urls to /index.html)?" type in `y` and press enter.
  12. Finally, you'll be prompted with "Set up automatic builds and deploys with GitHub?" type in `n` and press enter.
  13. At this point, Firebase initialization will be complete, and you are ready to deploy the updated version of the application to Firebase.
  14. Run `firebase deploy` to deploy the application.

'*' Any steps denoted with a '*' in the Getting Started sections likely requires administrator privileges on your local machine.

## Project Structure

Our React app code is entirely within `/frontend/src`. From here you can see the different screens in our application, and the various reusable components we have defined as well.

The PHeT simulation code is inside `/frontend/public/phetsims`. For more information about building upon the PHeT code specifically, see [their provided documentation](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md). Note that, if you want to add more simulations to this application, you'll want to read their "Master is Unstable" section in order to locate rigorously tested versions of the simulations.

We embed PHeT simulations inside iframes, so we communicate information between the frontend via (1) the `postMessage` utility, and (2) the browser tab's `sessionStorage`. Information about this communication can be found inside the projetile motion simulation code, as well as the problem screen and assignment build screen code.

## Deploying Code to Production

TODO: add deploy instructions.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
