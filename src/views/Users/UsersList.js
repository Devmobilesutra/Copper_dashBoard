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

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userList: [],
            userListFalse: [],
            FavoriteList: [],
            activity: true,
            UserFavList: [],
            addModal: false,
            Add_userData: {
                Sr_No: '',
                User_name: '',
                mobile_no: '',
                address: '',
                state: '',
                city: '',
                pincode: '',
                flag: false,
            },

            confirmUserModal: false,
            confirmUserModal1: false,

            confirmUserId: '',
            confirmUserId1: '',
            FavoritelistModel: false,
            columnsConfirmUser: [
                {
                    dataField: 'name',
                    text: 'Channel Partner Name',
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
                    text: 'Channel Partner Name',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'id',
                    text: 'Mobile Number',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'address',
                    text: 'Address',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'state',
                    text: 'State',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'city',
                    text: 'City',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'pincode',
                    text: 'Pin Code',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.ActionButtonViewFavourites,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.ActionButtonDeactivateUser,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                }

            ],
        };
    }

    // selectState = async (value) => {
    //     var selected_value = value.value
    //     console.log('value is:', selected_value)
    //     const { Add_userData } = this.state;
    //     Add_userData.state= selected_value;
    //     this.setState({Add_userData});
    // }


    componentDidMount() {
        firebase.firestore().collection('Users').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            this.setState({ userList: [] });
            this.setState({ userListFalse: [] });
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
            <div key={Math.random()}>
                {/* <button style={{ marginLeft: 10, backgroundColor: '#ADD8E6', width: 70, borderRadius: 10, color: 'blue' }}
                    onClick={this.confirmUser.bind(this, confirmUserId)}>
                    Confirm
                </button> */}
                <button
                    style={{ borderRadius: 4, backgroundColor: '#20A8D8', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium"
                    onClick={this.confirmUser.bind(this, confirmUserId)}
                >
                    Confirm
                </button>
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

    //deactivate user
    // Funtion for displaying 'Edit' & 'delete' buttons inside Bootstrap Grid
    ActionButtonDeactivateUser = (cell, row, rowIndex, formatExtraData) => {
        // console.log("Row Data", row);
        var confirmUserId1 = row.id;
        return (
            <p style={{ flexDirection: 'row' }} key={row.id}>
                {/* <button style={{ marginLeft: 10, backgroundColor: '#f5425a', width: 70, borderRadius: 10 }} onClick={this.deactivateUser.bind(this, confirmUserId1)}>
                    Deactivate
                </button> */}
                <button
                    style={{ borderRadius: 4, backgroundColor: '#F64846', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium"
                    onClick={this.deactivateUser.bind(this, confirmUserId1)}
                >
                    Deactivate
                </button>
            </p>
        );
    };
    deactivateUser(confirmUserId1) {
        this.setState({
            confirmUserId1: confirmUserId1,
            confirmUserModal1: !this.state.confirmUserModal1
        });
    }
    toggleconfirmUserModal1() {
        this.setState({
            confirmUserModal1: !this.state.confirmUserModal1
        });
    }
    confirmUserEntryFinal1() {
        fire.firestore().collection('Users').doc(this.state.confirmUserId1).update({
            flag: false
        })
        this.setState({
            confirmUserModal1: !this.state.confirmUserModal1,
            userListFalse: [],
            userList: [],
        });
    }
    // view favourites list of user
    ActionButtonViewFavourites = (cell, row, rowIndex, formatExtraData) => {
        // console.log("Row Data", row);
        var Id1 = row.id;
        return (
            <p style={{ flexDirection: 'row' }} key={row.id}>
                {/* <button style={{ marginLeft: 10, backgroundColor: '#ADD8E6', width: 70, borderRadius: 10 }} onClick={this.Favourites.bind(this, Id1)}>
                    View Favourites
                </button> */}
                <button
                    style={{ borderRadius: 4, backgroundColor: '#20A8D8', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium"
                    onClick={this.Favourites.bind(this, Id1)}
                >
                    View Favourites
                </button>
            </p>
        );
    };
    Favourites(Id1) {
        this.state.mobileNumber = Id1
        this.setState({ FavoriteList: [] });
        this.setState({ UserFavList: [] });
        firebase.firestore()
            .collection('Users')
            .doc(this.state.mobileNumber)
            .get()
            .then(querySnapshot => {
                console.log('User exists: ', querySnapshot.exists);
                //console.log('User: ', querySnapshot.data().FavoriteList);
                if (querySnapshot.data().FavoriteList != undefined) {
                    querySnapshot.data().FavoriteList.forEach(documentSnapshot => {
                        console.log('User ID: ', documentSnapshot);
                        this.state.FavoriteList.push(documentSnapshot);
                    });
                    this.setState({})
                }
                console.log(" list fechProduct", this.state.FavoriteList);
                for (var i = 0; i < this.state.FavoriteList.length; i++) {
                    console.log('Product exists: ', this.state.FavoriteList);
                    let name = this.state.FavoriteList[i];
                    console.log('Product name: ', name);

                    firebase.firestore()
                        .collection('Products')
                        .doc(name)
                        .get()
                        .then(documentSnapshot => {
                            console.log('Product exists: ', documentSnapshot.exists);
                            if (documentSnapshot.exists) {
                                this.state.UserFavList.push(documentSnapshot.data())
                                this.setState({})
                            }
                        }).catch(e => { console.log(e) })
                    this.setState({ activity: false });
                }
                console.log(this.state.UserFavList, 'fav')

            }).catch(error => {
                console.log(error);
            });

        this.setState({
            FavoritelistModel: !this.state.FavoritelistModel,
            FavoriteList: [],
            UserFavList: []

        });
        //    this.setState({FavoriteList:[''],UserFavList:['']})
    }

    ViewFavourites() {
        this.setState({ FavoritelistModel: !this.state.FavoritelistModel }, () => { console.log("ffff", this.state.FavoritelistModel) });

    }

    /////////////////view favourite list end/////////////////////////////////////////////////////////////////////
    AddModal() {
        console.log('AddModal');
        this.setState({ addModal: !this.state.addModal }, () => { console.log("ffff", this.state.addModal) });
    }
    Add_userData() {
        console.log("is Loading", this.state.isLoading)
        console.log("Add_userData", this.state.Add_userData);
        const { Add_userData } = this.state;
        var phone = /^[7-9][0-9]{9}$/;
        var pin = /^[0-9]{6}$/;
        if (!Add_userData.User_name) {
            alert('please Enter User name');
            this.setState({ isLoading: false });
            return
        } else if (!Add_userData.mobile_no) {
            console.log(this.state.Add_userData.mobile_no)
            alert('Please Enter Mobile number');
            this.setState({ isLoading: false });
            return
            // } else if (Add_userData.mobile_no.length!=10 ) {
            //     alert("Please Enter valid 10 digit Mobile number")
            //     this.setState({ isLoading: false });
            //     return
        } else if (!phone.test(Add_userData.mobile_no)) {
            alert("Please select valid mobile number");
            this.setState({ isLoading: false });
            return
        } else if (!Add_userData.address) {
            alert('Please enter Address');
            this.setState({ isLoading: false });
            return
        } else if (!Add_userData.state) {
            alert('Please select state');
            this.setState({ isLoading: false });
            return
        } else if (!Add_userData.city) {
            alert('Please Enter city');
            this.setState({ isLoading: false });
            return
        } else if (!Add_userData.pincode) {
            alert('Please Enter Pin-code');
            this.setState({ isLoading: false });
            return
        } else if (!pin.test(Add_userData.pincode)) {
            alert("Please select valid Pin-Code");
            this.setState({ isLoading: false });
            return
        }
        var len = this.state.userList.length
        var len1 = this.state.userListFalse.length
        for (var i = 0; i < len; i++) {
            console.log('first loop', Add_userData.mobile_no)
            console.log('first loop1', this.state.userList[i].mobileNumber)
            if (Add_userData.mobile_no == this.state.userList[i].mobileNumber) {
                alert("Channel Partner allready registerd");
                this.setState({ isLoading: false });
                return
            }
        }
        for (var i = 0; i < len1; i++) {
            console.log('second loop')
            if (Add_userData.mobile_no == this.state.userListFalse[i].mobileNumber) {
                alert("Channel Partner allready registerd");
                this.setState({ isLoading: false });
                return
            }
        }
        firebase.firestore().collection('Users').doc(this.state.Add_userData.mobile_no).set({
            // category_name: this.state.addCategoryData.category_name
            name: this.state.Add_userData.User_name,
            mobileNumber: this.state.Add_userData.mobile_no,
            address: this.state.Add_userData.address,
            state: this.state.Add_userData.state,
            city: this.state.Add_userData.city,
            pincode: this.state.Add_userData.pincode,
            flag: this.state.Add_userData.flag

        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: "Data Added Succesfully",
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

        Add_userData.User_name = ''
        Add_userData.mobile_no = ''
        Add_userData.address = ''
        Add_userData.state = ''
        Add_userData.city = ''
        Add_userData.pincode = ''
        Add_userData.flag = ''
        this.setState({
            isLoading: false,
            addModal: !this.state.addModal,
            Add_userData
        })
    }
    //Excel Upload
    filePathset(e) {
        // console.log("jjjj");
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        console.log(file);
        this.setState({ file });

    }
    async UploadExcel() {
        console.log("UploadExcel");
        var f = this.state.file;
        var name = f.name;
        let result = [];
        const reader = new FileReader();
        reader.readAsBinaryString(f);
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const binary_str = evt.target.result;
            const Workbook = XLSX.read(binary_str, { type: "binary" });
            let rowObject;
            Workbook.SheetNames.forEach(sheet => {
                rowObject = XLSX.utils.sheet_to_row_object_array(Workbook.Sheets[sheet]);
                console.log("object", rowObject);
                result.push(rowObject);
            });
            console.log("result array", result);
            this.upload_data(result);
        };
    }
    async upload_data(Array_of_Object) {
        console.log("this is row object", Array_of_Object);
        Array_of_Object[0].forEach(rowObject => {
            console.log(
                "///////////////////////",
                "\n Sr_No ", rowObject.Sr_No,
                "\nname", rowObject.User_name,
                "\nmobileNumber", rowObject.mobile_no,
                "\n address", rowObject.address,
                "\n state", rowObject.state,
                "\n city", rowObject.city,
                "\n pincode", rowObject.pincode,
            );
            var mobileNumber = rowObject.mobile_no.toString()

            firebase.firestore().collection('Users').doc(mobileNumber).set({
                name: rowObject.User_name,
                mobileNumber: rowObject.mobile_no,
                address: rowObject.address,
                state: rowObject.state,
                city: rowObject.city,
                pincode: rowObject.pincode,
                flag: this.state.Add_userData.flag
            }).then(() => {
                console.log("Data Uploaded Succefully");
            })

        });
        this.setState({ addModal: !this.state.addModal })
    }

    // search(e) {
    //     const { userList, search_val } = this.state;
    //     // this.setState({ serch_val: e.target.value });
    //     console.log("Triggered", search_val);
    //     // var found = [];
    //     // const userName_filter = userList.find(function (data, index) { if (data.name == search_val) return true })
    //     // const pinCode_filter = userList.find(function (data, index) { if (data.pincode == search_val) return true })
    //     // console.log("search result", userName_filter, pinCode_filter);
    //     var tbl = document.getElementsByClassName('userTable');
    //     console.log('tbl', tbl[0].getElementsByTagName('table'));
    // }
    render() {
        console.log(this.state.userList.length)
        /* Drop down list usin dropdonw npm*/
        // const defaultOption = '';
        // const option1= [
        //    'Andhra Pradesh',
        //    'Arunachal Pradesh',
        //   'Assam',
        //    'Bihar',
        //   'Chhattisgarh',
        //   'Goa',
        //    'Gujarat',
        //   'Haryana',
        //   'Himachal Pradesh',
        //   'Jammu and Kashmir',
        //     'Jharkhand',
        //   'Karnataka',
        //   'Kerala',
        //   'Madhya Pradesh',
        //    'Maharashtra',
        // 'Manipur',
        //    'Meghalaya',
        //    'Mizoram',
        //     'Nagaland',
        //     'Odisha',
        //   'Punjab',
        //    'Rajasthan',
        //     'Sikkim',
        //     'Tamil Nadu',
        //    'Telangana',
        //    'Tripura',
        //    'Uttarakhand',
        //     'Uttar Pradesh',
        //    'West Bengal',
        //     'Andaman and Nicobar Islands',
        //    'Chandigarh',
        //   'Dadra and Nagar Haveli',
        //   'Daman and Diu',
        //  'Delhi',
        //     'Lakshadweep',
        //     'Puducherry'
        //   ];
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
                {/*deactivate user modal */}
                <Modal isOpen={this.state.confirmUserModal1} toggle={this.toggleconfirmUserModal1.bind(this)}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={this.toggleconfirmUserModal1.bind(this)}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Deactivate User</h2>
                    </ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            {/* <Label for="activity">Do you want to confirm this user's entry</Label> */}
                            <text style={{ marginLeft: '15%', fontSize: '110%', fontWeight: '500' }}>
                                Do you want to deactivate this user's entry ?
                            </text>
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmUserEntryFinal1.bind(this)}>Deactivate</Button>
                        <Button color="secondary" onClick={this.toggleconfirmUserModal1.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {/* view favourite list of user */}
                <Modal isOpen={this.state.FavoritelistModel} toggle={this.ViewFavourites.bind(this)}
                    style={{ padding: '20px' }} centered>
                    <ModalHeader
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Favorite List</h2>
                    </ModalHeader>
                    <ModalBody >
                        {/* favourite list using container without border */}
                        {/* <Container>
                            <Row>
                                <Col><text style={{fontSize: '100%', fontWeight: '500' }}>Image</text></Col>
                                <Col><text style={{fontSize: '100%', fontWeight: '500' }}>name</text></Col>
                                <Col><text style={{fontSize: '100%', fontWeight: '500' }}>Price</text></Col>
                            </Row>
                         <br></br>
                           
                        </Container>
                    {           
                    this.state.UserFavList.map((el) => (
                    <Container>
                        <Row>
                            <Col> <img   src={el.Image_Name1} style={{width:90 ,height:70}}></img></Col>
                            <Col> <text style={{fontSize: '100%', fontWeight: '500' }}>{el.Product_Name}</text></Col>
                            <Col> <text style={{fontSize: '100%', fontWeight: '500' }}>{el.MRP}</text></Col>
                        </Row>
                        </Container>
                        ))
                      
                        } */}
                        {/* favourite list in tabular format */}

                        {/* <Table >
                            <thead>
                                <tr>
                                <th><text style={{fontSize: '100%', fontWeight: '500' }}>Image</text></th>
                                <th><text style={{fontSize: '100%', fontWeight: '500' }}>name</text></th>
                                <th><text style={{fontSize: '100%', fontWeight: '500' }}>Price</text></th>
                                </tr>
                            </thead>
                        </Table> */}
                        {
                            this.state.UserFavList.map((el) => (
                                <Table >
                                    <tbody>
                                        <tr>
                                            <td> <img src={el.Image_Name1} style={{ width: 90, height: 70 }}></img></td>
                                            <td><text style={{ fontSize: '100%', fontWeight: '500' }}>{el.Product_Name}</text></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            ))
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.ViewFavourites.bind(this)}>Cancel</Button>
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
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add New Channel Partner</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                            <FormGroup>
                                <Label for="User_Name">Channel Partner name</Label>
                                <Input type="text" name="User_Name" id="User_Name" placeholder="Enter Name"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.User_name = e.target.value;
                                        this.setState({ Add_userData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="mobile_no">Mobile No.</Label>
                                <Input type="tel" name="mobile_no" id="mobile_no" placeholder="Enter Mobile No"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.mobile_no = e.target.value;
                                        this.setState({ Add_userData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input type="text" name="address" id="address" placeholder="Enter Address"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.address = e.target.value;
                                        this.setState({ Add_userData });
                                    }} />
                            </FormGroup>

                            {/* <FormGroup>
                            <Label for="state">State</Label>
                            <Dropdown options={option1} 
                               placeholder="Select State"
                               value={defaultOption}
                              // onChange={this._onSelect}
                               onChange={this.selectState}
                               />
                           </FormGroup> */}
                            <FormGroup>
                                <Label for="state">State</Label>
                                <select type="select" name="select" id="state"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.state = e.target.value;
                                        console.log("selected value", e.target.value)
                                        this.setState({ Add_userData });
                                    }}
                                >
                                    <option value="">Select or Enter State</option>
                                    <option vlaue='Andhra Pradesh'>Andhra Pradesh</option>
                                    <option vlaue='Arunachal Pradesh'>Arunachal Pradesh</option>
                                    <option vlaue='Assam'>Assam</option>
                                    <option vlaue='Bihar'>Bihar</option>
                                    <option vlaue='Chhattisgarh'>Chhattisgarh</option>
                                    <option vlaue='Goa'>Goa</option>
                                    <option vlaue='Gujarat'>Gujarat</option>
                                    <option vlaue='Haryana'>Haryana</option>
                                    <option vlaue='Himachal Pradesh'>Himachal Pradesh</option>
                                    <option vlaue='Jammu and Kashmir'>Jammu and Kashmir</option>
                                    <option vlaue='Jharkhand'>Jharkhand</option>
                                    <option vlaue='Karnataka'>Karnataka</option>
                                    <option vlaue='Kerala'>Kerala</option>
                                    <option vlaue='Madhya Pradesh'>Madhya Pradesh</option>
                                    <option vlaue='Maharashtra'>Maharashtra</option>
                                    <option vlaue='Manipur'>Manipur</option>
                                    <option vlaue='Meghalaya'>Meghalaya</option>
                                    <option vlaue='Mizoram'>Mizoram</option>
                                    <option vlaue='Nagaland'>Nagaland</option>
                                    <option vlaue='Odisha'>Odisha</option>
                                    <option vlaue='Punjab'>Punjab</option>
                                    <option vlaue='Rajasthan'>Rajasthan</option>
                                    <option vlaue='Sikkim'>Sikkim</option>
                                    <option vlaue='Tamil Nadu'>Tamil Nadu</option>
                                    <option vlaue='Telangana'>Telangana</option>
                                    <option vlaue='Tripura'>Tripura</option>
                                    <option vlaue='Uttarakhand'>Uttarakhand</option>
                                    <option vlaue='Uttar Pradesh'>Uttar Pradesh</option>
                                    <option vlaue='West Bengal'>West Bengal</option>
                                    <option vlaue='Andaman and Nicobar Islands'>Andaman and Nicobar Islands</option>
                                    <option vlaue='Chandigarh'>Chandigarh</option>
                                    <option vlaue='Dadra and Nagar Haveli'>Dadra and Nagar Haveli</option>
                                    <option vlaue='Daman and Diu'>Daman and Diu</option>
                                    <option vlaue='Delhi'>Delhi</option>
                                    <option vlaue='Lakshadweep'>Lakshadweep</option>
                                    <option vlaue='Puducherry'>Puducherry</option>
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input type="text" name="pincode" id="pincode" placeholder="Enter City"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.city = e.target.value;
                                        this.setState({ Add_userData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="pincode">Pin-Code</Label>
                                <Input type="text" name="pincode" id="pincode" placeholder="Enter Pin-Code"
                                    onChange={(e) => {
                                        const { Add_userData } = this.state;
                                        Add_userData.pincode = e.target.value;
                                        this.setState({ Add_userData });
                                    }} />
                            </FormGroup>
                            <hr></hr>
                            <Label>Or You can upload a Excel also</Label>
                            <Input
                                type="file"
                                id="file"
                                ref="fileUploader"
                                onChange={(e) => this.filePathset(e)}
                                name="Excel_File"
                                accept=".xlsx, .xls, .csv">Choose file</Input>
                            <Button color="secondary" variant="contained" onClick={() => { this.UploadExcel() }}>Upload File</Button>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.Add_userData() }}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <h1>Channel Partner List</h1>

                {/* table of new users entry without confirmation */}
                <br />

                {/* table of existed users */}
                <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                    <button style={{ borderRadius: 4, backgroundColor: '#20A8D8', color: 'white', padding: 7, textAlign: 'center', display: 'inline-block' }} color="primary" size="medium" onClick={() => { this.AddModal(); }}>
                        Add new Channel Partner
                    </button>
                </div>
                {'\n\n'}
                {/* <div>
                    <input type='text' value={this.state.search_val} placeholder="Find Users" onChange={(e) => { this.setState({ search_val: e.target.value }) }} />
                    <button style={{ backgroundColor: '#FFC300', height: 40, width: 100, borderRadius: 17 }} onClick={() => { this.search() }}>Search</button>
                    &nbsp;&nbsp;&nbsp;
                    <button style={{ backgroundColor: '#B87333', height: 40, width: 100, borderRadius: 17 }} onClick={() => { this.search() }}>Clear</button>
                    <hr />
                </div> */}
                {/* <ToolkitProvider
                    keyField="id"
                    data={this.state.userList}
                    columns={this.state.columnsUser}
                    search
                >
                    {
                        props => (
                            <div>
                                <h3>Input something at below input field:</h3>
                                <SearchBar {...props.searchProps} />
                                <hr />
                                <BootstrapTable
                                    // noDataIndication="Table is Empty"
                                    // keyField="id"
                                    // data={this.state.userList}
                                    // columns={this.state.columnsUser}
                                    // striped
                                    // hover
                                    // condensed
                                    // loading={true}
                                    // pagination={paginationFactory(opt)}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>                 */}
                <div className="userTable">
                    <BootstrapTable
                        noDataIndication="Table is Empty"
                        filter={filterFactory()}
                        keyField="id"
                        data={this.state.userList}
                        columns={this.state.columnsUser}
                        striped
                        hover
                        condensed
                        loading={true}
                        pagination={paginationFactory(opt)}
                    />
                </div>

                <h2>Please Confirm Channel Partner's Entry</h2>
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
            </div>
        );
    }
}
