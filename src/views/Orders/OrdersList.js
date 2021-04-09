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

export default class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            userListFalse: [],
            addModal: false,

            confirmUserModal: false,

            confirmUserId: '',

            columnsUser: [
                {
                    dataField: 'id',
                    text: 'Order Id',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Order_status',
                    text: 'Order_status',
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
        fire.firestore().collection('OrderList').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                    this.state.userList.push({ id: el.id, ...el.data() })
                    this.setState({});
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
                <h1>Order List</h1>
                {/* <h4>To show Users(Agents) list.....and confirm their entries</h4> */}

                {/* table of existed users */}
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
