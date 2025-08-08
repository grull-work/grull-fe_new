import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App.tsx";
import Start from "../components/Start";
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import FreelancerProfile from '../components/FreelancerProfile';
import EmployerProfile from '../components/EmployerProfile';
import PostJob from '../components/PostJob';
import ApplyProposal from '../components/ApplyProposal';
import BrowseFreelancer from '../components/BrowseFreelancer';
import BrowseJobs from '../components/BrowseJobs';
import JobDetails from '../components/JobDetails';
import PaymentByClient from '../components/PaymentByClient';
import FreelancerDashboard from '../components/FreelancerDashboard';
import FreelancerManagerJobs from '../components/FreelancerManageJobs';
import ClientDashboard from '../components/ClientDashboard';
import ClientManageJobs from '../components/ClientManageJobs';
import JobApplications from '../components/EmployerjobApplication';
import Transactions from "../components/Transactions";
import CommonWallet from "../components/CommonWallet";
import Clientchat from "../components/ClientChat"
import Freelancerchat from "../components/Freelancerchat";
import Loading from "../components/Loading";
// import Freelancerchat from 
import TermsAndCondition from "../components/TermsAndCondition"
import Policies from "../components/Policies"
import CancellationPolicy from '../components/CancellationPolicy.js'
import ComingSoon from "../comingSoonPage/ComingSoon.tsx";
import AboutUs from "../components/AboutUs.js";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// import GoogleAuth from "../components/GoogleAuth.js";
import FreelancerProfileShare from "../components/FreelancerProfileShare.js";
import EmployerprofileShare from "../components/ClientProfileShare.js";
import Freelancerwallet from "../components/Freelancerwallet.js";
import FreelancerWalletPage from "../components/FreelancerWalletPage.js";
import AddBalance from "../components/AddBalance.js";
// import PaymentRazorpay from "../components/PaymentRazorpay.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function PageRoute() {
     return (
       <BrowserRouter>
       <ScrollToTop /> 
         <Routes>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/:userType" element={<SignUp />} />
            <Route path="/freelancerprofile" element={<FreelancerProfile/>}/>
            <Route path="/clientprofile" element={<EmployerProfile/>}/>
            <Route path="/postjob" element={<PostJob/>}/>
            <Route path="/applyproposal/:jobid" element={<ApplyProposal/>}/>
            <Route path="/browsefreelancer" element={<BrowseFreelancer/>}/>
            <Route path="/browsejobs" element={<BrowseJobs/>}/>
            <Route path="/jobdetails/:jobid" element={<JobDetails/>}/>
            <Route path="/freelancer/*" element={<FreelancerDashboard/>}/>
            <Route path="/managejobs/:section" element={<FreelancerManagerJobs/>}/>
            <Route path="/client/*" element={<ClientDashboard />} />
            <Route path="/clientmanagejobs/:section" element={<ClientManageJobs />} />
            <Route path="/jobapplications/:jobid" element={<JobApplications />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/freelancerchat" element ={<Freelancerchat/>} />
            <Route path="/commonwallet" element={<CommonWallet />} /> 
            <Route path="/clientchat" element={<Clientchat />} />
            <Route path="/loading" element={<Loading />} />
            <Route path='/terms-and-conditions' element={<TermsAndCondition/>}/>
            <Route path='/policies' element={<Policies/>}/>
            <Route path='/cancellation-policies' element={<CancellationPolicy/>}/>
            <Route path='/coming-soon' element={<ComingSoon/>}/>
            <Route path='/about-us' element={<AboutUs/>}/>
            {/* <Route path="/google" element={<GoogleAuth />} /> */}
            <Route path="/freelancer/profile/:userid" element={<FreelancerProfileShare />}/>
            <Route path="/client/profile/:userid" element={<EmployerprofileShare />}/>
            <Route path="/client-transactions" element={<PaymentByClient />} />
            <Route path="/addbalance" element={<AddBalance />} />
            {/* <Route path="/payment/razorpay" element={<PaymentRazorpay />} /> */}
         </Routes>
 
       </BrowserRouter>
     )
}
