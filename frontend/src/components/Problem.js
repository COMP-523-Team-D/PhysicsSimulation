/**
 * This module contains the logic and state needed
 * to organize user provided values into a problem
 * structure that can then be easily communicated to
 * the Firebase database.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

class Problem {
    constructor (problemNumber) {
        this.name = `Problem ${problemNumber}`;
        this.simulation = {
            Name: "",
            Source: "",
            Parameters: []
        };
        this.parameters = {};
        this.graphs = [];
        this.questions = [];
    }

    /*
     * Convert a JS Problem object into a form suitable for database storage.
     */
    convert() {
        return({
            "Name": this.name,
            "Simulation": this.simulation,
            "Parameters": this.parameters,
            "Graphs": this.graphs,
            "Questions": this.questions
        });
    }
}

export default Problem;