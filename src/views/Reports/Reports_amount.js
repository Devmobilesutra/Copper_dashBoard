import React, { Component } from 'react'
import { Label, Button, Container, Row, Col } from 'reactstrap';
import firebase from 'firebase';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import jsPDF from 'jspdf'
require('jspdf-autotable');

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
    </span>
);

export default class Reports_amount extends Component {
    // labels = Utils.months({ count: 7 });
    constructor() {
        super();
        this.state = {
            show: false,
            date1: '',
            date2: '',
            a:[],
            filteredArray: [],
            filteredArray1:[],
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
                    dataField: 'user_name',
                    text: 'User Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'user_id',
                    text: 'User Number',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'amt',
                    text: 'Total Bill',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
            ],
        }
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
    printDocument() {

        // console.log(this.state.filteredArray1,'aaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        // Or use javascript directly:
        var doc = new jsPDF();
        doc.text('Top 3 channel partners from  '+this.state.date1+' to '+this.state.date2,10,10);
        doc.autoTable({
          head: [['user_name','User_MobileNo','total_bill']],
          body: [
            [this.state.filteredArray1[0].user_name,this.state.filteredArray1[0].user_id,this.state.filteredArray1[0].amt],
            [this.state.filteredArray1[1].user_name,this.state.filteredArray1[1].user_id,this.state.filteredArray1[1].amt],
            [this.state.filteredArray1[2].user_name,this.state.filteredArray1[2].user_id,this.state.filteredArray1[2].amt]
            // ...
          ],
        })
        
        doc.save('Top_channer_partners.pdf')
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
        if (date1 === undefined || date1 === '') {
            alert('Select Start date')
            return
        }
        if (date2 === undefined || date2 === '') {
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
         orders = firebase.firestore().collection('OrderList')
            .where('orderDateFormat', '>=', startDate)
            .where('orderDateFormat', '<=', endDate)
            .get();
        orders.then(element => {
            console.log("fff", element.docs);
            let localArray = [];
            let localArray1=[];
            let localArray2=[];
            element.docs.forEach(data => {
                // console.log("itereted data", data.data(), " date format ", data.data().timestamp, new Date(data.data().timestamp.seconds * 1000), moment(data.data().timestamp.seconds * 1000).format('DD/MM/YYYY'))
                localArray.push({ id: data.id, ...data.data() })
            })
            for(var i=0;i<this.state.a.length;i++)
            {
                localArray.push(this.state.a[i])
            }
           console.log(localArray,'final')
            for(var i=0;i<localArray.length;i++)
            {
                var total_amount=0;
            console.log(localArray[i].user_id,'ahfasgdjlak')
                for(var j=0;j<localArray.length;j++)
                {      
                        if(localArray[j].user_id===localArray[i].user_id)
                        {
                             total_amount=parseInt(localArray[j].Total_amount)+parseInt(total_amount)
                            
                        }
                     
                }
                localArray1.push({ mobile:localArray[i].user_id,amount:total_amount})
                // console.log(total_amount,'amount')
                // console.log(typeof(localArray1),'sdjkgf')
            }
            localArray1.sort(function(a, b) {
                return b.amount - a.amount;
            });
             localArray1=localArray1.filter(function (a) {
              var key = a.mobile;
                if (!this[key]) 
                {
                     this[key] = true;
                    return true;
                }
            }, Object.create(null));

             console.log(localArray1,'array')
            for(i=0;i<3;i++)
            {
                // console.log(localArray1,'console')
                for(j=0;j<localArray.length;j++)
                {
                    if(localArray1[i].mobile===localArray[j].user_id)
                    {
                        localArray2.push({amt:localArray1[i].amount,...localArray[j]})
                        break;
                    }
                }
            }
            console.log(localArray2,'fianl array')
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
                text: 'All', value: this.state.productsList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

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
             
                <BootstrapTable
                    noDataIndication="Table is Empty"
                    keyField="id"
                    data={this.state.filteredArray1}
                    columns={this.state.columns}
                    filter={filterFactory()}
                    pagination={paginationFactory(options)}
                />
                {
                    this.state.filteredArray1!=''?
                 <div style={{ marginRight:10, marginTop: 10}}>
                 <Button color="primary" onClick={() => { this.printDocument('save') }}>Download</Button>
                 </div>:null
                 }
                <div style={{ marginTop: 20 }}>
                </div>
            </div>
        )
    }
}
