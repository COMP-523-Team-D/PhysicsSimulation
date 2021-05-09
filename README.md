# UNC Physics Simulation with PhET

## Overview
UNC Physics Simulation with PhET builds on the physics simulations provided by the University of Colorado Boulder to provide students and instructors with an interface better suited for an instructional environment. This interface is designed to allow instructors to present interactive/instructional content to students alongside a PhET simulation. This repository contains the source code for the UNC Physics Simulation application, and this document provides a guide for developers to initialize the project locally.

## Getting Started
  1. Clone the repository into a local directory and navigate to `<local directory>/PhysicsSimulation/frontend` in a terminal window.
  2. Download and install node+npm and ensure that it is accessible from `<local directory>/PhysicsSimulation/frontend`.
  3. Run `npm update` to collect all of the application's dependencies.
  4. At this point, the frontend of the application has been installed, and from this point forward, you will need the Firebase Configuration settings for the              project from the current system administrator.
  6. Inside of `<local directory>/PhysicsSimulation/frontend/src/Firebase/firebase.js` you will see an empty JS object titled firebaseConfig; copy and paste the            Firebase Configuration settings into this JS object ( e.g., const firebaseConfig = { apiKey: <key>, authDomain: <domain>, etc.}; ).
  7. 

You'll need to set up a Firebase emulator to simulate the necessary backend communication. Download the Firebase CLI and follow the instructions on their website. Firebase emulators, in turn, require a recent installation of Java. You may need to uninstall and reinstall your version of Java to get this working correctly.

Once you have an emulator configured, navigate to `/PhysicsSimulation` and run `firebase emulators:start`. This will set up your backend. Then switch into `./frontend` and run `npm start`. At this point, you'll be ready to start working.

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
