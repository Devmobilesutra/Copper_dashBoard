import React, { Component } from 'react';
import { Card, CardBody, CardColumns,  CardHeader,} from 'reactstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';


const options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false
  }

class Graph2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Data: {},
          line: {},
          LikeLine: {},
          FollowLine: {},
          UsersCity: {},
          FavouriteLine: {},
          TopThree: {},
          
          Category:  [],
          UserCity:['Pune', 'Mumbai', 'Delhi', 'Solapur', 'Nagpur', 'Latur'],

          MAX1: 0,
          MAX1TIPID: '',
          MAX1TIP: '',
          MAX2: 0,
          MAX2TIPID: '',
          MAX2TIP: '',
          MAX3: 0,
          MAX3TIPID: '',
          MAX3TIP: '',


          totalLikeCatOne: '',
          totalLikeCatTwo: '',
          totalLikeCatThree: '',
          totalLikeCatFour: '',
          totalLikeCatFive: '',
          totalLikeCatSix: '',

          totalFollowCatOne: '',
          totalFollowCatTwo: '',
          totalFollowCatThree: '',
          totalFollowCatFour: '',
          totalFollowCatFive: '',
          totalFollowCatSix: '',

          totalFavouriteCatOne: '',
          totalFavouriteCatTwo: '',
          totalFavouriteCatThree: '',
          totalFavouriteCatFour: '',
          totalFavouriteCatFive: '',
          totalFavouriteCatSix: '',

          totalCityOne: '',
          totalCityTwo: '',
          totalCityThree: '',
          totalCityFour: '',
          totalCityFive: '',
          totalCitySix: '',
          
        }
      }


      componentDidMount()   {
        const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
                
          }) 
        }

        fetch('https://ecomentor.cloudjiffy.net/admin/getCategoryList' , options)
        .then((Response) => Response.json())
        .then((findresponse)=>
        {
          console.log(findresponse.data)
          const cat = findresponse.data;
           

          cat.forEach(val => {
            this.state.Category.push(val.category_name);  
        });
             
        })

       
        //  fetch('http://localhost:8080/admin/getTipTotalLikeCount' , options)
        //fetch(' https://ecomentor.cloudjiffy.net/admin/getTipTotalLikeCount' , options)
       
        fetch('  https://ecomentor.cloudjiffy.net/admin/getTipList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            const tips = findresponse.data;
          

            //Top 3 Tips
            tips.forEach(element => {
              if( element.total_like_count > this.state.MAX1 )
              {
                this.setState({
                  MAX1: element.total_like_count,
                  MAX1TIPID: element.tip_id,
                  MAX1TIP: element.title,
                })
                console.log('MAX1',this.state.MAX1);
                console.log('MAX1TIPID',this.state.MAX1TIPID);
                console.log('MAX1TIP',this.state.MAX1TIP);
              }           
            })
            

            tips.forEach(element => {
              if( element.total_like_count < this.state.MAX1 && element.total_like_count > this.state.MAX2 )
              {
                this.setState({
                  MAX2: element.total_like_count,
                  MAX2TIPID: element.tip_id,
                  MAX2TIP: element.title,
                })
                console.log('MAX2',this.state.MAX2);
                console.log('MAX2TIPID',this.state.MAX2TIPID);
                console.log('MAX2TIP',this.state.MAX2TIP);
              }
            })

            tips.forEach(element => {
              if( element.total_like_count < this.state.MAX2 && element.total_like_count > this.state.MAX3 )
              {
                this.setState({
                  MAX3: element.total_like_count,
                  MAX3TIPID: element.tip_id,
                  MAX3TIP: element.title,
                })
                console.log('MAX3',this.state.MAX3);
                console.log('MAX3TIPID',this.state.MAX3TIPID);
                console.log('MAX3TIP',this.state.MAX3TIP);
              }
            })

            this.setState({
            TopThree : {
              labels: [
                this.state.MAX1TIPID + ":" + this.state.MAX1TIP,
                this.state.MAX2TIPID + ":" +this.state.MAX2TIP,
                this.state.MAX3TIPID + ":" +this.state.MAX3TIP,
              ],
              datasets: [
                {
                  data: [this.state.MAX1, this.state.MAX2, this.state.MAX3],
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                  ],
                  hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                  ],
                }],
            }

          })

            let tipid = [];
            let total_like_count = [];
            tips.forEach(element => {
                tipid.push(element.tip_id);
                total_like_count.push(element.total_like_count);

            });
            console.log('tipid:',tipid);
            console.log('total-like-count:',total_like_count);
            this.setState({ 
                line : {
                    labels:  tipid,
                    datasets: [
                      {
                        label: 'Total Like Count',
                        fill: false,
                        lineTension: 0.1,
                        // backgroundColor: 'rgba(75,192,192,0.4)',
                        // borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: total_like_count,
                      },
                    ],
                  }
             });
             
            
            let totalLikeCat1 = 0;
            let totalLikeCat2 = 0;
            let totalLikeCat3 = 0;
            let totalLikeCat4 = 0;
            let totalLikeCat5 = 0;
            let totalLikeCat6 = 0;

            let totalFollowCat1 = 0;
            let totalFollowCat2 = 0;
            let totalFollowCat3 = 0;
            let totalFollowCat4 = 0;
            let totalFollowCat5 = 0;
            let totalFollowCat6 = 0;
              
            //Category wise Tips Like And Following count
             tips.forEach(                                                             
               ele => {
                  if( ele.category_id == 1 )
                   {
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat1 = totalLikeCat1 + parseInt(ele.total_like_count);

                    totalFollowCat1 = totalFollowCat1 + parseInt(ele.total_complete_count);


                    this.setState({
                      totalLikeCatOne : totalLikeCat1,
                      totalFollowCatOne : totalFollowCat1,
                    })
                    console.log('totalLikeCat1',totalLikeCat1);
                    console.log('totalLikeCatOne',this.state.totalLikeCatOne);
                    console.log('totalFollowCat1',totalFollowCat1);
                    console.log('totalFollowCatOne',this.state.totalFollowCatOne);
                   }
               
                  if( ele.category_id == 2)
                   { 
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat2 = totalLikeCat2 + parseInt(ele.total_like_count);

                    totalFollowCat2 = totalFollowCat2 + parseInt(ele.total_complete_count);
  
                    this.setState({
                      totalLikeCatTwo : totalLikeCat2,
                      totalFollowCatTwo : totalFollowCat2,
                    })
                    console.log('totalLikeCat2',totalLikeCat2);
                    console.log('totalLikeCatTwo',this.state.totalLikeCatTwo);
                    console.log('totalFollowCat2',totalFollowCat2);
                    console.log('totalFollowCatTwo',this.state.totalFollowCatTwo);
                   }

                   if( ele.category_id == 3)
                   { 
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat3 = totalLikeCat3 + parseInt(ele.total_like_count);

                    totalFollowCat3 = totalFollowCat3 + parseInt(ele.total_complete_count);
  
                    this.setState({
                      totalLikeCatThree : totalLikeCat3,
                      totalFollowCatThree : totalFollowCat3,
                    })
                    console.log('totalLikeCat3',totalLikeCat3);
                    console.log('totalLikeCatThree',this.state.totalLikeCatThree);
                    console.log('totalFollowCat3',totalFollowCat3);
                    console.log('totalFollowCatThree',this.state.totalFollowCatThree);
                   }

                   if( ele.category_id == 4)
                   { 
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat4 = totalLikeCat4 + parseInt(ele.total_like_count);

                    totalFollowCat4 = totalFollowCat4 + parseInt(ele.total_complete_count);
  
                    this.setState({
                      totalLikeCatFour : totalLikeCat4,
                      totalFollowCatFour : totalFollowCat4,
                    })
                    console.log('totalLikeCat4',totalLikeCat4);
                    console.log('totalLikeCatFour',this.state.totalLikeCatFour);
                    console.log('totalFollowCat4',totalFollowCat4);
                    console.log('totalFollowCatFour',this.state.totalFollowCatFour);
                   }

                   if( ele.category_id == 5)
                   { 
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat5 = totalLikeCat5 + parseInt(ele.total_like_count);

                    totalFollowCat5 = totalFollowCat5 + parseInt(ele.total_complete_count);
  
                    this.setState({
                      totalLikeCatFive : totalLikeCat5,
                      totalFollowCatFive : totalFollowCat5,
                    })
                    console.log('totalLikeCat5',totalLikeCat5);
                    console.log('totalLikeCatFive',this.state.totalLikeCatFive);
                    console.log('totalFollowCat5',totalFollowCat5);
                    console.log('totalFollowCatFive',this.state.totalFollowCatFive);
                   }

                   if( ele.category_id == 6)
                   { 
                    console.log('total_like_count',ele.total_like_count);
                    console.log('total_complete_count',ele.total_complete_count);

                    totalLikeCat6 = totalLikeCat6 + parseInt(ele.total_like_count);

                    totalFollowCat6 = totalFollowCat6 + parseInt(ele.total_complete_count);
  
                    this.setState({
                      totalLikeCatSix : totalLikeCat6,
                      totalFollowCatSix : totalFollowCat6,
                    })
                    console.log('totalLikeCat6',totalLikeCat6);
                    console.log('totalLikeCatSix',this.state.totalLikeCatSix);
                    console.log('totalFollowCat6',totalFollowCat6);
                    console.log('totalFollowCatSix',this.state.totalFollowCatSix);
                   }
             })
             this.setState({ 
              LikeLine : {
                  labels:  this.state.Category,
                  datasets: [
                    {
                      label: 'Total Like Count',
                      fill: false,
                      lineTension: 0.1,
                      // backgroundColor: 'rgba(75,192,192,0.4)',
                      // borderColor: 'rgba(75,192,192,1)',
                      backgroundColor: 'rgba(255,99,132,0.2)',
                      borderColor: 'rgba(255,99,132,1)',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                      hoverBorderColor: 'rgba(255,99,132,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: [this.state.totalLikeCatOne, this.state.totalLikeCatTwo, this.state.totalLikeCatThree, 
                                this.state.totalLikeCatFour, this.state.totalLikeCatFive, this.state.totalLikeCatSix],
                    },
                  ],
                },
                FollowLine : {
                  labels:  this.state.Category,
                  datasets: [
                    {
                      label: 'Total Follow Count',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: 'rgba(75,192,192,1)',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: [this.state.totalFollowCatOne, this.state.totalFollowCatTwo, this.state.totalFollowCatThree, 
                                this.state.totalFollowCatFour, this.state.totalFollowCatFive, this.state.totalFollowCatSix],
                    },
                  ],
                },
           });
             
          })


          //For Favourite Users Graph
          fetch('https://ecomentor.cloudjiffy.net/admin/getUserActivity' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            const favourite = findresponse.data;

            let totalFavouriteCat1 = 0;
            let totalFavouriteCat2 = 0;
            let totalFavouriteCat3 = 0;
            let totalFavouriteCat4 = 0;
            let totalFavouriteCat5 = 0;
            let totalFavouriteCat6 = 0;
           

            favourite.forEach(element => {
              if( element.tips_category_id == 1 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat1 = totalFavouriteCat1 + 1;

                this.setState({
                  totalFavouriteCatOne : totalFavouriteCat1,
                })
                console.log('totalFavouriteCat1',totalFavouriteCat1);
                console.log('totalFavouriteCatOne',this.state.totalFavouriteCatOne);
              }

              if( element.tips_category_id == 2 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat2 = totalFavouriteCat2 + 1;

                this.setState({
                  totalFavouriteCatTwo : totalFavouriteCat2,
                })
                console.log('totalFavouriteCat2',totalFavouriteCat2);
                console.log('totalFavouriteCatTwo',this.state.totalFavouriteCatTwo);
              }

              if( element.tips_category_id == 3 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat3 = totalFavouriteCat3 + 1;

                this.setState({
                  totalFavouriteCatThree : totalFavouriteCat3,
                })
                console.log('totalFavouriteCat3',totalFavouriteCat3);
                console.log('totalFavouriteCatThree',this.state.totalFavouriteCatThree);
              }

              if( element.tips_category_id == 4 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat4 = totalFavouriteCat4 + 1;

                this.setState({
                  totalFavouriteCatFour : totalFavouriteCat4,
                })
                console.log('totalFavouriteCat4',totalFavouriteCat4);
                console.log('totalFavouriteCatFour',this.state.totalFavouriteCatFour);
              }

              if( element.tips_category_id == 5 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat5 = totalFavouriteCat5 + 1;

                this.setState({
                  totalFavouriteCatFive : totalFavouriteCat5,
                })
                console.log('totalFavouriteCat5',totalFavouriteCat5);
                console.log('totalFavouriteCatFive',this.state.totalFavouriteCatFive);
              }

              if( element.tips_category_id == 6 && element.fev_tip == "Yes")
              {
                console.log('tips_category_id',element.tips_category_id);
                console.log('fev_tip',element.fev_tip);

                totalFavouriteCat6 = totalFavouriteCat6 + 1;

                this.setState({
                  totalFavouriteCatSix : totalFavouriteCat6,
                })
                console.log('totalFavouriteCat6',totalFavouriteCat6);
                console.log('totalFavouriteCatSix',this.state.totalFavouriteCatSix);
              }

            })
          
            this.setState({ 
              FavouriteLine : {
                  labels:  this.state.Category,
                  datasets: [
                    {
                      label: 'Favourite Tips',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: 'rgba(75,192,192,1)',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: [this.state.totalFavouriteCatOne, this.state.totalFavouriteCatTwo, 
                              this.state.totalFavouriteCatThree, this.state.totalFavouriteCatFour, 
                              this.state.totalFavouriteCatFive, this.state.totalFavouriteCatSix ],
                    },
                  ],
                }
           });


          })


          //City Wise Users Graph
          fetch('https://ecomentor.cloudjiffy.net/admin/getUserList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            const userProfile = findresponse.data;


            let totalCity1 = 0;
            let totalCity2 = 0;
            let totalCity3 = 0;
            let totalCity4 = 0;
            let totalCity5 = 0;
            let totalCity6 = 0;

            userProfile.forEach(element => {
              if( element.city == "Pune" )
               {
                console.log('city',element.city); 
                totalCity1 = totalCity1 + 1;

                this.setState({
                  totalCityOne : totalCity1,
                })
                console.log('totalCity1',totalCity1);
                console.log('totalCityOne',this.state.totalCityOne);
               }

               if( element.city == "Mumbai" )
               {
                console.log('city',element.city);
                totalCity2 = totalCity2 + 1;

                this.setState({
                  totalCityTwo : totalCity2,
                })
                console.log('totalCity2',totalCity2);
                console.log('totalCityTwo',this.state.totalCityTwo);
               }

               if( element.city == "Delhi" )
               {
                console.log('city',element.city);              
                totalCity3 = totalCity3 + 1;

                this.setState({
                  totalCityThree : totalCity3,
                })
                console.log('totalCity3',totalCity3);
                console.log('totalCityThree',this.state.totalCityThree);
               }

               if( element.city == "Solapur" )
               {
                console.log('city',element.city);              
                totalCity4 = totalCity4 + 1;

                this.setState({
                  totalCityFour : totalCity4,
                })
                console.log('totalCity4',totalCity4);
                console.log('totalCityFour',this.state.totalCityFour);
               }

               if( element.city == "Nagpur" )
               {
                console.log('city',element.city);              
                totalCity5 = totalCity5 + 1;

                this.setState({
                  totalCityFive : totalCity5,
                })
                console.log('totalCity5',totalCity5);
                console.log('totalCityFive',this.state.totalCityFive);
               }

               if( element.city == "Latur" )
               {
                console.log('city',element.city);              
                totalCity6 = totalCity6 + 1;

                this.setState({
                  totalCitySix : totalCity6,
                })
                console.log('totalCity6',totalCity6);
                console.log('totalCitySix',this.state.totalCitySix);
               }
              })

              this.setState({ 
                UsersCity : {
                    labels:  this.state.UserCity,
                    datasets: [
                      {
                        label: 'City Wise Users',
                        fill: false,
                        lineTension: 0.1,
                        // backgroundColor: 'rgba(75,192,192,0.4)',
                        // borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [this.state.totalCityOne, this.state.totalCityTwo, this.state.totalCityThree,
                                  this.state.totalCityFour, this.state.totalCityFive, this.state.totalCitySix],
                      },
                    ],
                  }
             });

          })
   
      }

       

    render() { 
        
          return(
            <div>
             <CardColumns className="cols-2">
              <Card>
                <CardHeader>
                  Total Like Count Categorywise
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Bar data={this.state.LikeLine} options={options} />
                  </div>
                </CardBody>
              </Card>
             </CardColumns>

             <CardColumns className="cols-2">
              <Card>
                <CardHeader>
                   Total Followers For Categorywise Tips
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Bar data={this.state.FollowLine} options={options} />
                  </div>
                </CardBody>
              </Card>
             </CardColumns>

             <CardColumns className="cols-2">
              <Card>
                <CardHeader>
                  City Wise Users Count
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Bar data={this.state.UsersCity} options={options} />
                  </div>
                </CardBody>
              </Card>
             </CardColumns>

             <CardColumns className="cols-2">
              <Card>
                <CardHeader>
                  Favourite Tips
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Bar data={this.state.FavouriteLine} options={options} />
                  </div>
                </CardBody>
              </Card>
             </CardColumns>

             <CardColumns className="cols-2">
              <Card>
                <CardHeader>
                  Top Three Tips
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Pie data={this.state.TopThree} options={options} />
                  </div>
                </CardBody>
              </Card>
             </CardColumns>


            {/* Overall Tips Like Count */}
              {/* <CardColumns className="cols-2"> */}
              {/* <Card>
                <CardHeader>
                  Total Like Count
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Bar data={this.state.line} options={options} />
                  </div>
                </CardBody>
              </Card> */}
             {/* </CardColumns> */}

             </div>
              );
    }
}
 
export default Graph2;



 