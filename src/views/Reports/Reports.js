import React, { Component } from 'react'
import { Alert, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, Progress, Container, Row, Col, Table } from 'reactstrap';
import firebase from 'firebase';
// import './pdf.css'
// import { Page, PDFDownloadLink, PDFViewer, ReactPDF, Document, Text, StyleSheet, View, pdf } from '@react-pdf/renderer';
import update from 'immutability-helper';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Order_details from './Order_Details';
import PdfDocument from './CommonPdf';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import imageToBase64 from 'image-to-base64/browser';
import moment from 'moment'
import { Doughnut, Bar, Line } from 'react-chartjs-2';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing {from} to {to} of {size} Results
    </span>
);

export default class Reports extends Component {
    // labels = Utils.months({ count: 7 });
    constructor() {
        super();
        this.state = {
            show: false,
            date1: '',
            date2: '',
            filteredArray: [],

            data: [],
            selectedId: '',
            LineData: {
                labels: ['1', '2', '3', '4', '5', '6'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                ],
            },
            productsList: [],
            OrderDetails: [],
            TA: '',
            img: '',
            cData: {
                labels: ["L 1", "L 2", "L 3", "L 4", "L 5"],
                datasets: [
                    {
                        label: "Label",
                        data: [100, 150, 123, 170, 162],
                        backgroundColor: ["red", "green", "yellow", "blue", "orange", "red"]
                    }
                ],
            },

            columns: [
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
                    dataField: 'user_id',
                    text: 'User Number',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search by Number'
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
                        placeholder: 'Search by Amount'
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
                        placeholder: 'Search by Date'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'delivery_status',
                    text: 'Delivered ?',
                    filter: textFilter({
                        placeholder: 'Search by delivery status'
                    }),
                    formatter: this.deliveryStatusDropdown,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                // {
                //     dataField: "Actions",
                //     text: "Actions",
                //     formatter: this.ActionButtonView,
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
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
        }
    }

    nestedData = (cell, row, rowIndex, formatExtraData) => {
        console.log("Row Data", row.product_details);
        // var confirmUserId1 = row.id;
        // row.product_details.map(df => {
        return (
            console.log("data", row.product_details)
        )
    };
    Download_ActionButtonView = (cell, row, rowIndex, formatExtraData) => {
        console.log("Actions", row.Actions);
        return (
            <div>
                {/* <button style={{ backgroundColor: 'red', width: 60, height: '15', borderRadius: 15 }} >
                    Edit
            </button> */}
                <Button color="primary" onClick={() => { console.log("this is print id", row.id); this.printDocument(row.id, 'view') }}>View</Button>
                &nbsp;&nbsp;
                <Button color="danger" onClick={() => { this.printDocument(row.id, 'save') }}>Download</Button>
            </div>
        )
    }
    async componentDidMount() {
        console.log("ComponentDidMount");
        //for order details
        firebase.firestore().collection('OrderList').onSnapshot(data => {
            this.setState({ OrderDetails: [] });
            var OList = [];
            var falseOrderlist = [];
            var TA = 0;
            data.forEach(async (el) => {
                console.log("el", el.data().Total_amount);
                OList.push({ id: el.id, ...el.data() });
                if (el.data().delivery_status === false) {
                    falseOrderlist.push({ id: el.id, ...el.data() });
                }
                TA = TA + parseInt(el.data().Total_amount);
            })
            console.log("TA", TA);
            console.log("orderDetails", this.state.OrderDetails);
            this.setState({ OrderDetails: OList, TA: TA, filteredArray: falseOrderlist });
        })
    }

    //PDF CODE
    exportPDF = async () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "My Awesome Report";
        const headers = [['Product_Name',
            // 'productList',
            'Category_Name',
            'Cost_Price',
            'Selling_Price',
            // 'Usage',
            'IsActive']];

        const data = this.state.productsList.map(elt => [elt.Product_Name,
        // elt.productList,
        elt.Category_Name, elt.Cost_Price, elt.Selling_Price, elt.IsActive]);

        let content = {
            startY: 50,
            head: headers,
            body: data,
            bodyStyles: { minCellHeight: 15 },
            columnStyles: {
                //     0: { cellWidth: 100 },
                // 1: { cellWidth: 'auto' },
                //     2: { cellWidth: 80 },
            },
            didDrawCell: (HookData) => {
                // console.log("HookData :", HookData)
                if (HookData.column.index === 1) {
                    console.log("imge data", HookData.row.raw[1]);
                    var img = document.createElement('img');
                    img = HookData.row.raw[1];
                    // img.src = HookData.row.raw[1]
                    // doc.addImage(img, 'JPEG', 30, 20); 
                }
            }
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
    }
    //Order Details PDF CODE
    orderPDF = async () => {

        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const orderDetails = new jsPDF(orientation, unit, size);

        orderDetails.setFontSize(15);

        const title = "My Awesome Report";
        const headers = [['Order_status',
            'productList',
            'Product_price',
            'Quantity',
            'Total_price',
            // 'Usage',
            'address']];

        const data = this.state.OrderDetails.map(elt => [elt.Order_status,
        elt.productList,
        elt.Product_price, elt.Quantity, elt.Total_price, elt.address]);
        console.log("nested array", this.state.OrderDetails)
        const productlist = [];
        console.log("main data", data)
        const data1 = this.state.OrderDetails.map(elt => [elt.productList.map(d => d)])
        console.log("data1", data1);
        // for (let i = 0; i < this.state.OrderDetails.length; i++) {
        //     console.log("outer", this.state.OrderDetails[i].productList)
        //     for (var j = 0; j < this.state.OrderDetails[i].productList.length; j++) {
        //         console.log("inner", this.state.OrderDetails[i].productList[j])
        //         productlist.push([this.state.OrderDetails[i].productList[j].id])
        //     }
        // }

        // const productData = productlist.map(d => { console.log("type", typeof (d)) })
        // console.log("hhh", typeof (productlist[0]));
        // const new_data = [];
        // this.state.OrderDetails.map((q, i) => {
        //     console.log("outer ", i, " ", q.productList, typeof q.productList );
        //     new_data.push(q.productList)
        // })

        // console.log("new_data", new_data)
        // let inner_array = new_data.map(w => w.map(e => [e.id]));
        // console.log("inner array", inner_array, typeof (inner_array))
        let content = {
            startY: 50,
            head: headers,
            body: data,
            bodyStyles: { minCellHeight: 15 },
            columnStyles: {
                //     0: { cellWidth: 100 },
                // 1: { cellWidth: 'auto' },
                //     2: { cellWidth: 80 },
            },
            didDrawCell: function (data) {
                if (data.column.dataKey === 1 && data.cell.section === 'body') {
                    console.log("inseide didParseCell", data.row.raw[1])
                    orderDetails.text('Total Amount', data.cell.y + 2, 40);
                    // orderDetails.autoTable({
                    //     head: [["ID"]],
                    //     body: data.row.raw[1],
                    //     startY: data.cell.y + 2,
                    //     margin: { left: data.cell.x + data.cell.padding('left') },
                    //     // tableWidth: 'wrap',
                    //     theme: 'grid',
                    //     styles: {
                    //         fontSize: 7,
                    //         cellPadding: 1,
                    //     }
                    // });
                }
            },
        };

        orderDetails.text(title, marginLeft, 40);
        orderDetails.text('Total Amount', 60, 40);

        orderDetails.autoTable(content);

        // let dataSrc = orderDetails.output("dataurlnewwindow");
        // var embed = "<embed width='100%' height='100%' src='" + dataSrc + "'/>"
        // var x = window.open();
        // x.document.open();
        // x.document.write(embed);
        // x.document.close();

        orderDetails.save("report.pdf")
    }
    async DownloadImage() {

        var url = "https://firebasestorage.googleapis.com/v0/b/copper-fe617.appspot.com/o/Images%2Fui6.png?alt=media&token=d58dbe39-f9ca-43e8-804e-3fb438034602";
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.onload = (event) => {
            var blob = xhr.response;
            console.log(event);
            console.log(blob);
            // resolve(blob);
            return blob
        };
        xhr.open('GET', url);
        xhr.send();

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
                            // console.log("Substtring", result.data.substr(0, 50));
                            // console.log("Substtring", result.data.substr(51));
                            // var pdfFile = result.data.substr(51);

                            // // Actual pdf Generation
                            // let pdfWindow = window.open("")
                            // pdfWindow.document.write(
                            //     "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                            //     encodeURI(pdfFile) + "'></iframe>"
                            // )

                            // let pdfWindow = window.open(blob);
                            // pdfWindow.document.write(
                            //     "<iframe width='100%' height='100%' src='" + encodeURI(blob) + "'></iframe>"
                            // )
                        };
                        xhr.open('GET', data.data().pdfUrl);
                        xhr.send();

                        // other code https://stackoverflow.com/q/45672939/11510305
                        // const file = new Blob([data.data().pdfUrl]);
                        // const fileURL = URL.createObjectURL(file);
                        // window.open(fileURL);

                        // Other code https://stackoverflow.com/q/62915566/11510305
                        // var element = document.createElement('a');
                        // // element.style.display = "none";
                        // element.setAttribute('href', data.data().pdfUrl)
                        // element.setAttribute("target", "_blank");
                        // document.body.appendChild(element)
                        // element.click()
                        // document.body.removeChild(element)
                    }
                } else {
                    alert('Sorry for inconvnience. But PDF url is not available at this moment');
                }
            }
        )
        // const doc = new jsPDF()
        // const order = this.state.OrderDetails.filter(data => data.id == selectedId);
        // console.log(order)
        // var header = ['Order ID', 'User ID', 'Total Items', 'Total Amount', 'Product ID']
        // var data = this.state.OrderDetails.map(obj => [obj.Order_id, obj.user_id, obj.Total_item, obj.Total_amount, obj.product_details]);
        // var header = ['Product ID', 'Product Name', 'Quantity', 'Total Amount',]
        // var data = [
        //     ['CPAHAPL1C001', 'Product 1', '5', '500'],
        //     ['CPBLMPR1C001', 'Product 2', '4', '637'],
        //     ['CPBLMPR2C003', 'Product 3', '1', '100'],
        //     ['CPBLMPR3C003', 'Product 4', '8', '450'],
        //     ['CPBMGPR3C001', 'Product 5', '3', '19300'],
        //     ['CPBSPPR1C001', 'Product 6', '5', '5100'],
        //     ['CPBSPPR2C001', 'Product 7', '5', '100']
        // ]
        // var data = []
        // data = order[0].product_details.map(obj => [obj.id, obj.product_name, obj.quantity, obj.price])
        // console.log("extracted data", data)
        // var div = document.querySelector('#LogoImg');
        // html2canvas(div).then(onfulfilled => {
        //     console.log("onfulfilled ", onfulfilled);
        //     var image = onfulfilled.toDataURL('image/png');

        //     doc.addImage(image, 'PNG', 90, 5);

        //     doc.setFontSize(20);
        //     doc.text(15, 50, "Order");
        //     doc.setFontSize(10);
        //     doc.text(150, 50, `${moment().format('dddd, MMMM Do YYYY')}`);
        //     doc.line(15, 55, 190, 55, 'S');

        //     doc.setFontSize(12);
        //     doc.text(15, 65, `Order ID :`)
        //     doc.text(45, 65, `${order[0].Order_id}`)

        //     doc.setFontSize(10);
        //     doc.text(15, 70, `Bill to`)
        //     doc.text(15, 75, `User Name :`);
        //     doc.text(45, 75, `${order[0].user_id}`);
        //     doc.text(15, 80, `User ID :`);
        //     doc.text(45, 80, `${order[0].user_id}`);
        //     doc.text(15, 85, `Address :`);
        //     doc.text(45, 85, `${order[0].address}`);


        //     doc.autoTable({
        //         head: [['Product ID', 'Product Name', 'Total Items', 'Price',]],
        //         body: data,
        //         // startY: data.cell.y + 2,
        //         margin: { top: 100, left: 40, right: 20 },
        //         tableWidth: 150,
        //         headStyles: {
        //             halign: 'center',
        //             fillColor: [105, 105, 105],
        //             textColor: [255, 255, 255]
        //         },
        //         theme: 'plain',
        //         styles: {
        //             fontSize: 8,
        //             // overflow: 'linebreak',
        //             halign: 'center',
        //             cellPadding: 3
        //         }
        //     });
        //     doc.setDrawColor(0, 0, 0);
        //     doc.line(15, 175, 190, 175, 'S');
        //     doc.text(150, 180, `Subtotal :`);
        //     doc.text(175, 180, `${order[0].Total_amount}`);
        //     // doc.text(150, 185, `SGST : 50.00`);
        //     // doc.text(150, 190, `CGST : 50.00`);
        //     doc.text(150, 185, `Total Amount :`);
        //     doc.text(175, 185, `${order[0].Total_amount}`);
        //     doc.text(15, 180, `Payment Status :`);
        //     doc.text(45, 180, `${order[0].delivery_status}`);
        //     doc.text(15, 185, `Payment Method :`);
        //     doc.text(45, 185, `${order[0].payment_Method}`);

        //     doc.text(75, 210, `Thank you for your Orders`);

        //     if (action == 'save') {
        //         doc.save();
        //     } else {
        //         doc.output('dataurlnewwindow');
        //     }
        // }, onrejected => {
        //     console.log("onrejected ", onrejected);
        //     doc.text(15, 50, "Testing Charts rejected");
        //     doc.save();
        // })
        // doc.addImage(CopperLogo, 'JPEG', 10, 200, 100, 40);


        // const Chart = document.getElementsByTagName('LogoImg');
        // console.log("Charts", Chart)
        // const canvasImage = Chart[0].toDataURL("image/jpeg", 1.0);
        // doc.setFontSize(20);
        // doc.text(15, 10, "Testing Charts");
        // doc.addImage(canvasImage, 'JPEG', 10, 200, 100, 40);

        // const LineChart = document.getElementsByTagName('canvas');
        // console.log("Charts", LineChart)
        // const canvasImage1 = LineChart[1].toDataURL("image/jpeg", 1.0);
        // doc.setFontSize(20);
        // doc.text(15, 10, "Testing Charts");
        // doc.addImage(canvasImage1, 'JPEG', 100, 200, 100, 40);

        // doc.save();

        // var element = document.getElementById('page');
        // var opt = {
        //     margin: 1,
        //     filename: 'myfile.pdf',
        //     image: { type: 'png', quality: 0.98 },
        //     html2canvas: { scale: 2 },
        //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        // };

        // // New Promise-based usage:
        // html2pdf().set(opt).from(element).save();

        // Old monolithic-style usage:
        // html2pdf(element, opt);

    }

    dateChange1(date) {
        console.log('this.dateChange', date, moment(date).format('YYYY MM DD'));
        this.setState({ date1: date })
    }
    dateChange2(date) {
        let { date1 } = this.state;
        console.log('this.dateChange', date, moment(date).format('dd/mm/yyyy'));
        let a = moment(date1), b = moment(date);
        console.log("date time", a < b, a.diff(b));

        if (date1 < date) { console.log('lesser') }
        else { console.log('not lesser'); }
        if (moment(date1) < moment(date)) {
            a = moment(date1);
            b = moment(date);
            console.log("start date is lesser", a < b);
        };
        // console.log("End Year", endDate.getFullYear(), "End Month", endDate.getMonth(), "End Day", endDate.getDate(), "\n Start Year", startDate.getFullYear(), "Start Month", startDate.getMonth(), "Start Day", startDate.getDay())
        this.setState({ date2: date })
    }
    getData() {
        const { date1, date2 } = this.state;
        if (date1 === undefined || date1 == '') {
            alert('Select Start date')
            return
        }
        if (date2 === undefined || date2 == '') {
            alert('Select end date')
            return
        }

        console.log("get data", moment(document.getElementById('startDate').value).format('DD/MM/YYYY'), moment(document.getElementById('endDate').value).format('DD/MM/YYYY'));
        // const startDate = moment(document.getElementById('startDate').value).format('DD/MM/YYYY')
        // const endDate = moment(document.getElementById('endDate').value).format('DD/MM/YYYY')
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        if (startDate > endDate) {
            console.log("start date is less than end date");
            alert('Choose greater end date');
            return
        }
        const orders = firebase.firestore().collection('OrderList')
            .where('timestamp', '>=', startDate)
            .where('timestamp', '<=', endDate)
            .get();
        orders.then(element => {
            console.log("fff", element.docs);
            let localArray = [];
            element.docs.forEach(data => {
                console.log("itereted data", data.data(), " date format ", data.data().timestamp, new Date(data.data().timestamp.seconds * 1000), moment(data.data().timestamp.seconds * 1000).format('DD/MM/YYYY'))
                localArray.push({ id: data.id, ...data.data() })
            })
            this.setState({ filteredArray: localArray, operationArray: localArray })
        })
    }
    deliveryStatus(val) {
        const { date1, date2 } = this.state;
        if (date1 === undefined || date1 == '') {
            alert('Select Start date')
            return
        }
        if (date2 === undefined || date2 == '') {
            alert('Select end date')
            return
        }
        console.log("deliveryStatus", val);
        let value = val === 'true' ? true : false;
        let result = this.state.operationArray.filter(data => data.delivery_status == value);
        console.log("result", result)
        this.setState({ filteredArray: result })
    }
    paymentStatus(val) {
        const { date1, date2 } = this.state;
        if (date1 === undefined || date1 == '') {
            alert('Select Start date')
            return
        }
        if (date2 === undefined || date2 == '') {
            alert('Select end date')
            return
        }
        console.log('paymentStatus', val);
        let value = val === 'COD' ? 'Cash on delivery' : 'online';
        let result = this.state.operationArray.filter(data => data.payment_Method == value);
        console.log("result", result);
        this.setState({ filteredArray: result });
    }
    fireFunPDF() {
        console.log('fireFunPDF');

        firebase.firestore().collection('OrderList').doc('ORDER-8830819392-26-June-2021-17-20-33').get()
            .then(data => {
                console.log("Order Data: ", data.data());
                var order = data.data();
                var finalyCoordinate;
                let num = data.data().Total_amount;
                var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
                var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

                if ((num = num.toString()).length > 9) { console.log('overflow') }
                let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
                if (!n) console.log('Total Amount is not available');
                var str = '';
                str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
                str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
                str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
                str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
                str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
                console.log("Converted Number: ", str);
                // return str;

                var doc = new jsPDF();

                doc.setFontSize(15);
                doc.text('Tax Invoice', 90, 10);
                doc.setFontSize(10);
                doc.text('(ORIGINAL FOR RECIPIENT)', 150, 10);

                doc.setFillColor(255, 255, 200);
                doc.rect(5, 15, 200, 270, 'S');
                doc.text('Pratik Copper', 7, 20);
                doc.setFontSize(9);
                // doc.text('S NO 17/3, SUKHSAGAR NAGAR, NEAR HEMA MANGAL,', 7, 24);
                // doc.text('KATRAJ, Pune, Maharashtra, 411046', 7, 28);
                // doc.text('GSTIN/UIN: 27AAJCR1260P1ZX', 7, 32);
                // doc.text('State Name : Maharashtra, Code : 27', 7, 36);
                // doc.text('CIN: U28999PN2018PTC178676', 7, 40);
                doc.text('E-Mail : ravi@pratikcopper.com', 7, 44);
                doc.line(5, 50, 95, 50);

                doc.line(95, 15, 95, 100)

                doc.text('Consignee', 7, 55);
                doc.setFontSize(10);
                doc.text(`${data.data().user_name}`, 7, 59);
                doc.setFontSize(9);
                // doc.text('Pune', 7, 63);
                doc.text(`${data.data().user_id}`, 7, 67);

                doc.text('Invoice No.', 98, 20);
                doc.text('', 98, 24);
                doc.line(95, 25, 205, 25);

                doc.text('Challan No', 98, 30);
                doc.text('', 98, 34);
                doc.line(95, 35, 205, 35);

                doc.text("Supplier's Ref.", 98, 40);
                doc.text('', 98, 44);
                doc.line(95, 45, 205, 45);

                doc.text("Order No.", 98, 50);
                doc.text('', 98, 54);
                doc.line(95, 55, 205, 55);

                doc.text("Despatch Doc No", 98, 60);
                doc.text('', 98, 64);
                doc.line(95, 65, 205, 65);

                doc.text("Despatch Through", 98, 70);
                doc.text('Self Arrange', 98, 74);
                doc.line(95, 75, 205, 75);

                doc.line(150, 15, 150, 75);

                //
                doc.text('Dated', 152, 20);
                doc.text(`${order.date}`, 152, 24);
                // doc.line(95, 25, 205, 25);

                doc.text('Mode/Terms of Payment', 152, 30);
                doc.text('', 152, 34);
                // doc.line(95, 35, 205, 35);

                doc.text("Other Reference", 152, 40);
                doc.text('', 152, 44);
                // doc.line(95, 45, 205, 45);

                doc.text("Dated", 152, 50);
                doc.text(`${order.date}`, 152, 54);
                // doc.line(95, 55, 205, 55);

                doc.text("Dated", 152, 60);
                doc.text(`${order.date}`, 152, 64);
                // doc.line(95, 65, 205, 65);

                doc.text("Destination", 152, 70);
                doc.text(`Pune`, 152, 74);
                // doc.line(95, 75, 205, 75);
                //

                doc.text('Terms of Delivery', 98, 80);

                doc.line(5, 100, 205, 100);

                // jspdf autotable
                doc.autoTable({
                    html: '#my-table',
                    startY: 100,
                    theme: 'plain',
                    tableWidth: 200,
                    headStyles: {
                        lineWidth: 0.1,
                        lineColor: [0, 0, 0]
                    },
                    columnStyles: {
                        0: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        1: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        2: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        3: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        4: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        5: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        6: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                        7: {
                            halign: 'right',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0]
                        },
                    },
                    showHead: 'everyPage',
                    // tableLineWidth: 0.2,
                    // tableLineColor: [0, 0, 0],
                    margin: {
                        left: 5,
                        right: 0
                    },
                    willDrawCell: (data) => {
                        //---------------------------------------
                        // Write the line at the bottom of header
                        //---------------------------------------
                        // data.doc.line(data.cursor.x, data.cursor.y + data.row.height, data.cursor.x + data.cell.contentWidth, data.cursor.y + data.cell.contentHeight);
                        console.log("data: ", data, " data.table.finalY: ", data.table);
                        // if (data.section == "body" && data.column.index != 0) {
                        //     doc.setDrawColor(255, 255, 255)
                        //     doc.setLineWidth(.5);
                        //     console.log("data.cell.x: ", data.cell.x, "\n data.cell.y: ", data.cell.y, "\n data.row.height: ", data.row.height, "\n data.cell.x: ", data.cell.x, "\n data.cell.y: ", data.cell.y);
                        //     doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x, data.cell.y);
                        // }
                        finalyCoordinate = data.table.finalY //finalY
                    }
                })
                let finalY = doc.autoTable.previous.finalY;
                console.log("finalyCoordinate: ", finalyCoordinate, "  ---   ", finalY);
                doc.text(`Tax Amount (in words) : ${str}`, 7, finalY + 5);

                doc.output('dataurlnewwindow');
            })
    }
    saveAsPDF() {
        console.log('saveAsPDF');
        // var LineChart = document.getElementById('chart-container');
        // console.log("Line ", LineChart);
        // html2canvas(document.getElementById("chart-container"), {
        //     onrendered: function (canvas) {
        //         var img = canvas.toDataURL(); //image data of canvas
        //         var doc = new jsPDF();
        //         doc.addImage(img, 10, 10);
        //         doc.save('test.pdf');
        //     }
        // });
        var doc = new jsPDF();
        const Chart = document.getElementsByTagName('canvas');
        console.log("Charts", Chart)
        const canvasImage = Chart[0].toDataURL("image/png", 1.0);
        doc.setFontSize(20);
        doc.text(15, 10, "Testing Charts");
        doc.addImage(canvasImage, 'PNG', 10, 200, 100, 40);

        // const LineChart = document.getElementsByTagName('canvas');
        // console.log("Charts", LineChart)
        // const canvasImage1 = LineChart[1].toDataURL("image/jpeg", 1.0);
        // doc.setFontSize(20);
        // doc.text(15, 10, "Testing Charts");
        // doc.addImage(canvasImage1, 'JPEG', 100, 200, 100, 40);

        doc.save();
    }
    pdf() {
        console.log('new pdf file');

        var HTMLcode = `<div id="LatestPDF" className="LatestPDF">
        <div class="Main">
            <div style="display: flex;flex-direction: row;">
                <div class="Title-Div">Tax Invoice</div>
                <div class="side-Text">(ORIGINAL FOR RECIPIENT)</div>
            </div>
            <div class="Main-rect">
                <div class="First-rect">
                    <div class="raw-details">
                        <div class="first-half">
                            RKB METAL INDUSTRIES PRIVATE LIMITED<br />
                            S NO 17/3, SUKHSAGAR NAGAR, NEAR HEMA MANGAL,<br />
                            KATRAJ, Pune, Maharashtra, 411046<br />
                            GSTIN/UIN: 27AAJCR1260P1ZX<br />
                            State Name : Maharashtra, Code : 27<br />
                            CIN: U28999PN2018PTC178676<br />
                            E-Mail : ravi@pratikcopper.com
                        </div>
                        <div class="second-half">
                            Consignee<br />
                            Mr. Aditya Mane.<br />
                            Pune<br />
                            State Name : Maharashtra, Code : 27
                        </div>
                    </div>
                    <div class="invoice-details">
                        <div class="row">
                            <div class="content-1">
                                Invoice No.<br />
                                230
                            </div>
                            <div class="content-2">
                                Dated<br />
                                22-Mar-2021
                            </div>
                        </div>
                        <div class="row">
                            <div class="content-1">
                                Invoice No.<br />
                                230
                            </div>
                            <div class="content-2">
                                Dated<br />
                                22-Mar-2021
                            </div>
                        </div>
                        <div class="row">
                            <div class="content-1">
                                Invoice No.<br />
                                230
                            </div>
                            <div class="content-2">
                                Dated<br />
                                22-Mar-2021
                            </div>
                        </div>
                        <div class="row">
                            <div class="content-1">
                                order No<br />
                                230
                            </div>
                            <div class="content2">
                                Dated<br />
                                22-Mar-2021
                            </div>
                        </div>
                        <div class="row">
                            <div class="content-1">
                                Despatch Doc No<br />
                                230
                            </div>
                            <div class="content-2">
                                Dated<br />
                                13-Mar-2021
                            </div>
                        </div>
                        <div class="row">
                            <div class="content-1">
                                Despatch Through<br />
                                Self Arrange
                            </div>
                            <div class="content-2">
                                Destination<br />
                                Pune
                            </div>
                        </div>
                        <div class="7th">
                            Terms of Delivery
                        </div>
                    </div>
                </div>
                <div class="Table">
                    <div class="thead">
                        <div class="cell1">SI NO</div>
                        <div class="cell2">Description of Goods</div>
                        <div class="cell3">HSN/SAC</div>
                        <div class="cell4">Quantity</div>
                        <div class="cell5">Rate</div>
                        <div class="cell6">Per</div>
                        <div class="cell7">Disc. %</div>
                        <div class="cell8">Amount</div>
                    </div>
                    <div class="tbody">
                        <div class="cell1"></div>
                        <div class="cell2"></div>
                        <div class="cell3"></div>
                        <div class="cell4"></div>
                        <div class="cell5"></div>
                        <div class="cell6"></div>
                        <div class="cell7"></div>
                        <div class="cell8"></div>
                    </div>
                    <div class="last-row">
                        <div class="cell1"></div>
                        <div class="cell2">Total</div>
                        <div class="cell3"></div>
                        <div class="cell4">1 Nos.</div>
                        <div class="cell5"></div>
                        <div class="cell6"></div>
                        <div class="cell7"></div>
                        <div class="cell8">563</div>
                    </div>
                </div>
                <div>
                    Amount Changeable  (in words)<br />
                    INR Five Hundred Sixty Three Only
                </div>
                <div class="Table">
                    <div class="thead">
                        <div class="cell2">HSN/SAC</div>
                        <div class="cell6">Taxable value</div>
                        <div class="cell6">Central Tax</div>
                        <div class="cell6">State Tax</div>
                        <div>Total</div>
                    </div>
                    <div class="second-tbody">
                        <div class="cell2">HSN/SAC</div>
                        <div class="cell6">Taxable value</div>
                        <div class="cell6">Central Tax</div>
                        <div class="cell6">State Tax</div>
                        <div>Total</div>
                    </div>
                    <div class="last-row">
                        <div class="cell2">HSN/SAC</div>
                        <div class="cell6">Taxable value</div>
                        <div class="cell6">Central Tax</div>
                        <div class="cell6">State Tax</div>
                        <div>Total</div>
                    </div>
                </div>                            
            </div>
        </div>
    </div>`

        var doc = new jsPDF('portrait', 'pt', 'a4');
        var elementHTML = document.getElementById('LatestPDF');
        console.log('element ---', elementHTML);
        doc.html(HTMLcode, {
            html2canvas: {
                width: 100,
                scale: 0.5
            },
            callback: function (doc) {
                console.log('inner doc', doc);
                // doc.save();
                doc.output('dataurlnewwindow');
                // var iframe = document.createElement('iframe');
                // iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:400px');
                // document.body.appendChild(iframe);
                // iframe.src = doc.output('dataurlnewwindow');
            },
            x: 5,
            y: 5
        });
    }
    HTMLTOPDF() {
        console.log('HTMLTOPDF');
        // fetch('https://www.google.com/')
        //     .then(response => response.text())
        //     .then(html => {
        //         console.log("lets see", html);
        //         var div = document.createElement('div');
        //         div = html;

        //     })
        var con = document.createElement('div');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                con.innerHTML = xhr.responseText;
                console.log(con.innerHTML);

                var doc = new jsPDF('portrait', 'pt', 'a4');
                doc.html(con.innerHTML, {
                    html2canvas: {
                        width: 100,
                        scale: 0.5
                    },
                    callback: function (doc) {
                        console.log('inner doc', doc);
                        // doc.save();
                        doc.output('dataurlnewwindow');
                        // var iframe = document.createElement('iframe');
                        // iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:400px');
                        // document.body.appendChild(iframe);
                        // iframe.src = doc.output('dataurlnewwindow');
                    },
                    x: 5,
                    y: 5
                });
            }
        }

        xhr.open("GET", "file:///E:/CopperNew15March2021/CopperNew/pdf.html", true);
        xhr.setRequestHeader('Content-type', 'text/html');
        xhr.send();
    }
    ConvertTONumber(num) {
        console.log('Num: ', num.toFixed(2));
        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        console.log("Converted Number: ", str);
        return str;
    }
    render() {
        const { date1, date2, filteredArray } = this.state;
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
                text: 'All', value: this.state.productsList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };

        const Line_options = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        };
        return (
            <div>
                <div id="LogoImg" style={{ alignContent: 'center' }}>
                    <img src={require('../../assets/PARTHI_LOGO_/PNG/PARTHI_LOGO-01.png')} width={100} height={70} />
                </div>
                <div style={{ width: '100%' }}>
                    <Button onClick={() => this.fireFunPDF()}>fireFunPDF</Button>
                    <Button onClick={() => this.ConvertTONumber(6789)}>ConvertTONumber</Button>
                    {/* <Container>
                        <Row>
                            <Col>
                                <Label for="Category_Name">Select start Date</Label>
                                <input type="date" id="startDate" onChange={(e) => this.dateChange1(e.target.value)} style={{ borderRadius: 23 }} />
                            </Col>
                            <Col>
                                <Label for="Category_Name">Select end Date </Label>
                                <input type="date" id="endDate" onChange={(e) => this.dateChange2(e.target.value)} style={{ borderRadius: 23 }} />
                            </Col>
                            <Col style={{ alignSelf: 'center' }}>
                                <Button onClick={() => { this.getData() }}>Search</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                                    onChange={(e) => { this.deliveryStatus(e.target.value) }}>
                                    <option value="">Select Option</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </Col>
                            <Col>
                                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                                    onChange={(e) => { this.paymentStatus(e.target.value) }}>
                                    <option value="">Select Option</option>
                                    <option value="COD">COD</option>
                                    <option value="false">False</option>
                                </select>
                            </Col>
                        </Row>
                    </Container> */}

                </div>
                <BootstrapTable
                    noDataIndication="Table is Empty"
                    keyField="id"
                    data={this.state.filteredArray}
                    columns={this.state.columns}
                    filter={filterFactory()}
                    striped
                    hover
                    condensed
                    loading={true}
                    pagination={paginationFactory(options)}
                />
                <div style={{ marginTop: 20 }}>
                    <Table striped id="my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User ID</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Delivery Status</th>
                                <th>Actions 1</th>
                                <th>Actions 2</th>
                                <th>Actions 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArray.length > 0 ? filteredArray.map(data => {
                                return (
                                    <tr key={data.id}>
                                        <th>{data.id}</th>
                                        <td>{data.user_id}</td>
                                        <td>{data.Total_item}</td>
                                        <td>{data.Total_amount}</td>
                                        <td>{data.delivery_status ? 'true' : 'false'}</td>
                                        <td>{data.delivery_status ? 'true' : 'false'}</td>
                                        <td>{data.delivery_status ? 'true' : 'false'}</td>
                                        <td>{data.delivery_status ? 'true' : 'false'}</td>
                                        {/* <td>
                                            <Button onClick={() => this.printDocument(data.id, 'view')} color="secondary">View Pdf</Button>&nbsp;&nbsp;
                                            <Button color="primary" onClick={() => this.printDocument(data.id, 'save')}>Download Pdf</Button>
                                        </td> */}
                                    </tr>
                                )
                            }) :
                                <tr style={{ width: '100%' }}>
                                    No data available for selected values
                                </tr>}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
