import React from 'react';
import parse from 'html-react-parser';

import { format } from 'date-fns';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import { FRONTEND_BASE_URL } from '../../utils/constants';

import type { IWeeklyReview } from '../database/models/weekly-review.model';

interface Props {
   departmentName: string;
   formattedServiceDate: string;
   weeklyReview: IWeeklyReview;
}

const WeeklyReviewEmail: React.FC<Props> = ({ departmentName, formattedServiceDate, weeklyReview }) => {
   return (
      <Html>
         <Head />
         <Preview>Weekly Church Review</Preview>

         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               <Section style={logoStyle}>
                  <Img src={FRONTEND_BASE_URL + '/images/logo.png'} width="97" height="57" alt="RCNLagos Island Church" className="object-contain" />
               </Section>

               <Section style={centerText}>
                  <Text style={previewStyle}>Church Weekly Report for ${departmentName}</Text>
               </Section>

               <Hr style={primaryDividerStyle} />

               <Hr style={alternateDividerStyle} />

               <Section>
                  <Heading style={wordHeaderText}>Hello,</Heading>
                  <Text style={wordBodyText}>
                     The {departmentName} has uploaded a weekly service review summary. Please take note of any feedback and action items from the week.
                  </Text>
               </Section>

               <Hr style={alternateDividerStyle} />

               <Section style={reviewContainer}>
                  <Heading style={reviewDepartmentTitle}>{departmentName} Department</Heading>

                  <Section style={reviewFieldsSection}>
                     {weeklyReview.fields.map((field, idx) => (
                        <React.Fragment key={idx}>
                           <Text style={reviewFieldText}>
                              <strong>{field.label}:</strong>
                           </Text>

                           <Hr style={alternateDividerStyle} />

                           <Text key={idx} style={reviewFieldText}>
                              {field.value}
                           </Text>
                        </React.Fragment>
                     ))}
                  </Section>

                  {weeklyReview.feedback && (
                     <Text style={reviewFeedback}>
                        <strong>Feedback:</strong> {parse(weeklyReview.feedback)}
                     </Text>
                  )}

                  {weeklyReview.feedbackDueForActionAt && (
                     <Text style={reviewDue}>
                        <strong>Action Due By:</strong> {format(new Date(weeklyReview.feedbackDueForActionAt), 'PPP')}
                     </Text>
                  )}

                  <Text style={reviewSubmitted}>
                     <strong>Submitted At:</strong> {format(new Date(weeklyReview.submittedAt), 'PPP p')}
                  </Text>

                  <Text style={reviewSubmitted}>
                     <strong>Service Date:</strong> {format(new Date(formattedServiceDate), 'PPP')}
                  </Text>
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
               </Section>
            </Container>
         </Body>
      </Html>
   );
};

const reviewContainer = {
   borderRadius: '12px',
   backgroundColor: '#fff7f0',
   padding: '16px 20px',
   marginBottom: '20px',
};

const reviewDepartmentTitle = {
   fontSize: '18px',
   fontWeight: 600,
   color: '#2a1f16',
   marginBottom: '12px',
};

const reviewFieldsSection = { marginBottom: '10px' };

const reviewFieldText = { fontSize: '14px', color: '#5f4b3a', margin: '2px 0' };

const reviewFeedback = { fontSize: '14px', color: '#d97706', marginTop: '6px' };

const reviewDue = { fontSize: '14px', color: '#b91c1c', marginTop: '4px' };

const reviewSubmitted = { fontSize: '12px', color: '#8a6d5a', marginTop: '2px' };

const bodyStyle = { backgroundColor: '#fff5ec', margin: 0, padding: '40px 0', fontFamily: 'Helvetica, Arial, sans-serif' };

const centerText = { textAlign: 'center' as const };

const containerStyle = { maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', padding: '42px 36px' };

const logoStyle = { marginBottom: '24px' };

const previewStyle = { fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase' as const, color: '#d97706' };

const primaryDividerStyle = { border: 'none', borderTop: '1px solid #f3d5c0', width: '100%', marginBottom: '24px' };

const alternateDividerStyle = { border: 'none', borderTop: '1px solid #f3d5c0', width: '100%', margin: '24px 0' };

const scriptureSection = { backgroundColor: '#fff1e6', borderRadius: '14px', padding: '28px 24px', textAlign: 'center' as const };

const scriptureText = { fontSize: '18px', lineHeight: '1.7', fontStyle: 'italic', color: '#3b2a1a', margin: 0 };

const wordHeaderText = { fontSize: '20px', fontWeight: 600, color: '#2a1f16', marginBottom: '12px', textTransform: 'capitalize' as const };

const wordBodyText = { fontSize: '15px', lineHeight: '1.8', color: '#5f4b3a' };

const socialLinkURL = { margin: '0 6px', display: 'inline-block' };

const socialLinkImage = { backgroundColor: '#fff1e6', borderRadius: '10px', padding: '6px' };

const footerSection = { textAlign: 'center' as const, marginBottom: '18px' };

const stayConnectedText = { fontSize: '13px', color: '#8a6d5a', marginBottom: '14px' };

const salutationName = { fontSize: '12px', color: '#a0836d', marginBottom: '8px' };

export default WeeklyReviewEmail;
