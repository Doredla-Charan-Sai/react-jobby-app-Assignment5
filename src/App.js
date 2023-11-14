import {Switch, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import NotFound from './NotFound'
import Login from './Login'
import Home from './Home'
import Jobs from './Jobs'
import JobItemDetails from './JobItemDetails'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
      <Route component={NotFound} />
    </Switch>
  </>
)

export default App
