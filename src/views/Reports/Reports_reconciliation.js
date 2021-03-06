import React, { Component } from 'react'
import { Label, Button, Container, Row, Col } from 'reactstrap';
import firebase from 'firebase';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import jsPDF from 'jspdf'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
const { ExportCSVButton } = CSVExport;

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
    </span>
);
var amount=0;
export default class Reports_reconciliation extends Component {
    // labels = Utils.months({ count: 7 });
    constructor() {
        super();
        this.state = { 
            show: false,
            date1: '',
            date2: '',
            filteredArray: [],
            filteredArray1:[],
            filteredArray11:[],
            a:[],
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
                    dataField: 'name',
                    text: 'Product name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'id',
                    text: 'Product Id',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'price',
                    text: 'Price',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'quantity',
                    text: 'Total quantity',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
        
                {
                    dataField: 'amount',
                    text: 'Total Bill',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
             
            ],
        }
    }
  
    dateChange1(date) {
        console.log('this.dateChange', date, moment(date).format('YYYY MM DD'));
        this.setState({ date1: date })
    }
    dateChange2(date) {
        this.setState({ date2: '' })
        this.setState({a:[]})
        date=moment(date).format('D-MMMM-YYYY')
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
        // this.setState({ filteredArray1:[]})
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
         console.log(startDate,'data')
         console.log(endDate,'data')
         console.log(this.state.date2,'aa')
         let orders = firebase.firestore().collection('OrderList')
         .where('date', '==', this.state.date2)
         .get();
     orders.then(element => {
         element.docs.forEach(data => {
             // console.log("itereted data", data.data(), " date format ", data.data().timestamp, new Date(data.data().timestamp.seconds * 1000), moment(data.data().timestamp.seconds * 1000).format('DD/MM/YYYY'))
             this.state.a.push({ id: data.id, ...data.data()})
             this.setState({})
         })
        
        })

        //  var now_utc1 = new Date(startDate.toUTCString());
        //  var now_utc2 = new Date(endDate.toUTCString());
         orders = firebase.firestore().collection('OrderList')
            .where('orderDateFormat', '>=', startDate)
            .where('orderDateFormat', '<=', endDate)
            .get();
        orders.then(element => {
           
            console.log("fff", element.docs);
            let localArray = [];
            let localArray1=[];
            let localArray1_unique=[];
            let localArray2=[];
            let localArray3=[];
            element.docs.forEach(data => {
                // console.log("itereted data", data.data(), " date format ", data.data().timestamp, new Date(data.data().timestamp.seconds * 1000), moment(data.data().timestamp.seconds * 1000).format('DD/MM/YYYY'))
                localArray.push({ id: data.id, ...data.data()})
            })
            //for adding the order of end date.
            for(var i=0;i<this.state.a.length;i++)
            {
                localArray.push(this.state.a[i])
            }
            
           console.log(localArray,'final')
            for(var i=0;i<localArray.length;i++)
            {
               
             console.log(localArray[i],'ahfasgdjlak')
                for(var j=0;j<localArray[i].product_details.length;j++)
                {     
                  
                    localArray1.push(localArray[i].product_details[j])
                } 
           
            }
            localArray1_unique=localArray1.filter(function (a) {
                var key = a.id;
                  if (!this[key]) 
                  {
                       this[key] = true;
                      return true;
                  }
              }, Object.create(null));
  
               console.log('test',localArray1)
              console.log('test',localArray1_unique)
            for(i=0;i<localArray1_unique.length;i++)
            {  var total_quantity=0;
                var total_amount=0;
             
                for(j=0;j<localArray1.length;j++)
                {
                    if(localArray1_unique[i].id==localArray1[j].id)
                    {
                        total_quantity=parseInt(localArray1[j].quantity)+parseInt(total_quantity)
                        total_amount=parseInt(localArray1[j].total_Price)+parseInt(total_amount)
                    }
                }
                amount=parseInt(total_amount)+parseInt(amount)
                 console.log(amount,'total')
                localArray2.push({name:localArray1_unique[i].product_name,id:localArray1_unique[i].id,price:localArray1_unique[i].price,quantity:total_quantity,amount:total_amount})
            }
            // localArray2.push({total_amt:amount})
          localArray3.push({total_amt:amount})
            //  console.log(localArray2,'fianl array')
            this.setState({filteredArray11:localArray3})
            console.log(this.state.filteredArray11)
            this.setState({ filteredArray1: localArray2})
        })
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
                text: 'All', value: this.state.filteredArray1.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };
        const MyExportCSV = (props) => {
            const handleClick = () => {
              props.onExport();
            };
            return (
              <div>
                <Button color="primary" onClick={ handleClick }>Download Excel</Button>
              </div>
            );
          };
        return (
            <div>
                <div id="LogoImg" style={{ alignContent: 'center' }}>
                    <img src={require('../../assets/PARTHI_LOGO_/PNG/PARTHI_LOGO-01.png')} width={100} height={70} />
                </div>
                <div style={{ width: '100%' }}>
                    <Container>
                        <Row>
                            <Col>
                                <Label for="Category_Name">Select starting Date</Label>
                                <input type="date" id="startDate" onChange={(e) => this.dateChange1(e.target.value)} style={{ borderRadius: 23 }} />
                            </Col>
                            <Col>
                                <Label for="Category_Name">Select end Date </Label>
                                <input type="date" id="endDate" onChange={(e) => this.dateChange2(e.target.value)} style={{ borderRadius: 23 }} />
                            </Col>
                            <Col style={{ alignSelf: 'center' }}>
                                <Button onClick={() => { this.getData() }}>Proceed</Button>
                            </Col>
                        </Row>
                    </Container>

                </div>
                
                  <ToolkitProvider
  keyField="id"
  data={ this.state.filteredArray1}
  columns={ this.state.columns }
  exportCSV
>
  {
    props => (
      <div>
             {
                    this.state.filteredArray1!=''?
                 <div style={{ marginRight:10, marginTop: 10}}>
                  <MyExportCSV { ...props.csvProps } /><br></br>
                  <text>Total Bill : Rs. {this.state.filteredArray11[0].total_amt} /-</text>
                 </div>:null
                 }
                  <hr/>
        <BootstrapTable  noDataIndication="Table is Empty" { ...props.baseProps }  pagination={paginationFactory(options)}/>
      </div>
    )
  }
</ToolkitProvider>
            </div> 
        )
    }
}
