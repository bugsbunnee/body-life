import React from 'react';
import { Body, Container, Column, Head, Heading, Html, Img, Preview, Row, Section, Text } from '@react-email/components';
import { FRONTEND_BASE_URL } from '../../utils/constants';

interface Props {
   userFirstName: string;
   loginDate: string;
}

const RecentLoginEmail: React.FC<Props> = ({ userFirstName, loginDate }: Props) => {
   return (
      <Html>
         <Head />

         <Preview>Recent login</Preview>

         <Body style={main}>
            <Container>
               <Section style={logo}>
                  <Img src={FRONTEND_BASE_URL + '/images/logo.png'} width="97" height="57" alt="RCNLagos Island Church" className="object-contain" />
               </Section>

               <Section style={content}>
                  <Row>
                     <Img style={image} width={620} src={FRONTEND_BASE_URL + '/images/login.png'} />
                  </Row>

                  <Row style={{ ...boxInfos, paddingBottom: '0' }}>
                     <Column>
                        <Heading style={greeting}>Hi {userFirstName},</Heading>

                        <Heading as="h2" style={body}>
                           We noticed a recent login to your account.
                        </Heading>

                        <Text style={paragraph}>
                           <b>Time: </b>
                           {loginDate}
                        </Text>

                        <Text style={paragraph}>If this was you, there's nothing else you need to do.</Text>

                        <Text style={paragraphWithMargin}>If this wasn't you or if you have additional questions, please see our support page.</Text>
                     </Column>
                  </Row>
               </Section>

               <Text style={address}>© {new Date().getFullYear()} | Citilodge Hotel, 1 Akinyemi Avenue, Off Goshen Estate Road, By Elf Bus Stop, Lekki, Lagos</Text>
            </Container>
         </Body>
      </Html>
   );
};

const address = {
   textAlign: 'center' as const,
   fontSize: 12,
   color: 'rgb(0,0,0, 0.7)',
};

const body = {
   fontSize: 26,
   fontWeight: 'bold',
   textAlign: 'center' as const,
};

const boxInfos = {
   padding: '20px',
};

const containerImageFooter = {
   padding: '45px 0 0 0',
};

const content = {
   border: '1px solid rgb(0,0,0, 0.1)',
   borderRadius: '3px',
   overflow: 'hidden',
};

const greeting = {
   fontSize: 32,
   fontWeight: 'bold',
   textAlign: 'center' as const,
};

const image = {
   maxWidth: '100%',
};

const logo = {
   padding: '30px 20px',
};

const main = {
   backgroundColor: '#fff',
   fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
   fontSize: 16,
};

const paragraphWithMargin = {
   ...paragraph,
   marginTop: -5,
};

export default RecentLoginEmail;
