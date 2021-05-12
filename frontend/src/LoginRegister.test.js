/* 
 * jest unit testing to make sure login screen and reigister screen work.
 * Anything not tested here will be tested manually
 * 
 * @author Molly Crown
 * Date: 5/12/21
 * */

import React from 'react';
import renderer from 'react-test-renderer';
import { LoginFormBase } from './screens/LoginScreen';
import { RegisterFormBase } from './screens/RegisterScreen';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import firebase from 'firebase/app';
import { shallow, mount, wrapper } from 'enzyme';
import { MockFirebase } from 'firebase-mock';
import 'firebase/auth'

Enzyme.configure({ adapter: new Adapter() });

const LoginScreen = require('./screens/LoginScreen');
const RegisterScreen = require('./screens/RegiterScreen');


describe('Login Test', () => {
    let wrapper;
    test('login email', () => {
        wrapper = shallow(<LoginFormBase />);
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'aaa@aaa.aaa' } });
        expect(wrapper.state('email')).toEqual('aaa@aaa.aaa');
    })

    it('login password', () => {
        wrapper = shallow(<LoginFormBase />);
        wrapper.find('#password').simulate('change', { target: { name: 'password', value: 'aaaaaaa' } });
        expect(wrapper.state('password')).toEqual('aaaaaaa');

    })

    jest.mock('firebase/app', () => {
        return {
            auth: jest.fn(),
        };
    });

    it('login check with right data', () => {
        wrapper = shallow(<LoginFormBase />);
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'aaa@aaa.aaa' } });
        expect(wrapper.state('email')).toEqual('aaa@aaa.aaa');

        wrapper.find('#password').simulate('change', { target: { name: 'password', value: 'aaaaaaa' } });
        expect(wrapper.state('password')).toEqual('aaaaaaa');

        wrapper.find('#submit').simulate('click');

        expect(wrapper.state('error')).toBe(null);

        // jest.mock('firebase/app', () => {
        //     const userCredentialMock = {
        //         user: {
        //             sendEmailVerification: jest.fn()
        //         }
        //     }
        //     return {
        //         auth: jest.fn().mockReturnThis(),
        //         currentUser: {
        //             email: 'aaa@aaa.aaa',
        //             password: 'aaaaaaa',
        //             emailVerified: true
        //         },
        //         signInWithEmailAndPassword: jest.fn(),
        //         createUserWithEmailAndPassword: jest.fn(() => userCredentialMock),
        //         sendPasswordResetEmail: jest.fn(),
        //         signOut: jest.fn(),
        //         onAuthStateChanged: jest.fn(),
        //         initializeApp: jest.fn()
        //     }
        // })
    })

    // it('login check with wrong data', () => {
    //     wrapper = shallow(<LoginFormBase />);
    //     wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'aaa@aaa.aaa' } });
    //     expect(wrapper.state('email')).toEqual('aaa@aaa.aaa');

    //     wrapper.find('#password').simulate('change', { target: { name: 'password', value: 'aaaaaab' } });
    //     expect(wrapper.state('password')).toEqual('aaaaaab');

    //     wrapper.find('#submit').simulate('click');

    //     // expect(wrapper.state('loggedIn')).toBe(false);
    // })
})
// describe('Test for isAuthenticated ()', () => {
//     afterEach(() => {
//         jest.resetAllMocks()
//     })
//     it('The API should return a boolean value telling us, If the user is authenticated to access the resources or not', () => {
//         expect(myAuthenticationPlugin.isAuthenticated()).toBe(true)
//     })

//     firebase.auth().currentUser = jest.fn(() => {
//         return {
//             email: 'aaa@aaa.aaa',
//             password: 'aaaaaaa',
//             emailVerified: false
//         }
//     })

//     it('Check false', () => {
//         expect(myAuthenticationPlugin.isAuthenticated()).toBe(false)
//     })
// })

describe('Register Test', () => {
    let wrapper;
    test('register first name', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#firstName').simulate('change', { target: { name: 'firstName', value: 'aaaaaa' } });
        expect(wrapper.state('firstName')).toEqual('aaaaaa');
    })
    test('register last name', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#lastName').simulate('change', { target: { name: 'lastName', value: 'aaaaaa' } });
        expect(wrapper.state('lastName')).toEqual('aaaaaa');
    })

    test('register email', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'aaa@aaa.aaa' } });
        expect(wrapper.state('email')).toEqual('aaa@aaa.aaa');
    })

    it('register passwordOne', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#passwordOne').simulate('change', { target: { name: 'passwordOne', value: 'aaaaaaa' } });
        expect(wrapper.state('passwordOne')).toEqual('aaaaaaa');

    })
    it('register passwordTwo', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#passwordTwo').simulate('change', { target: { name: 'passwordTwo', value: 'aaaaaaa' } });
        expect(wrapper.state('passwordTwo')).toEqual('aaaaaaa');

    })

    it('register check with right data', () => {
        wrapper = shallow(<RegisterFormBase />);
        wrapper.find('#firstName').simulate('change', { target: { name: 'firstName', value: 'aaaaaa' } });
        expect(wrapper.state('firstName')).toEqual('aaaaaa');
        wrapper.find('#lastName').simulate('change', { target: { name: 'lastName', value: 'aaaaaa' } });
        expect(wrapper.state('lastName')).toEqual('aaaaaa');
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'aaa@aaa.aaa' } });
        expect(wrapper.state('email')).toEqual('aaa@aaa.aaa');
        wrapper.find('#passwordOne').simulate('change', { target: { name: 'passwordOne', value: 'aaaaaaa' } });
        expect(wrapper.state('passwordOne')).toEqual('aaaaaaa');
        wrapper.find('#passwordTwo').simulate('change', { target: { name: 'passwordTwo', value: 'aaaaaaa' } });
        expect(wrapper.state('passwordTwo')).toEqual('aaaaaaa');

        wrapper.find('#submit').simulate('click');

        expect(wrapper.state('error')).toBe(null);
    })
})

