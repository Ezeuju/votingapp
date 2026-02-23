import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Screens/Home';
import Rules from './COMPONENTS/Rules';
import TicketPage from './Screens/TicketPage';
import Contestants from './Screens/Contestants';
import AuditionRegistration from './Screens/AuditionRegistration';
import Sponsors from './Screens/Sponsors';
import Send from './Screens/Send';
import Donate from "./Screens/Donate"
import Mentors from './Screens/Mentors';
import Faq from './Screens/Faq';
import Join from './Screens/Join';
import Gallery from './Screens/Gallery';
import Privacy from './Screens/Privacy';
import PaymentResult from './COMPONENTS/PaymentResult'; 
import Dashboard from './COMPONENTS/DashboardScreens/Dashboard';
import PublicProfile from './Screens/PublicProfile';
import Sponsor from "./Screens/Sponsor";
import Contact from './COMPONENTS/Contact';
import Timeline from "./Screens/Timeline"
import AdminAuth from './COMPONENTS/AdminAuth/AdminAuth';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/rules' element={<Rules/>}/>
        <Route path='/tickets' element={<TicketPage/>}/>
        <Route path='/contestants' element={<Contestants/>}/>
        <Route path='/sponsors' element={<Sponsors/>}/>
        <Route path='/send' element={<Send/>}/>
        <Route path='/donate' element={<Donate/>}/>
        <Route path='/mentors' element={<Mentors/>}/>
        <Route path="/auditiony" element={<AuditionRegistration />} />
        <Route path="/join" element={<Join />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/PaymentResult" element={<PaymentResult />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/PublicProfile" element={<PublicProfile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/sponsor" element={<Sponsor />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/auth" element={<AdminAuth />} />





      </Routes>
    </div>
  );
}


export default App;
