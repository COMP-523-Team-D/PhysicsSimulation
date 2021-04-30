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