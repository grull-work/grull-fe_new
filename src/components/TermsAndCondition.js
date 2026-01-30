import React from 'react'
import "../styles/TermsAndConditions.css"
import { Grid } from '@mui/material'
import { shades } from '../helper/shades';

export default function TermsAndCondition() {
  const { dustyOrange } = shades;
  
  return (
    <Grid
    sx={{
      height:"100%",
      width: "100%",
      background: dustyOrange,
      padding: { xs: "36px 24px", md: "50px 32px 32px 32px" },
    }}
  >

    <div className='body'>
         <div className="text-black">
      <div className="ms-20 me-20 mb-40 mt-10 mx-auto">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions for Grull Technologies Pvt Ltd</h1>

        <p>{`Last Updated: 21-02-2024`}</p>
        <p className="mb-8">{`Welcome to Grull Technologies Pvt Ltd, a service provided by Grull Technologies ("Company", "we", "us", or "our"), registered at PROP- SANJAY GUPTA 22-A ASAF ALI ROAD DELHI 110002. These Terms and Conditions ("Terms") govern your use of the Grull Technologies Pvt Ltd website and its associated services (collectively, the "Service").`}</p>

        <h2 className="text-xl font-bold mb-4">Acceptance of Terms</h2>
            <p className="mb-8">{`By accessing or using our Service, you confirm that you have read, understood, and agree to be bound by these Terms, including any additional terms and conditions and policies referenced herein. If you do not agree to these Terms, you are not authorized to use the Service.`}</p>
        
        <h2 className="text-xl font-bold mb-4">Service Description</h2>
        <p className="mb-8">{`Grull Technologies Pvt Ltd offers an AI-powered tool that summarizes email content, providing users with concise updates. The Service is subject to scheduled maintenance, updates, and enhancements, all aimed at improving user experience.`}</p>

        <h2 className="text-xl font-bold mb-4">User Accounts</h2>
        <p className="mb-8">{`To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.`}</p>

        <h2 className="text-xl font-bold mb-4">User Conduct</h2>
        <p className="mb-8">{`You agree not to use the Service to:`}</p>
        <ul style={{ paddingLeft: '1.25rem' }} className="mb-8">
          <li>{`Conduct any unlawful activity.`}</li>
          <li>{`Violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.`}</li>
          <li>{`Infringe upon or violate our intellectual property rights or the intellectual property rights of others.`}</li>
        </ul>

        <h2 className="text-xl font-bold mb-4">Intellectual Property</h2>
        <p className="mb-8">{`The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of the Company and its licensors.`}</p>

        <h2 className="text-xl font-bold mb-4">Third-Party Links</h2>
        <p className="mb-8">{`The Service may contain links to third-party websites that are not owned or controlled by the Company. We assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.`}</p>

        <h2 className="text-xl font-bold mb-4">Termination</h2>
        <p className="mb-8">{`We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach the Terms.`}</p>

        <h2 className="text-xl font-bold mb-4">Indemnification</h2>
        <p className="mb-8">{`You agree to indemnify and hold harmless the Company, its affiliates, and their respective directors, officers, employees, and agents from any and all claims, damages, obligations, losses, liabilities, costs, debts, and expenses arising from your use of the Service.`}</p>

        <h2 className="text-xl font-bold mb-4">Limitation of Liability</h2>
        <p className="mb-8">{`In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.`}</p>

        <h2 className="text-xl font-bold mb-4">Governing Law</h2>
        <p className="mb-8">{`These Terms shall be governed by the laws of the India, without regard to its conflict of law provisions.`}</p>
        
        <h2 className="text-xl font-bold mb-4">Changes to Terms</h2>
        <p className="mb-8">{`We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on the Service.`}</p>

        <h2 className="text-xl font-bold mt-8">Contact Us</h2>
        <p className="text-black">{`For any questions about these Terms, please contact us at`} <a href="mailto:grull.official@gmail.com" className="text-black">grull.official@gmail.com</a>.</p>
      </div>
  
    </div>
    </div>
    </Grid>

  )
}
