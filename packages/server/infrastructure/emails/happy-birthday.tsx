import React from 'react';
import { Body, Column, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text, Row } from '@react-email/components';

interface Props {
   userFirstName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourchurch.org';

const HappyBirthdayEmail: React.FC<Props> = ({ userFirstName }) => (
   <Html>
      <Head />
      <Preview>🎉 Happy Birthday, {userFirstName}! You are loved.</Preview>

      <Body style={main}>
         <Container style={container}>
            <Section style={logo}>
               <Img width={140} src={`${baseUrl}/static/church-logo.png`} alt="Church Logo" />
            </Section>

            <Section style={header}>
               <Row>
                  <Column style={headerContent}>
                     <Heading style={headerContentTitle}>Happy Birthday, {userFirstName}! 🎂</Heading>
                     <Text style={headerContentSubtitle}>Celebrating you today</Text>
                  </Column>

                  <Column style={headerImageContainer}>
                     <Img style={headerImage} width={280} src={`${baseUrl}/static/birthday-cross.png`} alt="Birthday celebration" />
                  </Column>
               </Row>
            </Section>

            <Section style={content}>
               <Heading as="h2" style={title}>
                  A Birthday Blessing
               </Heading>

               <Text style={paragraph}>
                  Dear {userFirstName},
                  <br />
                  Today, we thank God for your life and celebrate the gift that you are to our church family. We pray that this new year brings you deeper joy, renewed strength,
                  and fresh grace in every area of your life.
               </Text>

               <Hr style={divider} />

               <Text style={scripture}>
                  “The Lord bless you and keep you; the Lord make His face shine on you and be gracious to you.”
                  <br />— Numbers 6:24–26
               </Text>

               <Hr style={divider} />

               <Text style={paragraph}>Please know that you are loved, prayed for, and appreciated. May God continue to guide your steps and fill your days with His peace.</Text>

               <Text style={closing}>
                  With love,
                  <br />
                  <strong>Your Church Family</strong>
               </Text>
            </Section>
         </Container>

         <Section style={footer}>
            <Text style={footerText}>You are receiving this email because you are part of our church community.</Text>

            <Hr style={footerDivider} />

            <Text style={footerAddress}>
               <strong>RCNLagos Island Church</strong> | Citilodge Hotel, 1 Akinyemi Avenue, Off Goshen Estate Road, By Elf Bus Stop, Lekki, Lagos
            </Text>
         </Section>
      </Body>
   </Html>
);

const main = {
   backgroundColor: '#f3f3f5',
   fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const headerContent = {
   padding: '20px 30px 15px',
};

const headerContentTitle = {
   color: '#fff',
   fontSize: '27px',
   fontWeight: 'bold',
   lineHeight: '27px',
};

const headerContentSubtitle = {
   color: '#fff',
   fontSize: '17px',
};

const headerImageContainer = {
   padding: '30px 10px',
};

const headerImage = {
   maxWidth: '100%',
};

const title = {
   margin: '0 0 15px',
   fontWeight: 'bold',
   fontSize: '21px',
   lineHeight: '21px',
   color: '#0c0d0e',
};

const paragraph = {
   fontSize: '15px',
   lineHeight: '21px',
   color: '#3c3f44',
};

const divider = {
   margin: '30px 0',
};

const container = {
   width: '680px',
   maxWidth: '100%',
   margin: '0 auto',
   backgroundColor: '#ffffff',
};

const footer = {
   width: '680px',
   maxWidth: '100%',
   margin: '32px auto 0 auto',
   padding: '0 30px',
};

const content = {
   padding: '30px 30px 40px 30px',
};

const logo = {
   display: 'flex',
   background: '#f3f3f5',
   padding: '20px 30px',
};

const header = {
   borderRadius: '5px 5px 0 0',
   display: 'flex',
   flexDireciont: 'column',
   backgroundColor: '#2b2d6e',
};

const buttonContainer = {
   marginTop: '24px',
   display: 'block',
};

const button = {
   backgroundColor: '#0095ff',
   border: '1px solid #0077cc',
   fontSize: '17px',
   lineHeight: '17px',
   padding: '13px 17px',
   borderRadius: '4px',
   maxWidth: '120px',
   color: '#fff',
};

const footerDivider = {
   ...divider,
   borderColor: '#d6d8db',
};

const footerText = {
   fontSize: '12px',
   lineHeight: '15px',
   color: '#9199a1',
   margin: '0',
};

const footerAddress = {
   margin: '4px 0',
   fontSize: '12px',
   lineHeight: '15px',
   color: '#9199a1',
};

const scripture = {
   fontSize: '15px',
   lineHeight: '22px',
   fontStyle: 'italic',
   color: '#2b2d6e',
   textAlign: 'center' as const,
};

const closing = {
   marginTop: '24px',
   fontSize: '15px',
   lineHeight: '21px',
   color: '#3c3f44',
};

export default HappyBirthdayEmail;
