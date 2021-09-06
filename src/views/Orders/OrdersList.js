import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
import fire from '../../fire';
import firebase from 'firebase';
import { Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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
                    filter: textFilter({
                        placeholder: 'Search by ID'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'name',
                    text: 'Customer',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search by Name'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Total_amount',
                    text: 'Amount',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search Amount'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'date',
                    text: 'Date',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search Date'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'delivery_status',
                    text: 'Delivered ?',
                    filter: textFilter({
                        placeholder: 'Search delivery status'
                    }),
                    formatter: this.deliveryStatusDropdown,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'payment_Method',
                    text: 'Payment Method',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Payment Method'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                // {
                //     dataField: 'payment_Method',
                //     text: 'Payment Method',
                //     filter: textFilter({
                //         placeholder: 'Search Payment method'
                //     }),
                //     formatter: this.paymentMethodDropdown,
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
                {
                    dataField: 'payment_status',
                    text: 'Payment Status',
                    filter: textFilter({
                        placeholder: 'Search Payment status'
                    }),
                    formatter: this.paymentStatusDropdown,
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
                {
                    dataField: "Download_Actions",
                    text: "Download Actions",
                    formatter: this.Download_ActionButtonView,
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
    // paymentMethodDropdown = (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //         <div>
    //             <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
    //                 value={row.payment_Method}
    //                 onChange={(e) => { this.payment_Method(e.target.value, row.id) }}>
    //                 <option value="">Select Option</option>
    //                 <option value="Online">Online</option>
    //                 <option value="Cash on delivery">Cash on delivery</option>
    //                 <option value="Pay later">Pay later</option>
    //             </select>
    //         </div>
    //     )
    // }
    paymentStatusDropdown = (cell, row, rowIndex, formatExtraData) => {
        console.log("delivery statusaaa", row.payment_status)
        return (
            <div>
                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                    value={row.payment_status}
                    onChange={(e) => { this.payment_Status(e.target.value, row.id) }}>
                    <option value="">Select</option>
                    <option value="Paid">Paid</option>
                    <option value="UnPaid">UnPaid</option>
                  
                  
                </select>
            </div>
        )
    }
    
    Download_ActionButtonView = (cell, row, rowIndex, formatExtraData) => {
        console.log("Actions", row.Actions);
        return (
            <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                {/* <button style={{ backgroundColor: 'red', width: 60, height: '15', borderRadius: 15 }} >
                    Edit
            </button> */}
                <Button color="primary" onClick={() => { console.log("this is print id", row.id); this.printDocument(row.id, 'view') }}>View</Button>
                {/* &nbsp;&nbsp; */}
                <Button color="danger" onClick={() => { this.printDocument(row.id, 'save') }}>Download</Button>
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
                    <option value="">Select</option>
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

    payment_Status = (val, id) => {
        console.log('action function', val, typeof (val), id);
        firebase.firestore().collection('OrderList').doc(id).update({
            payment_status: val
        })
    }

    componentDidMount() {
        fire.firestore().collection('OrderList').orderBy('orderDateFormat','desc')
        .onSnapshot(data => {
            this.setState({ orderList: [] });
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                // this.state.orderList.push({ id: el.id, ...el.data() })
                // this.setState({});
                //  console.log("order from state", this.state.orderList);

                //Customer name from users table
                let name = el.data().user_id
                console.log('name', name);

                if (name != undefined) {
                    fire.firestore().collection('Users').doc(name).get()
                        .then(documentSnapshot => {

                            //    console.log('User exists: ', documentSnapshot.exists); 
                            if (documentSnapshot.exists) {
                                this.state.orderList.push({ id: el.id, ...el.data(), ...documentSnapshot.data() })
                                this.setState({})
                            }
                        }).catch(e => { console.log(e) })
                } else {
                    this.state.orderList.push({ id: el.id, ...el.data() })
                }


            })
            console.log("user name", this.state.orderList);
        })

    }
    printDocument(selectedId, action) {
        // const { selectedId } = this.state;
        console.log("TA", this.state.TA, "selectedId", selectedId)
        if (selectedId == '' || selectedId == undefined) return;

        firebase.firestore().collection('OrderList').doc(selectedId).get().then(
            (data) => {
                console.log("Fetched data ", data.data().pdfUrl);
                if (data.data().pdfUrl !== undefined) {

                    if (action == 'save') {

                        let pdfWindow = window.open(data.data().pdfUrl);
                        // pdfWindow.document.write(
                        //     `<iframe width='100%' height='100%' src=${data.data().pdfUrl}></iframe>`
                        // )
                    }
                    if (action == 'view') {

                        // other code https://stackoverflow.com/q/62055089/11510305
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = function (event) {
                            var blob = xhr.response;
                            console.log(blob);

                            // https://stackoverflow.com/a/53173732/11510305
                            var blobURL = URL.createObjectURL(blob);
                            window.open(blobURL);
                        };
                        xhr.open('GET', data.data().pdfUrl);
                        xhr.send();
                    }
                } else {
                    alert('Sorry for inconvnience. But PDF url is not available at this moment');
                }
            }
        )

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
                        filter={ filterFactory()}
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
