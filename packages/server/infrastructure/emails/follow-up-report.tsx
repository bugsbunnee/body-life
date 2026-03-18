import React from 'react';
import _ from 'lodash';

import { formatDate } from 'date-fns';
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

import { FRONTEND_BASE_URL } from '../../utils/constants';

import type { IFollowUp } from '../database/models/followup.model';
import type { IUser } from '../database/models/user.model';

interface Props {
   startDate: string;
   endDate: string;
   followUps: IFollowUp[];
   user: IUser;
}

const FollowUpReportEmail: React.FC<Props> = ({ user, followUps, startDate, endDate }) => {
   const interestedFirstTimerCount = followUps.filter((followUp) => followUp.wantsToJoinDepartment).length;
   const successfulFollowUpCount = followUps.filter((followUp) => followUp.attempts.filter((attempt) => attempt.successful).length > 0).length;

   return (
      <Html>
         <Head />
         <Preview>RCNLagos Island Church - First-Timer Welcome and Follow Up Report!</Preview>
         <Tailwind>
            <Body className="bg-[#f2f2f2] py-[16px] w-full h-full font-sans">
               <Container className="bg-white p-[64px] h-full">
                  <Section className="">
                     <Img width={140} src={`${FRONTEND_BASE_URL}/images/logo.png`} alt="RCNLagos Island Church" />

                     <Heading style={header}>RCNLagos Island Church - First-Timer Welcome and Follow Up Report!</Heading>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={title}>Hello, {user.firstName}</Text>

                     <Text className="mt-[8px]" style={body}>
                        Here are the details of the First Timers follow-up report for {startDate} - {endDate}.
                     </Text>

                     <Button className="py-[8px] px-[16px]" href={FRONTEND_BASE_URL + '/dashboard/first-timers'} style={trackOrder}>
                        View More Details
                     </Button>

                     <Hr className="mt-[16px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Text style={header}>Report Details</Text>

                     <Section style={productSection}>
                        <table style={table}>
                           <thead>
                              <tr>
                                 <th style={tableHeaderColumn}>S/N</th>
                                 <th style={tableHeaderColumn}>Full Name</th>
                                 <th style={tableHeaderColumn}>Phone Number</th>
                                 <th style={tableHeaderColumn}>Assigned To</th>
                                 <th style={tableHeaderColumn}>Preferred Contact Method</th>
                                 <th style={tableHeaderColumn}>Feedback</th>
                                 <th style={tableHeaderColumn}>Status</th>
                              </tr>
                           </thead>

                           <tbody>
                              {followUps.map((followUp, index) => (
                                 <tr key={index}>
                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>{index + 1}</Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>
                                          {_.get(followUp.user, 'firstName')} {_.get(followUp.user, 'lastName')}
                                       </Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>{_.get(followUp.user, 'phoneNumber')}</Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>
                                          {_.get(followUp.assignedTo, 'firstName')} {_.get(followUp.assignedTo, 'lastName')}
                                       </Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>{followUp.preferredContactMethod}</Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>{followUp.feedback}</Text>
                                    </td>

                                    <td style={tableBodyColumn}>
                                       <Text style={productText}>{followUp.status}</Text>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </Section>
                  </Section>

                  <Section className="mt-[16px]">
                     <Section style={productSection}>
                        <table style={table}>
                           <thead>
                              <tr>
                                 <th style={tableHeaderColumn}>Metric</th>
                                 <th style={tableHeaderColumn}>Count</th>
                              </tr>
                           </thead>

                           <tbody>
                              <tr>
                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>Number of First Timers</Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{followUps.length}</Text>
                                 </td>
                              </tr>

                              <tr>
                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>Number of Follow-Ups Completed</Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{successfulFollowUpCount}</Text>
                                 </td>
                              </tr>

                              <tr>
                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>Number of First Timers Interested in Follow-Ups</Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{interestedFirstTimerCount}</Text>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </Section>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationHeader}>Best Regards</Text>

                     <Text style={salutationBody}>RCNLagos Island Church</Text>

                     <Text style={note}>This is a system generated message. Do not reply.</Text>

                     <Hr className="mt-[64px] mb-0" />
                  </Section>

                  <Section style={centerText}>
                     <Text style={salutationName}>© {new Date().getFullYear()} RCNLagos Island Church</Text>

                     <Text style={salutationName}>
                        You are receiving this email because you provided us your email address to keep in touch. Want to change how you receive these emails?
                     </Text>
                  </Section>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
};

const body = {
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '400',
   color: '#333333',
};

const centerText = { textAlign: 'center' as const };

const footer = {
   fontSize: '12px',
   color: '#999999',
   lineHeight: '16px',
   fontWeight: '400',
};

const header = {
   marginTop: '24px',
   lineHeight: '32px',
   fontSize: '24px',
   fontWeight: '400',
   color: '#000000',
};

const note = {
   fontSize: '14px',
   fontWeight: '400',
   lineHeight: '20px',
   color: '#999999',
};

const salutationBody = {
   color: '#333333',
   fontSize: '20px',
   lineHeight: '24px',
   fontWeight: '500',
   margin: '0px',
};

const salutationHeader = {
   color: '#333333',
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '400',
   margin: '0px',
};

const salutationName = {
   fontSize: '12px',
   color: '#a0836d',
   marginBottom: '8px',
};

const productSection = {
   width: '100%',
   marginTop: '16px',
};

const productText = {
   color: '#000000',
   fontSize: '14px',
   lineHeight: '20px',
   fontWeight: '400',
   textAlign: 'left' as const,
};

const tableHeaderColumn = {
   color: '#000000',
   fontSize: '14px',
   lineHeight: '24px',
   fontWeight: '500',
   textAlign: 'left' as const,
   textTransform: 'uppercase' as const,
   flex: '1',
   padding: '14px 24px',
};

const tableBodyColumn = {
   flex: '1',
   padding: '14px 24px',
};

const table = {
   width: '100%',
   borderCollapse: 'collapse' as const,
};

const title = {
   ...body,
   textTransform: 'capitalize' as const,
};

const trackOrder = {
   backgroundColor: '#022A68',
   borderRadius: '50px',
   fontSize: '14px',
   lineHeight: '24px',
   fontWeight: '500',
   color: '#FFFFFF',
};

const socialLinkURL = { margin: '0 6px', display: 'inline-block' };

const socialLinkImage = {
   backgroundColor: '#fff1e6',
   borderRadius: '10px',
   padding: '6px',
};

const stayConnectedText = {
   fontSize: '13px',
   color: '#8a6d5a',
   marginBottom: '14px',
};

const footerSection = { textAlign: 'center' as const, marginBottom: '18px' };

export default FollowUpReportEmail;
