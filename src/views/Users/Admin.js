import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
import fire from '../../fire';
import { FormGroup, Label, Input, Modal,Button, ModalHeader, ModalBody, ModalFooter, Form, Container, Row, Col, Text, Table } from 'reactstrap';

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

export default class UsersList extends Component {
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
                        Edit_adminData: {
                            Name:'',
                            Username: '',
                            Password: '',
                            C_Password:'',
                        },
                        columnsUser: [
                            {
                                dataField: 'Name',
                                text: 'Admin Name',
                                align: 'center',
                                // filter: textFilter({
                                //     // placeholder: 'Search'
                                // }),
                                headerStyle: (colum, colIndex) => {
                                    return { textAlign: 'center' };
                                },
                            },
                            {
                                dataField: 'Username',
                                text: 'Username',
                                align: 'center',
                                // filter: textFilter({
                                //     // placeholder: 'Search'
                                // }),
                                headerStyle: (colum, colIndex) => {
                                    return { textAlign: 'center' };
                                },
                            },
                            {
                                dataField: 'Password',
                                text: 'Password',
                                align: 'center',
                                // filter: textFilter({
                                //     // placeholder: 'Search'
                                // }),
                                headerStyle: (colum, colIndex) => {
                                    return { textAlign: 'center' };
                                },
                            },
                            {
                                dataField: "Actions",
                                text: "Actions",
                                formatter: this.actionEditDeleteProduct,
                                align: 'center',
                                headerStyle: () => {
                                    return { textAlign: 'center' };
                                },
                            }
            
                        ],
                    }
    }

    componentDidMount(){
    console.log("ComponentDidMount");
    firebase.firestore().collection('Users_admin').onSnapshot(data => {
        // console.log("cmpnentdid",data.size)
        let Changes = data.docChanges();
        Changes.forEach((change) => {
            if (change.type === 'added') {
                console.log("doc changes ", change.type, change.doc.id, change.doc.data());
                this.state.adminList.push({ id: change.doc.id, ...change.doc.data() })
            }
            if (change.type === 'modified') {
                console.log("doc changes modified", change.type, change.doc.data(), "ID", change.doc.id);
                const newArray = this.state.adminList.map(e => {
                    if (e.id == change.doc.id) { console.log("value", e); return { id: change.doc.id, ...change.doc.data() } }
                    else return e
                });
                this.setState({adminList: newArray }, () => console.log("state array", this.state.adminList))
            }
            if (change.type === 'removed') {
                console.log("doc changes removed", change.type);

                const eleRemovedArray = this.state.adminList.filter((e) =>
                    e.id !== change.doc.id
                )
                this.setState({adminList: eleRemovedArray })
            }
        })
        this.setState({})
    })
}

    actionEditDeleteProduct = (cell, row) => {
        console.log(row.id,row.MRP,row.Product_Name,'sanika')
       return (
           <div>
                <Button color="primary" size="md" className="mr-2"
                    onClick={() => { this.EditAdmin(row.Name,row.Username,row.Password) }}>
                    Edit
                </Button>
                &nbsp;&nbsp;
                <Button color="danger" size="md" className="mr-2"
                    onClick={() => { this.DeleteProduct(row.id) }}>
                    Delete
                </Button>
           </div>
       );
    }

     // edit product functions start here
     EditAdmin(
         Name,
         Username,
         Password
      ) {
        const { Edit_adminData} = this.state;
        Edit_adminData.Name=Name
        Edit_adminData.Username=Username
        Edit_adminData.Password=Password
        this.setState({
            Edit_adminData,
            editadminModal: !this.state.editadminModal,
        });
    }
    AddModal() {
        let { addModal } = this.state;
        this.setState({ addModal: !addModal });
    }
    toggleeditadminModal() {
        this.setState({
            editadminModal: !this.state.editadminModal,
        });
    }
    EditadminDetails() {
        const { Edit_adminData } = this.state;
        if (!Edit_adminData.Name) {
            alert('please Enter name');
            this.setState({ isLoading: false });
            return
        } 
        else if (!Edit_adminData.Username) {
            alert('please Enter Username');
            this.setState({ isLoading: false });
            return
        } 
        else if (!Edit_adminData.Password) {
            alert('Please Enter Password');
            this.setState({ isLoading: false });
            return
        } 
        var len = this.state.adminList.length
        for (var i = 0; i < len; i++) {
            if (Edit_adminData.Username == this.state.adminList[i].Username) {
                alert("Admin allready registerd");
                return
            }
        }

        firebase.firestore().collection('Users_admin').doc(Edit_adminData.Name).update({
                // Name:this.state.Edit_adminData.Name,
                Username: this.state.Edit_adminData.Username,
                Password: this.state.Edit_adminData.Password,
        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: "Data Updated Succesfully",
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            this.setState({
                editadminModal: !this.state.editadminModal,
                isLoading: !this.state.isLoading,
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
                this.setState({
                    editadminModal: !this.state.editadminModal,
                    isLoading: !this.state.isLoading,
                });
            });
    }
       // Delete Product 
       DeleteProduct(admin_ID) {
        console.log("ProductId", admin_ID);

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success ',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.setState({ isLoading: !this.state.isLoading });
                firebase.firestore().collection('Users_admin').doc(admin_ID).delete()
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            text: "deleted",
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        });
                        this.setState({ isLoading: !this.state.isLoading });
                    }).catch(error => {
                        console.log(error);
                        Swal.fire({
                            icon: 'error',
                            text: "Something went wrong",
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        })
                        this.setState({ isLoading: !this.state.isLoading });
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) { }
        })
        // this.setState({ isLoading: !this.state.isLoading });
    }

    AddModal() {
        console.log('AddModal');
        this.setState({ addModal: !this.state.addModal }, () => { console.log("ffff", this.state.addModal) });
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
        firebase.firestore().collection('Users_admin').doc(Add_adminData.name).set({
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
 
    render() {
        console.log(this.state.adminList.length)
       
        const pageButtonRenderer = ({ page, active, disable, title, onPageChange }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            return (
                <Button key="id" onClick={handleClick} > {page} </Button>
            );
        };

        const opt = {
            pageButtonRenderer,
            paginationSize: 4,
            pageStartIndex: 1,
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true,
            paginationTotalRenderer: customTotal,
            disablePageTitle: true,
            sizePerPageList: [{
                text: '50', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: '20', value: 20
            }, {
                text: 'All', value: this.state.adminList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };


        return (

            <div>
                  {/* Edit modal */}
                  <Modal isOpen={this.state.editadminModal} toggle={this.toggleeditadminModal.bind(this)}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={this.toggleeditadminModal.bind(this)}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Edit Admin Details</h2>
                    </ModalHeader>
                    <ModalBody>
                            {/* <FormGroup>
                        <Label for="name">Admin name</Label>
                        <Input type="text" name="Username" id="Username" placeholder="Enter Admin name"readonly
                         value={this.state.Edit_adminData.Name}
                                    onChange={(e) => {
                                        const { Edit_adminData } = this.state;
                                        Edit_adminData.Name = e.target.value;
                                        this.setState({Edit_adminData });
                                    }} />
                         </FormGroup> */}
                            <FormGroup>
                        <Label for="Username">Username</Label>
                        <Input type="text" name="Username" id="Username" placeholder="Enter Username"readonly
                         value={this.state.Edit_adminData.Username}
                                    onChange={(e) => {
                                        const { Edit_adminData } = this.state;
                                        Edit_adminData.Username = e.target.value;
                                        this.setState({ Edit_adminData });
                                    }} />
                         </FormGroup>
                            <FormGroup>
                        <Label for="Password">Password</Label>
                         <Input type="text" name="Password" id="Password" placeholder="Enter password"readonly
                          value={this.state.Edit_adminData.Password}
                         onChange={(e) => {
                             const { Edit_adminData } = this.state;
                             Edit_adminData.Password = e.target.value;
                             this.setState({ Edit_adminData });
                         }} />
                       </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                       
                            <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.EditadminDetails() }}>Edit</Button>
                        <Button color="secondary" onClick={this.toggleeditadminModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {/* Add Admin modal */}
                <Modal isOpen={this.state.addModal} toggle={() => this.AddModal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader
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
                         <Input type="text" name="Password" id="Password" placeholder="Enter password"
                         onChange={(e) => {
                             const { Add_adminData } = this.state;
                             Add_adminData.Password = e.target.value;
                             this.setState({ Add_adminData });
                         }} />
                         :
                        <Input type="password" name="Password" id="Password" placeholder="Enter password"
                                    onChange={(e) => {
                                        const { Add_adminData } = this.state;
                                        Add_adminData.Password = e.target.value;
                                        this.setState({ Add_adminData });
                                    }} />
                                }
                       </FormGroup>
                       </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.Add_adminData() }}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <h1>Admin List</h1>
                {/* table of existing admin */}
                <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                    <button style={{ borderRadius: 4, backgroundColor: '#20A8D8', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium" onClick={() => { this.AddModal(); }}>
                        Add new Admin
                    </button>
                </div>
                <div className="userTable">
                    <BootstrapTable
                        noDataIndication="Table is Empty"
                        filter={filterFactory()}
                        keyField="id"
                        data={this.state.adminList}
                        columns={this.state.columnsUser}
                        striped
                        hover
                        condensed
                        loading={true}
                        pagination={paginationFactory(opt)}
                    />
                </div>
            </div>
        );
    }
}
