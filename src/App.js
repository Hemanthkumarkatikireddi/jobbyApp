// These are the lists used in the application. You can move them to any component needed.
// const employmentTypesList = [
//   {
//     label: 'Full Time',
//     employmentTypeId: 'FULLTIME',
//   },
//   {
//     label: 'Part Time',
//     employmentTypeId: 'PARTTIME',
//   },
//   {
//     label: 'Freelance',
//     employmentTypeId: 'FREELANCE',
//   },
//   {
//     label: 'Internship',
//     employmentTypeId: 'INTERNSHIP',
//   },
// ]

// const salaryRangesList = [
//   {
//     salaryRangeId: '1000000',
//     label: '10 LPA and above',
//   },
//   {
//     salaryRangeId: '2000000',
//     label: '20 LPA and above',
//   },
//   {
//     salaryRangeId: '3000000',
//     label: '30 LPA and above',
//   },
//   {
//     salaryRangeId: '4000000',
//     label: '40 LPA and above',
//   },
// ]

// Replace your code here
import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './Components/ProtectedRoute'
import LoginForm from './Components/Login'
import Home from './Components/Home'
import AllJobs from './Components/AllJobs'
import AboutJobItem from './Components/AboutJobItem'
import NotFound from './Components/NotFound'
// import SimilarJobs from './Components/SimilarJobs'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/allJobs" component={AllJobs} />
    <ProtectedRoute exact path="/AboutJobItem/:id" component={AboutJobItem} />
    <NotFound exact path="/notFound" component={NotFound} />
    <Redirect to="/notFound" />
  </Switch>
)

export default App
