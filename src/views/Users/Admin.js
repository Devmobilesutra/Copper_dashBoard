import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import fire from '../../fire';
import { FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, Container, Row, Col, Text, Table } from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Swal from 'sweetalert2';
import XLSX from 'xlsx';
import firebase from 'firebase';
// import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const { SearchBar } = Search;

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing {from} to {to} of {size} Results
    </span>
);

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            adminList: [],
            isLoading: false,
            addModal: false,
            hidden:true,
            Add_adminData: {
                name:'',
                Username: '',
                Password: '',
                C_Password:'',
            },
        }
        this.toggleShow = this.toggleShow.bind(this);
        }

    componentDidMount()
    { 
    fire.firestore().collection('Users_admin').onSnapshot(data => {
        this.setState({ adminList: [] });
        data.forEach(el => {
            console.log("el", el.data())
     
                this.state.adminList.push(el.data())


        })
        console.log("user name", this.state.adminList);
    })

}

AddModal() {
    const { Add_adminData } = this.state;
        Add_adminData.name =''
        Add_adminData.Username = ''
        Add_adminData.Password = ''
        this.setState({
            Add_adminData
        })
    console.log('AddModal'); 
    this.setState({ addModal: !this.state.addModal, }, () => { console.log("ffff", this.state.addModal) });
}
  
    Add_adminData() {
      
        const { Add_adminData } = this.state;
        if (!Add_adminData.name) {
            alert('please Enter name');
            this.setState({ isLoading: false });
            return
        } 
        else if (!Add_adminData.Username) {
            alert('please Enter Username');
            this.setState({ isLoading: false });
            return
        } 
        else if (!Add_adminData.Password) {
            alert('Please Enter Password');
            this.setState({ isLoading: false });
            return
        } 
        // else if (Add_adminData.Password!==Add_adminData.C_Password) {
        //     alert('Please enter same password, confirm password not matched');
        //     this.setState({ isLoading: false });
        //     return
        // } 
        var len = this.state.adminList.length
        for (var i = 0; i < len; i++) {
            if (Add_adminData.Username == this.state.adminList[i].Username) {
                alert("Admin allready registerd");
                return
            }
        }
        firebase.firestore().collection('Users_admin').doc().set({
            // category_name: this.state.addCategoryData.category_name
            Name:this.state.Add_adminData.name,
            Username: this.state.Add_adminData.Username,
            Password: this.state.Add_adminData.Password,
        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: "Admin Added Succesfully",
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        })
            .catch(error => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    text: "Something went wrong",
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                })
            });
        Add_adminData.name=''
        Add_adminData.Username = ''
        Add_adminData.Password = ''
        this.setState({
            isLoading: false,
            addModal: !this.state.addModal,
            Add_adminData
        })
    }
    toggleShow() {
        this.setState({hidden:!this.state.hidden});
      }
    render() {
        console.log(this.state.adminList.length)
        return (

            <div>
              <Modal isOpen={this.state.addModal} toggle={() => this.AddModal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader
                        // toggle={() => this.AddModal()}
                        // style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add New Admin</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                        <FormGroup>
                        <Label for="name">Admin name</Label>
                        <Input type="text" name="Username" id="Username" placeholder="Enter Admin name"
                                    onChange={(e) => {
                                        const { Add_adminData } = this.state;
                                        Add_adminData.name = e.target.value;
                                        this.setState({ Add_adminData });
                                    }} />
                         </FormGroup>
                            <FormGroup>
                        <Label for="Username">Username</Label>
                        <Input type="text" name="Username" id="Username" placeholder="Enter Username"
                                    onChange={(e) => {
                                        const { Add_adminData } = this.state;
                                        Add_adminData.Username = e.target.value;
                                        this.setState({ Add_adminData });
                                    }} />
                         </FormGroup>
                            <FormGroup>
                        <Label for="Password">Password</Label>
                        {this.state.hidden?
                         <Input type="password" name="Password" id="Password" placeholder="Enter password"
                         onChange={(e) => {
                             const { Add_adminData } = this.state;
                             Add_adminData.Password = e.target.value;
                             this.setState({ Add_adminData });
                         }} />
                         :
                        <Input type="text" name="Password" id="Password" placeholder="Enter password"
                                    onChange={(e) => {
                                        const { Add_adminData } = this.state;
                                        Add_adminData.Password = e.target.value;
                                        this.setState({ Add_adminData });
                                    }} />
                                }
                                {/* {this.state.Add_adminData.Password?
                                  <button onClick={this.toggleShow}>Show/Hide</button>:null} */}
                       </FormGroup>
                     
                       {/* <FormGroup>
                        <Label for="Password">Confirm Password</Label>
                        <Input type="password" name="C_Password" id="C_Password" placeholder="Enter password again"
                                    onChange={(e) => {
                                        const { Add_adminData } = this.state;
                                        Add_adminData.C_Password = e.target.value;
                                        this.setState({ Add_adminData });
                                    }} />
                       </FormGroup> */}
                       </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.Add_adminData() }}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>

{/* table of new users entry without confirmation */}
<br />

{/* table of existed users */}
<div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
    <button style={{ borderRadius: 4, backgroundColor: '#20A8D8', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium" onClick={() => { this.AddModal(); }}>
        Add new Admin
    </button>
</div>
            </div>
            
        );
    }
}
