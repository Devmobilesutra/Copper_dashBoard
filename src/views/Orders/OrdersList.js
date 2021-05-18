import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import fire from '../../fire';
import firebase from 'firebase';
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
            orderList: [],
            userId: [],
            columnsUser: [
                {
                    dataField: 'Order_id',
                    text: 'Order Id',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'name',
                    text: 'Customer',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Total_amount',
                    text: 'Amount',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'date',
                    text: 'Date',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'delivery_status',
                    text: 'Delivery Status',
                    formatter: this.deliveryStatusDropdown,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.ActionButtonView,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
            ],
        };
    }

    deliveryStatusDropdown = (cell, row, rowIndex, formatExtraData) => {
        console.log("delivery status", row.delivery_status)
        return (
            <div>
                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                    value={row.delivery_status}
                    onChange={(e) => { this.deliveryStatus(e.target.value, row.id) }}>
                    <option value="">Select Option</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
        )
    }
    ActionButtonView = (cell, row, rowIndex, formatExtraData) => {
        console.log("Actions", row.Actions);
        return (
            <div>
                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                    value={row.Actions}
                    onChange={(e) => { this.Action(e.target.value, row.id) }}>
                    <option value="">Select Option</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Packing">Packing</option>
                    <option value="Delivery">Delivery</option>
                </select>
            </div>
        )
    }
    Action = (val, id) => {
        console.log('action function', val, typeof (val), id);
        firebase.firestore().collection('OrderList').doc(id).update({
            Actions: val
        })
    }
    deliveryStatus = (val, id) => {
        console.log('action function', val, typeof (val), id);
        firebase.firestore().collection('OrderList').doc(id).update({
            delivery_status: val == 'true' ? true : false
        })
    }

    componentDidMount() {
        fire.firestore().collection('OrderList').onSnapshot(data => {
            this.setState({ orderList: [] });
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                // this.state.orderList.push({ id: el.id, ...el.data() })
                // this.setState({});
                //  console.log("order from state", this.state.orderList);

                //Customer name from users table
                let name = el.data().user_id
                console.log('name', name);

                fire.firestore().collection('Users').doc(name).get()
                    .then(documentSnapshot => {

                        //    console.log('User exists: ', documentSnapshot.exists); 
                        if (documentSnapshot.exists) {
                            this.state.orderList.push({ id: el.id, ...el.data(), ...documentSnapshot.data() })
                            this.setState({})
                        }
                    }).catch(e => { console.log(e) })

            })
            console.log("user name", this.state.orderList);
        })

    }

    render() {

        const pageButtonRenderer = ({ page, active, disable, title, onPageChange }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            return (
                <Button key={Math.random()} onClick={handleClick} > {page} </Button>
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
                text: 'All', value: this.state.orderList.length
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
                        data={this.state.orderList}
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
