printDocument() {
    console.log("TA", this.state.TA)
    var header = ['Order ID', 'User ID', 'Total Items', 'Total Amount', 'Product ID']
    var data = this.state.OrderDetails.map(obj => [obj.Order_id, obj.user_id, obj.Total_item, obj.Total_amount, obj.product_details]);

    var div = document.querySelector('#LogoImg');
    html2canvas(div).then(onfulfilled => {
        console.log("onfulfilled ", onfulfilled);
        var image = onfulfilled.toDataURL('image/png');

        doc.addImage(image, 'PNG', 90, 5);

        doc.setFontSize(20);
        doc.text(15, 50, "Testing Charts");
        doc.setFontSize(10);
        doc.text(150, 50, `${moment().format('dddd, MMMM Do YYYY')}`);
        doc.setFontSize(12);
        doc.text(15, 55, `Total Amount : ${this.state.TA}`);

        doc.autoTable(header, data, {
            margin: { top: 60 },
            styles: { overflow: 'linebreak', cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 30, minCellHeight: 30 },
                1: { cellWidth: 30, minCellHeight: 30 },
                2: { cellWidth: 20, minCellHeight: 30 },
                3: { cellWidth: 20, minCellHeight: 30 },
                4: { minCellHeight: 40 }
            },
            didDrawCell: async (data) => {
                // height = data.table.height,
                console.log("didDrawCell", data, "datakey", data.column.dataKey, "cell section", data.cell.section);
                if (data.column.dataKey === 4 && data.cell.section === 'body') {
                    console.log("raw data", data.row.raw[2]);
                    var innerData = data.row.raw[4].map(d => [d.id, d.quantity]);
                    console.log("innerData", innerData, "data.cell.y + 2 ", data.cell.y + 2);
                    doc.autoTable({
                        head: [["ID", "Quantity"]],
                        body: innerData,
                        startY: data.cell.y + 2,
                        margin: { left: data.cell.x + data.cell.padding('left') },
                        // tableWidth: 'wrap',
                        // rowStyles: {
                        //     rowWidth: 'wrap'
                        // },
                        // theme: 'grid',
                        styles: {
                            fontSize: 7,
                            // overflow: 'linebreak',
                            align: 'left',
                            cellPadding: 3
                        }
                    });
                }
            },
            // columnStyles: {
            //     5: { cellWidth: 40 }
            // },
            bodyStyles: {
                minCellHeight: 30
            }
        });
        doc.save();
    }, onrejected => {
        console.log("onrejected ", onrejected);
        doc.text(15, 50, "Testing Charts rejected");
        doc.save();
    })
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
    // var pdfmakeArray = [];
    // var pdfmakeArray = this.state.OrderDetails.map((data) => [data.Order_id, data.Total_amount, data.Total_item, data.address])
    // console.log("pdfmakeArray: ", pdfmakeArray)
    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // var docDefinition = {
    //     content: [
    //         {
    //             layout: 'lightHorizontalLines', // optional
    //             table: {
    //                 // headers are automatically repeated if the table spans over multiple pages
    //                 // you can declare how many rows should be treated as headers
    //                 headerRows: 1,
    //                 widths: ['*', 'auto', 100, '*'],

    //                 body: [
    //                     ['Order_id', 'Total_amount', 'Total_item', 'address'],
    //                     // ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
    //                     // [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
    //                     [pdfmakeArray]
    //                 ]
    //             }
    //         }
    //     ]
    // };
    // pdfMake.createPdf(docDefinition).open();

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



import React, { Component } from 'react'
import { Alert, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, Progress } from 'reactstrap';
import firebase from 'firebase';
import { Page, PDFDownloadLink, PDFViewer, ReactPDF, Document, Text, StyleSheet, View } from '@react-pdf/renderer';
import Order_details from './Order_Details';
import PdfDocument from './CommonPdf';

import jsPDF from 'jspdf'
import 'jspdf-autotable'

const doc = new jsPDF()

export default class Reports extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            data: [],
            productsList: []
        }
    }

    componentDidMount() {
        console.log("ComponentDidMount");

        firebase.firestore().collection('Products').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            this.setState({ productsList: [] });
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                this.state.productsList.push({ id: el.id, ...el.data() })
                this.setState({})
                console.log("productsList", this.state.productsList);
            })
        })
    }

    //PDF CODE
    exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "My Awesome Report";
        const headers = [['Product_Name',
            // 'Image',
            'Category_Name',
            'Cost_Price',
            'Selling_Price',
            // 'Usage',
            'IsActive']];

        const data = this.state.productsList.map(elt => [elt.Product_Name,
        // elt.Image_Name1,
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

        let dataSrc = doc.output("dataurlnewwindow");
        var embed = "<embed width='100%' height='100%' src='" + dataSrc + "'/>"
        var x = window.open();
        x.document.open();
        x.document.write(embed);
        x.document.close();
        
        // doc.save("report.pdf")
    }
    async downloadURl(url) {
        console.log("fire url");
        // await firebase.storage().ref(url).
    }
    render() {
        return (
            <div>
                {/* PDF VIEW  */}
                <Button onClick={() => { this.exportPDF() }}>Download!</Button>
            </div >
        )
    }
}
