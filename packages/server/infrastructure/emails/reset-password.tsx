import React from 'react';
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';

interface Props {
   userFirstName: string;
   verificationUrl: string;
   expiryTimeInMinutes: number;
}

const SetupPasswordEmail: React.FC<Props> = ({ userFirstName, verificationUrl, expiryTimeInMinutes }) => (
   <Html>
      <Head />

      <Preview>Welcome to Body Life!</Preview>

      <Body style={main}>
         <Container style={container}>
            <Section style={box}>
               <Img src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1733581974/dulux_kbafe5.png" width="49" height="21" alt="Stripe" />

               <Hr style={hr} />

               <Heading style={greeting}>Welcome to Body Life, {userFirstName}!</Heading>

               <Text style={paragraph}>Your account has been created on the platform. Kindly follow the url below to setup your password.</Text>

               <Button style={button} href={verificationUrl}>
                  Setup Password
               </Button>

               <Text style={validityText}>(This code is valid for {expiryTimeInMinutes} minutes)</Text>

               <Hr style={hr} />

               <Text style={paragraph}>— The RCNLagos Island Support Team</Text>

               <Hr style={hr} />

               <Text style={footer}>© {new Date().getFullYear()} | Citilodge Hotel, 1 Akinyemi Avenue, Off Goshen Estate Road, By Elf Bus Stop, Lekki, Lagos</Text>
            </Section>
         </Container>
      </Body>
   </Html>
);

const container = {
   backgroundColor: '#ffffff',
   margin: '0 auto',
   padding: '20px 0 48px',
   marginBottom: '64px',
};

const box = {
   padding: '0 48px',
};

const hr = {
   borderColor: '#e6ebf1',
   margin: '20px 0',
};

const button = {
   backgroundColor: '#656ee8',
   borderRadius: '5px',
   color: '#fff',
   fontSize: '16px',
   fontWeight: 'bold',
   textDecoration: 'none',
   textAlign: 'center' as const,
   display: 'block',
   width: '100%',
   padding: '10px',
};

const footer = {
   color: '#8898aa',
   fontSize: '12px',
   lineHeight: '16px',
};

const greeting = {
   textAlign: 'left' as const,
   lineHeight: '24px',
   margin: '16px 0',
};

const main = {
   backgroundColor: '#f6f9fc',
   fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const verificationText = {
   color: '#525f7f',
   fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
   fontSize: '14px',
   margin: '24px 0',
};

const paragraph = {
   color: '#525f7f',
   fontSize: '16px',
   lineHeight: '24px',
   textAlign: 'left' as const,
};

const validityText = {
   ...verificationText,
   margin: '0px',
   textAlign: 'center' as const,
};

export default SetupPasswordEmail;
