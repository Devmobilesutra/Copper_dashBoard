import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import fire from '../../fire';
import { FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, Text } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
    </span>
);

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            userListFalse: [],
            addModal: false,

            confirmUserModal: false,

            confirmUserId: '',

            columnsConfirmUser: [
                {
                    dataField: 'name',
                    text: 'User Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'mobileNumber',
                    text: 'Mobile Number',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'address',
                    text: 'Address',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'state',
                    text: 'State',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'city',
                    text: 'City',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'pincode',
                    text: 'Pin Code',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.actionConfirmUser,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                }
            ],

            columnsUser: [
                {
                    dataField: 'name',
                    text: 'User Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'id',
                    text: 'Mobile Number',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'address',
                    text: 'Address',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'state',
                    text: 'State',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'city',
                    text: 'City',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'pincode',
                    text: 'Pin Code',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                // {
                //     dataField: 'Actions',
                //     text: 'Actions',
                //     align: 'center',
                //     formatter: this.ActionButtons
                // },
            ],
        };
    }

    // Funtion for displaying 'Edit' & 'delete' buttons inside Bootstrap Grid
    ActionButtons = (cell, row, rowIndex, formatExtraData) => {
        // console.log("Row Data", row);
        return (
            <p style={{ flexDirection: 'row' }}>
                <button style={{ marginLeft: 10, backgroundColor: '#03fc94', width: 50, borderRadius: 10 }} onClick={() => console.log(row.id, row.user_name, row.role)} >
                    Edit
                </button>
                <button style={{ marginLeft: 10, backgroundColor: '#f5425a', width: 50, borderRadius: 10 }} onClick={() => console.log(row)}>
                    Delete
                </button>
            </p>
        );
    };
    componentDidMount() {
        fire.firestore().collection('Users').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                if (el.data().flag == false) {
                    this.state.userListFalse.push({ id: el.id, ...el.data() })

                    this.setState({})
                }
                else if (el.data().flag == true) {
                    this.state.userList.push({ id: el.id, ...el.data() })
                    this.setState({})
                }
                console.log("userList from state", this.state.userList);
                console.log("userList from state false", this.state.userListFalse);
            })
        })
    }

    // confirm user entry all functions starts here
    actionConfirmUser = (cell, row, rowIndex, formatExtraData) => {
        var confirmUserId = row.id;
        return (
            <div>
                <Button color="success" size="sm" className="mr-2"
                    onClick={this.confirmUser.bind(this, confirmUserId)}>
                    Confirm
            </Button>
            </div>
        );
    }
    confirmUser(confirmUserId) {
        this.setState({
            confirmUserId: confirmUserId,
            confirmUserModal: !this.state.confirmUserModal
        });
    }
    toggleconfirmUserModal() {
        this.setState({
            confirmUserModal: !this.state.confirmUserModal
        });
    }
    confirmUserEntryFinal() {
        fire.firestore().collection('Users').doc(this.state.confirmUserId).update({
            flag: true
        })
        this.setState({
            confirmUserModal: !this.state.confirmUserModal,
            userListFalse: [],
            userList: [],
        });
    }
    // /////confirm user entry all functions end here///////

    AddModal() {
        console.log('AddModal');
        this.setState({ addModal: !this.state.addModal }, () => { console.log("ffff", this.state.addModal) });
    }

    render() {

        const pageButtonRenderer = ({ page, active, disable, title, onPageChange }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            return (
                <Button key="id" onClick={handleClick} > {page} </Button>
            );
        };

        const options = {
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
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: '20', value: 20
            }, {
                text: 'All', value: this.state.userList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };

        return (
            <div>
                {/* Confirm user modal */}
                <Modal isOpen={this.state.confirmUserModal} toggle={this.toggleconfirmUserModal.bind(this)}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={this.toggleconfirmUserModal.bind(this)}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Please Confirm</h2>
                    </ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            {/* <Label for="activity">Do you want to confirm this user's entry</Label> */}
                            <text style={{ marginLeft: '15%', fontSize: '110%', fontWeight: '500' }}>
                                Do you want to confirm this user's entry ?
                </text>
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmUserEntryFinal.bind(this)}>Confirm</Button>
                        <Button color="secondary" onClick={this.toggleconfirmUserModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {/* Add user modal */}
                <Modal isOpen={this.state.addModal} toggle={() => this.AddModal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader
                        // toggle={() => this.AddModal()}
                        // style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add Category</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                            <FormGroup>
                                <Label for="User_Name">User name</Label>
                                <Input type="text" name="User_Name" id="User_Name" placeholder="Enter Name" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="mobile_no">Mobile No.</Label>
                                <Input type="number" name="mobile_no" id="mobile_no" placeholder="Enter Mobile No" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input type="text" name="address" id="address" placeholder="Enter Address" />
                            </FormGroup>
                            <hr></hr>
                            <Label>Or You can upload a Excel also</Label>
                            <Input
                                type="file"
                                id="file"
                                ref="fileUploader"
                                onChange={(e) => this.filePathset(e)}
                                name="Excel_File">Choose file</Input>
                            <Button color="secondary" variant="contained" onClick={() => { this.UploadExcel() }}>Upload File</Button>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.AddModal()}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <h1>User List</h1>
                <h4>To show Users(Agents) list.....and confirm their entries</h4>
                <br />

                {/* table of new users entry without confirmation */}
                <h2>Please Confirm User's Entry</h2>
                <div>
                    <BootstrapTable
                        // {...props.baseProps}
                        noDataIndication="Table is Empty"
                        keyField="id"
                        data={this.state.userListFalse}
                        columns={this.state.columnsConfirmUser}
                        striped
                        hover
                        condensed
                        loading={true}
                    />
                </div>
                <br />

                {/* table of existed users */}
                <h2>All User's List</h2>
                <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                    <Button color="primary" size="md" className="mr-2" onClick={() => { this.AddModal(); }}>
                        Add
                    </Button>
                </div>
                <div>
                    <BootstrapTable
                        noDataIndication="Table is Empty"
                        keyField="id"
                        data={this.state.userList}
                        columns={this.state.columnsUser}
                        striped
                        hover
                        condensed
                        loading={true}
                        pagination={paginationFactory(options)}
                    />
                </div>
            </div>
        );
    }
}
