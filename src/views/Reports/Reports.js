import React, { Component } from 'react'
import { Alert, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, Progress, Container, Row, Col, Table } from 'reactstrap';
import firebase from 'firebase';
import { Page, PDFDownloadLink, PDFViewer, ReactPDF, Document, Text, StyleSheet, View } from '@react-pdf/renderer';
import update from 'immutability-helper';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Order_details from './Order_Details';
import PdfDocument from './CommonPdf';
// import CopperLogo from '../../assets/img/Koala.jpg';
import CopperLogo from '../../assets/JS_Images/Logo';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import imageToBase64 from 'image-to-base64/browser';
import moment from 'moment'
import { Doughnut, Bar, Line } from 'react-chartjs-2';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
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
                labels: [1, 2, 3, 4, 5, 6, 7],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
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
                    dataField: 'id',
                    text: 'id',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Sr_No',
                    text: 'Sr No',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Product_ID',
                    text: 'Product ID',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Product_Name',
                    text: 'Product Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Category_Name',
                    text: 'Category Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Cost_Price',
                    text: 'Cost Price',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Selling_Price',
                    text: 'Selling Price',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Usage',
                    text: 'Usage',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'How_to_clean',
                    text: 'How to clean',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'IsActive',
                    text: 'IsActive',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'MRP',
                    text: 'MRP',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name1',
                    text: 'Image Name1',
                    align: 'center',
                    formatter: this.Img_Nm1,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Weight',
                    text: 'Weight',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name2',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name3',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name4',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    // formatter: this.Img_Nm4,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.actionEditDeleteProduct,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                }
            ]
        }
    }

    nestedData = (cell, row, rowIndex, formatExtraData) => {
        console.log("Row Data", row.product_details);
        // var confirmUserId1 = row.id;
        // row.product_details.map(df => {
        return (
            console.log("data", row.product_details)
            // < div key = { row.id } >
            //         <div>{row.id}</div>
            //         <div>{row.quantity}</div>
            //     </div >
        )
        // })

        // row.product_details.map(df => {
        //     return (
        //         <div key={df.id}>
        //             <div>{df.id}</div>
        //             <div>{df.quantity}</div>
        //         </div>
        //     )
        // })
        // );
    };
    async componentDidMount() {
        console.log("ComponentDidMount");

        // firebase.firestore().collection('Products').onSnapshot((data) => {

        //     let Changes = data.docChanges();
        //     Changes.forEach((change) => {
        //         if (change.type === 'added') {
        //             console.log("doc changes addedd", change.type, change.doc.id, change.doc.data());
        //             this.state.productsList.push({ id: change.doc.id, ...change.doc.data() })
        //         }
        //         if (change.type === 'modified') {
        //             console.log("doc changes modified", change.type, change.doc.data(), "ID", change.doc.id);
        //             const newArray = this.state.productsList.map(e => {
        //                 if (e.id == change.doc.id) { console.log("value", e); return { id: change.doc.id, ...change.doc.data() } }
        //                 else return e
        //             });
        //             this.setState({ productsList: newArray }, () => console.log("state array", this.state.productsList))
        //         }
        //         if (change.type === 'removed') {
        //             console.log("doc changes removed", change.type);

        //             const eleRemovedArray = this.state.productsList.filter((e) =>
        //                 e.id !== change.doc.id
        //             )
        //             this.setState({ productsList: eleRemovedArray })
        //         }
        //     })
        // })
        //for order details
        firebase.firestore().collection('OrderList').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            this.setState({ OrderDetails: [] });
            var OList = [];
            var falseOrderlist = [];
            var TA = 0;
            data.forEach(async (el) => {
                console.log("el", el.data().Total_amount);
                OList.push({ id: el.id, ...el.data() });
                if (el.data().delivery_status === false) {
                    falseOrderlist.push({ id: el.id, ...el.data() })
                }
                TA = TA + parseInt(el.data().Total_amount);
            })
            console.log("TA", TA);
            console.log("orderDetails", this.state.OrderDetails);
            this.setState({ OrderDetails: OList, TA: TA, filteredArray: falseOrderlist })
        })
        // for order details
        // firebase.firestore().collection('OrderList').onSnapshot(data => {
        //     let Changes = data.docChanges();
        //     console.log("Change doc", Changes);
        //     Changes.forEach(Change => {
        //         if (Change.type === 'added') {
        //             console.log('added', Change.type)
        //             this.setState({ OrderDetails: [] });
        //             var OList = []
        //             var TA = 0;
        //             data.forEach(async (el) => {
        //                 console.log("el", el.data().Total_amount);
        //                 OList.push({ id: el.id, ...el.data() })
        //                 TA = TA + parseInt(el.data().Total_amount);
        //             })
        //             console.log("TA", TA);
        //             console.log("orderDetails", this.state.OrderDetails);
        //             this.setState({ OrderDetails: OList, TA: TA })
        //         } else if (Change.type === 'modified') {
        //             console.log('modified', Change.type);
        //             this.setState({ OrderDetails: [] });
        //             var OList = []
        //             var TA = 0;
        //             data.forEach(async (el) => {
        //                 console.log("el", el.data().Total_amount);
        //                 OList.push({ id: el.id, ...el.data() })
        //                 TA = TA + parseInt(el.data().Total_amount);
        //             })
        //             console.log("TA", TA);
        //             console.log("orderDetails", this.state.OrderDetails);
        //             this.setState({ OrderDetails: OList, TA: TA })
        //         } else if (Change.type === 'removed') {
        //             console.log('Removed', Change.type)
        //             this.setState({ OrderDetails: [] });
        //             var OList = []
        //             var TA = 0;
        //             data.forEach(async (el) => {
        //                 console.log("el", el.data().Total_amount);
        //                 OList.push({ id: el.id, ...el.data() })
        //                 TA = TA + parseInt(el.data().Total_amount);
        //             })
        //             console.log("TA", TA);
        //             console.log("orderDetails", this.state.OrderDetails);
        //             this.setState({ OrderDetails: OList, TA: TA })
        //         }
        //     })
        // })

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
        // const orderData = firebase.firestore().collection('OrderList').doc('IPNGQ1JZHU7Y5ImJOvbB').get();
        // return orderData.then(async (data) => {
        //     console.log(data.data());
        //     var Data = data.data()
        //     var TableData = data.data().product_details;
        //     var DownloadImages = new Promise((resolve, reject) => {
        //         data.data().product_details.forEach((element, i) => {
        //             console.log("Url ------ ", element.imgurl);

        //             // other code https://stackoverflow.com/q/62055089/11510305
        //             var xhr = new XMLHttpRequest();
        //             xhr.responseType = 'blob';
        //             xhr.onload = function (event) {
        //                 var blob = xhr.response;
        //                 console.log(blob);

        //                 // https://stackoverflow.com/a/13968945/11510305
        //                 var blobURL = URL.createObjectURL(blob);
        //                 var img = new Image();

        //                 img.src = blobURL;
        //                 var IMAGE = document.body.appendChild(img);
        //                 // TableData[i].imgurl = blob;
        //                 console.log("after :", TableData[i].imgurl);
                        
        //                 // https://stackoverflow.com/a/18650249/11510305
        //                 var reader = new FileReader();                        
        //                 reader.readAsDataURL(blob); 
        //                 reader.onloadend = function() {
        //                     var base64data = reader.result;                
        //                     console.log(base64data);
        //                     TableData[i].imgurl = blob;
        //                 }

        //                 resolve();
        //             };
        //             xhr.open('GET', element.imgurl);
        //             xhr.send();
        //         });
        //     })

        //     DownloadImages.then(() => {

        //         const doc_1 = new jsPDF();
        //         var order = Data;
        //         console.log("order data", order)
        //         var header = ['Image', 'Product ID', 'Product Name', 'Quantity', 'Price', 'Total Amount',]

        //         var data = []
        //         data = TableData.map(obj => [obj.imgurl, obj.id, obj.product_name, obj.quantity, obj.price, obj.total_Price])
        //         console.log("extracted data", data)
        //         // var div = document.querySelector('#LogoImg');
        //         // html2canvas(div).then(onfulfilled => {
        //         // console.log("onfulfilled ", onfulfilled);
        //         // var image = onfulfilled.toDataURL('image/png');

        //         // doc.addImage(image, 'PNG', 90, 5);

        //         doc_1.setFontSize(20);
        //         doc_1.text(15, 50, "Order");
        //         doc_1.setFontSize(10);
        //         doc_1.text(150, 50, `${moment().format('dddd, MMMM Do YYYY')}`);
        //         doc_1.line(15, 55, 190, 55, 'S');

        //         doc_1.setFontSize(12);
        //         doc_1.text(15, 65, `Order ID :`)
        //         doc_1.text(45, 65, `${order.Order_id}`);

        //         doc_1.setFontSize(10);
        //         doc_1.text(15, 70, `Bill to`)
        //         doc_1.text(15, 75, `User Name :`);
        //         doc_1.text(45, 75, `${order.user_name}`);
        //         doc_1.text(15, 80, `User ID :`);
        //         doc_1.text(45, 80, `${order.user_id}`);
        //         doc_1.text(15, 85, `Address :`);
        //         doc_1.text(45, 85, `${order.address}`);

        //         doc_1.autoTable({
        //             head: [['Images', 'Product ID', 'Product Name', 'Total Items', 'Price', 'Total Amount']],
        //             body: data,
        //             didDrawCell: function (data) {
        //                 if (data.column.index === 0 && data.cell.section === 'body') {
        //                     console.log("data.cell.raw", data.cell.raw);
        //                     var td = data.cell.raw;
        //                     // var img = td.getElementsByTagName('img')[0];
        //                     var dim = data.cell.height - data.cell.padding('vertical');
        //                     console.log("textPos", data.cell.x);
        //                     var textPos = data.cell.textPos;
        //                     doc_1.addImage(data.cell.raw, data.cell.x, data.cell.y, dim, dim);
        //                 }
        //             },
        //             // startY: data.cell.y + 2,
        //             margin: { top: 100, left: 40, right: 20 },
        //             tableWidth: 150,
        //             headStyles: {
        //                 halign: 'center',
        //                 fillColor: [105, 105, 105],
        //                 textColor: [255, 255, 255]
        //             },
        //             theme: 'plain',
        //             styles: {
        //                 fontSize: 8,
        //                 // overflow: 'linebreak',
        //                 halign: 'center',
        //                 cellPadding: 3
        //             }
        //         });
        //         doc_1.setDrawColor(0, 0, 0);
        //         doc_1.line(15, 175, 190, 175, 'S');
        //         // doc.text(150, 180, `Subtotal :`);
        //         // doc.text(175, 180, `${order.Total_amount}`);
        //         doc_1.text(150, 185, `Total Amount :`);
        //         doc_1.text(175, 185, `${order.Total_amount}`);
        //         doc_1.text(15, 180, `Payment Status :`);
        //         doc_1.text(45, 180, `${order.delivery_status}`);
        //         doc_1.text(15, 185, `Payment Method :`);
        //         doc_1.text(45, 185, `${order.payment_Method}`);

        //         doc_1.text(75, 210, `Thank you for your Orders`);
        //         // var pdf = doc_1.output();
        //         // doc_1.output();
        //         // console.log("PDF", pdf);

        //         // const saveLocation = await admin.storage().bucket().file(`PDF/${id}/generated.pdf`)
        //         // await saveLocation.save(pdf, async (status) => {
        //         //     if (!status) {
        //         //         await saveLocation.makePublic().then(() => {
        //         //             saveLocation.getMetadata().then(async (meta) => {
        //         //                 metadata = meta[0];
        //         //                 metadata.mediaLink
        //         //                 // console.log("meta", meta);
        //         //                 console.log("meta", metadata.mediaLink);
        //         //                 await admin.firestore().collection("OrderList").doc(`${id}`)
        //         //                     .update({
        //         //                         pdfUrl: metadata.mediaLink
        //         //                     }).then(
        //         //                         () => {
        //         //                             resolve()
        //         //                         }).catch((err) => {
        //         //                             console.log("Error message", err);
        //         //                         })
        //         //                 return metadata.mediaLink
        //         //             })
        //         //         })
        //         //     }
        //         // })
        //         doc_1.output();
        //     })
        // })

        // firebase.firestore().collection('OrderList').add({
        //     Order_id: 'ORDER-8308547627-12-May-2021-17-9-39',
        //     Total_amount: 1355,
        //     Total_item: 3,
        //     address: 'Ajit Shinde\nAt Post bairagi mala, palashi Parner Maharashtra 414304',
        //     date: '12-May-2021',
        //     delivery_status: false,
        //     orderDateFormat: new Date(),
        //     payment_Method: 'Cash on delivery',
        //     product_details: [{
        //         id: 'CPBLMPR1C001',
        //         imgurl: '',
        //         price: 572,
        //         product_name: 'Pratik Copper- Mr.Fit Water Bottle - Printed Black Marble',
        //         quantity: 2,
        //         total_Price: 1144
        //     }],
        //     user_id: 8308547627,
        //     // user_name: 'Ajit Shinde'
        // })
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

        return (
            <div>
                <div id="LogoImg" style={{ alignContent: 'center' }}>
                    <img src={require('../../assets/PARTHI_LOGO_/PNG/PARTHI_LOGO-01.png')} width={100} height={70} />
                </div>
                <br />
                {/* PDF VIEW  */}
                {/* <Button onClick={() => { this.exportPDF() }}>Product Pdf Download!</Button>
                <Button onClick={() => { this.orderPDF() }}>Order Pdf Download!</Button> */}
                {/* <FormGroup>
                    <select type="select" name="select" id="IsActive"
                        onChange={(e) => {
                            console.log("selected val", e.target.value)
                            this.setState({ selectedId: e.target.value });
                        }}
                    >
                        <option value="">Select Order Id</option>
                        {this.state.OrderDetails.map((data, i) => { return <option key={i} value={`${data.id}`}>{data.id}</option> })}
                    </select>
                </FormGroup> */}
                {/* <button onClick={() => { this.printDocument() }}>Generate Sample PDF</button> */}
                <Button onClick={() => { this.fireFunPDF() }}>Firebase Fun PDF</Button>
                <div style={{ width: '100%' }}>
                    <Container>
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
                                {/* <Button onClick={() => { this.deliveryStatus() }}>Filter By Delivery Status</Button> */}
                                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                                    // value={this.state.Edit_ProductData.Category_Name}
                                    onChange={(e) => { this.deliveryStatus(e.target.value) }}>
                                    <option value="">Select Option</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </Col>
                            <Col>
                                <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                                    // value={this.state.Edit_ProductData.Category_Name}
                                    onChange={(e) => { this.paymentStatus(e.target.value) }}>
                                    <option value="">Select Option</option>
                                    <option value="COD">COD</option>
                                    <option value="false">False</option>
                                </select>
                            </Col>
                            <Col>
                                {/* <select type="select" name="select" id="exampleSelect" style={{ borderRadius: 23 }}
                                    // value={this.state.Edit_ProductData.Category_Name}
                                    onChange={(e) => { this.deliveryStatus(e.target.value) }}>
                                    <option value="">Select Option</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select> */}
                            </Col>
                        </Row>
                    </Container>

                </div>
                <div style={{ marginTop: 20 }}>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User ID</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Delivery Status</th>
                                <th>Actions</th>
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
                                        <td>
                                            <Button onClick={() => this.printDocument(data.id, 'view')} color="secondary">View Pdf</Button>&nbsp;&nbsp;
                                            <Button color="primary" onClick={() => this.printDocument(data.id, 'save')}>Download Pdf</Button>
                                        </td>
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
