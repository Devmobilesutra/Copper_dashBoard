import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as XLSX from "xlsx";
import fire from '../fire';
// // Containers
// const DefaultLayout = React.lazy(() => import('../../containers/DefaultLayout'));
// const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


class Convert2Excel extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            file: "",
            file1: "",
        };
    }
    handleClick(e) {
        this.refs.fileUploader.click();
    }
    filePathset(e) {
        // console.log("jjjj");
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        // console.log(file);
        this.setState({ file });

    }
    readFile() {
        var f = this.state.file;
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            console.log("Data>>>" + data);// shows that excel data is read
            console.log(this.convertToJson(data)); // shows data in json format
        };
        reader.readAsBinaryString(f);
    }

    convertToJson(csv) {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            console.log(i + " " + obj.firstName);
            if (obj.data !== undefined && obj.data !== "") {
                result.push(obj);
                // this.state.file1.push(obj);
                fire.firestore().collection('users1').doc(obj.data).set({
                    firstName : obj.firstName,
                    lastname: obj.lastname
                })
            }
        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }
    render() {
        return (
            <div>
                <input
                    type="file"
                    id="file"
                    ref="fileUploader"
                    onChange={this.filePathset.bind(this)}
                />
                <button
                    onClick={() => {
                        this.readFile();
                    }}
                >
                    Read File
                </button>
            </div>
        );
    }
}

export default Convert2Excel;