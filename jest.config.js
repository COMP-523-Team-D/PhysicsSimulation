module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
      ".+\\.(css|styl|less|sass|scss)$": "/Users/Molly/PhysicsSimulation/node_modules/jest-css-modules-transform",
    //   "moduleNameMapper": {
    //     "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/Users/Molly/PhysicsSimulation/__mocks__/fileMock.js",
    //     "\\.(scss|sass|css)$": "identity-obj-proxy"
    //   },
      "setupFilesAfterEnv": ["/Users/Molly/PhysicsSimulation/test-setup.js"]
    }
  };