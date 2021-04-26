import React, { Component } from 'react';

class Problem extends Component {
    constructor (name) {
        this.name = name;
        this.parent = ""; // Owning assignment's identifier
        this.simulation = "";
        this.parameters = {};
        this.graphs = [];
        this.content = []; // Array of tasks
    }
}