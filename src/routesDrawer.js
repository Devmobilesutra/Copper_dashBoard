import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Category = React.lazy(() => import('./views/Category/AddCategory'));
const Activity = React.lazy(() => import('./views/Activity/AddActivity'));
const Tip = React.lazy(() => import('./views/Tip/AddTip'));
const News = React.lazy(() => import('./views/News/AddNews'));
const UserList = React.lazy(() => import('./views/UserList/UserList'));
const FeedbackList = React.lazy(() => import('./views/Feedback/FeedbackList'));
const AddDailyWeeklyTip = React.lazy(() => import('./views/DailyWeeklyTip/AddDailyWeeklyTip'));
const AddDaily = React.lazy(() => import('./views/DailyWeeklyTip/AddDaily'));
const AddWeekly = React.lazy(() => import('./views/DailyWeeklyTip/AddWeekly'));
const Graphs = React.lazy(() => import('./views/Graphs/Graphs'));
const Graphs2 = React.lazy(() => import('./views/Graphs/Graphs2'));

const routesDrawer = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/addCategory', name: 'Category', component: Category },
    { path: '/addActivity', name: 'Activity', component: Activity },
    { path: '/addTip', name: 'Tip', component: Tip },
    { path: '/addNews', name: 'News', component: News },
    { path: '/userList', name: 'UserList', component: UserList },
    { path: '/feedbackList', name: 'FeedbackList', component: FeedbackList },
    { path: '/dailyWeeklyTip', name: 'DailyWeeklyTip', component: AddDailyWeeklyTip},
    { path: '/AddDaily', name: 'DailyTip', component: AddDaily},
    { path: '/AddWeekly', name: 'WeeklyTip', component: AddWeekly},
    { path: '/Graphs', name: 'Graphs', component: Graphs},
    { path: '/Graphs2', name: 'Graphs2', component: Graphs2}
    
];

export default routesDrawer;