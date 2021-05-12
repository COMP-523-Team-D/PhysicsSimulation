/**
 * This module contains the logic and state needed
 * to organize user provided values into an assignment
 * structure that can then be easily communicated to
 * the Firebase database.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

class Assignment {
    constructor () {
        this.courseName = "";
        this.creator = "";
        this.assignmentName = "";
        this.releaseDate = new Date();
        this.closeDate = new Date();
        this.problems = [];
    }

    /*
     * Convert a JS Assignment object into a form suitable for database storage.
     */
    convert() {
        let convertedProblems = [];
        
        this.problems.forEach((problem) => {
            convertedProblems.push(problem.convert());
        });

        return({
            "Course Name": this.courseName,
            "Creator": this.creator,
            "Name": this.assignmentName,
            "Release Date": this.releaseDate,
            "Close Date": this.closeDate,
            "Problems": convertedProblems
        });
    }
}

export default Assignment;