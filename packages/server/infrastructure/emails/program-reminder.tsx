import React from 'react';

import { formatDate } from 'date-fns';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import { CHURCH_DISPLAY_NAME, FRONTEND_BASE_URL } from '../../utils/constants';

import type { IProgram } from '../database/models/program.model';

interface Props {
   userId: string;
   userFirstName: string;
   program: IProgram;
}

const ProgramReminderEmail: React.FC<Props> = ({ userId, userFirstName, program }) => {
   return (
      <Html>
         <Head />

         <Preview>Upcoming Meeting at {CHURCH_DISPLAY_NAME}</Preview>

         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               <Section style={logoStyle}>
                  <Img src={FRONTEND_BASE_URL + '/images/logo.png'} width="97" height="57" alt="RCNLagos Island Church" className="object-contain" />
               </Section>

               <Section style={centerText}>
                  <Text style={previewStyle}>Upcoming Meeting at {CHURCH_DISPLAY_NAME}</Text>
               </Section>

               <Hr style={primaryDividerStyle} />

               <Section style={scriptureSection}>
                  <Text style={scriptureText}>Striving for the rebirth of apostolic Christianity, preaching, praying and prophesying until revival comes.</Text>
               </Section>

               <Hr style={alternateDividerStyle} />

               <Section>
                  <Heading style={wordHeaderText}>Hello {userFirstName},</Heading>
                  <Text style={wordBodyText}>
                     We’re excited to remind you about an upcoming church meeting, and we would truly love for you to be part of it! This gathering is a wonderful opportunity to
                     grow in faith, connect with others, and experience God’s presence in a special way.
                  </Text>
               </Section>

               <Hr style={alternateDividerStyle} />

               <Section>
                  <Heading style={announcementSectionLabel}>Upcoming Meeting</Heading>

                  <Section style={announcementContainer}>
                     <Img src={program.imageUrl} alt={program.title} width="100%" height="220" style={announcementImage} />

                     <Section style={announcementDetails}>
                        <Heading style={announcementTitle}>{program.title}</Heading>

                        <Text style={announcementBody}>{program.description.substring(0, 150) + '...'}</Text>

                        <Section style={marginTop}>
                           <Text style={announcementAddress}>📍 {program.address}</Text>

                           <Text style={announcementAddress}>🗓 {formatDate(program.scheduledFor, 'PPP')}</Text>

                           <Text style={wordBodyText}>We encourage you to come expectant and invite someone along. It’s going to be a blessed time together! ✨</Text>
                        </Section>
                     </Section>
                  </Section>
               </Section>

               <Hr style={alternateDividerStyle} />

               <Section style={footerSection}>
                  <Text style={stayConnectedText}>Stay connected with us</Text>

                  <Section>
                     <Link href="https://www.instagram.com/images/instagram.jpg" style={socialLinkURL}>
                        <Img src={FRONTEND_BASE_URL + '/images/instagram.jpg'} width="36" height="36" alt="Instagram" style={socialLinkImage} />
                     </Link>

                     <Link href="https://web.facebook.com/profile.php?id=61553792941216" style={socialLinkURL}>
                        <Img src={FRONTEND_BASE_URL + '/images/facebook.jpg'} width="36" height="36" alt="Facebook" style={socialLinkImage} />
                     </Link>

                     <Link href="https://www.youtube.com/@rcnlagosisland" style={socialLinkURL}>
                        <Img src={FRONTEND_BASE_URL + '/images/youtube.png'} width="36" height="36" alt="YouTube" style={socialLinkImage} />
                     </Link>
                  </Section>
               </Section>

               <Section style={centerText}>
                  <Text style={salutationName}>© {new Date().getFullYear()} RCNLagos Island Church</Text>

                  <Text style={salutationName}>
                     You are receiving this email because you provided us your email address to keep in touch. Want to change how you receive these emails?
                  </Text>

                  <Text style={unsubscribeTextMain}>
                     <Link href={FRONTEND_BASE_URL + '/unsubscribe?id=' + userId} style={unsubscribeText}>
                        Unsubscribe
                     </Link>
                  </Text>
               </Section>
            </Container>
         </Body>
      </Html>
   );
};

const announcementContainer = {
   borderRadius: '16px',
   overflow: 'hidden',
   marginBottom: '26px',
   backgroundColor: '#fff1e6',
};

const marginTop = { marginTop: '16px' };

const announcementDetails = { padding: '20px 20px' };

const announcementImage = { objectFit: 'cover' as const, display: 'block' };

const announcementSectionLabel = {
   fontSize: '20px',
   fontWeight: 600,
   color: '#2a1f16',
   marginBottom: '22px',
};

const announcementTitle = {
   fontSize: '18px',
   fontWeight: 600,
   color: '#2a1f16',
   margin: '0 0 6px',
};

const announcementBody = {
   fontSize: '14px',
   lineHeight: '1.7',
   color: '#5f4b3a',
   margin: 0,
};

const announcementAddress = {
   fontSize: '14px',
   lineHeight: '1.7',
   color: '#5f4b3a',
   margin: 0,
};

const bodyStyle = {
   backgroundColor: '#fff5ec',
   margin: 0,
   padding: '40px 0',
   fontFamily: 'Helvetica, Arial, sans-serif',
};

const centerText = { textAlign: 'center' as const };

const containerStyle = {
   maxWidth: '560px',
   margin: '0 auto',
   backgroundColor: '#ffffff',
   padding: '42px 36px',
};

const logoStyle = {
   marginBottom: '24px',
};

const previewStyle = {
   fontSize: '11px',
   letterSpacing: '4px',
   textTransform: 'uppercase' as const,
   color: '#d97706',
};

const primaryDividerStyle = {
   border: 'none',
   borderTop: '1px solid #f3d5c0',
   width: '100%',
   marginBottom: '24px',
};

const alternateDividerStyle = {
   border: 'none',
   borderTop: '1px solid #f3d5c0',
   width: '100%',
   margin: '24px 0',
};

const scriptureSection = {
   backgroundColor: '#fff1e6',
   borderRadius: '14px',
   padding: '28px 24px',
   textAlign: 'center' as const,
};

const scriptureText = {
   fontSize: '18px',
   lineHeight: '1.7',
   fontStyle: 'italic',
   color: '#3b2a1a',
   margin: 0,
};

const wordHeaderText = {
   fontSize: '20px',
   fontWeight: 600,
   color: '#2a1f16',
   marginBottom: '12px',
   textTransform: 'capitalize' as const,
};

const wordBodyText = {
   fontSize: '15px',
   lineHeight: '1.8',
   color: '#5f4b3a',
};

const socialLinkURL = { margin: '0 6px', display: 'inline-block' };

const socialLinkImage = {
   backgroundColor: '#fff1e6',
   borderRadius: '10px',
   padding: '6px',
};

const salutationName = {
   fontSize: '12px',
   color: '#a0836d',
   marginBottom: '8px',
};

const stayConnectedText = {
   fontSize: '13px',
   color: '#8a6d5a',
   marginBottom: '14px',
};

const footerSection = { textAlign: 'center' as const, marginBottom: '18px' };

const unsubscribeText = { color: '#a0836d', textDecoration: 'underline' };

const unsubscribeTextMain = { fontSize: '12px' };

export default ProgramReminderEmail;
