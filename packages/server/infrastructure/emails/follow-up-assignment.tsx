import React from 'react';

import { formatDate } from 'date-fns';
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

import { FRONTEND_BASE_URL } from '../../utils/constants';

import type { IFollowUp } from '../database/models/followup.model';
import type { IUser } from '../database/models/user.model';

interface Props {
   followUp: IFollowUp;
   firstTimer: IUser;
   userFirstName: string;
}

const FollowUpAssignmentEmail: React.FC<Props> = ({ followUp, firstTimer, userFirstName }) => {
   return (
      <Html>
         <Head />
         <Preview>New Member Assigned For Follow Up!</Preview>
         <Tailwind>
            <Body className="bg-[#f2f2f2] py-[16px] w-full h-full font-sans">
               <Container className="bg-white p-[64px] h-full">
                  <Section className="">
                     <Img src={FRONTEND_BASE_URL + '/images/logo.png'} width="97" height="57" alt="Dulux" className="object-contain" />

                     <Heading style={header}>Member Assigned For Follow Up!!!</Heading>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={title}>Hello, {userFirstName}</Text>

                     <Text className="mt-[8px]" style={body}>
                        A first timer has been assigned to you for follow up. Please follow up and provide feedback on or before {formatDate(followUp.nextActionAt!, 'PPP')}
                     </Text>

                     <Button className="py-[8px] px-[16px]" href={FRONTEND_BASE_URL + '/dashboard/first-timers'} style={trackOrder}>
                        View More Details
                     </Button>

                     <Hr className="mt-[16px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Text style={header}>Order Details</Text>

                     <Section style={productSection}>
                        <table style={table}>
                           <thead>
                              <tr>
                                 <th style={tableHeaderColumn}>Full Name</th>
                                 <th style={tableHeaderColumn}>Phone Number</th>
                                 <th style={tableHeaderColumn}>Preferred Contact Method</th>
                                 <th style={tableHeaderColumn}>Notes</th>
                                 <th style={tableHeaderColumn}>Status</th>
                              </tr>
                           </thead>

                           <tbody>
                              <tr>
                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>
                                       {firstTimer.firstName} {firstTimer.lastName}
                                    </Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{firstTimer.phoneNumber}</Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{followUp.feedback}</Text>
                                 </td>

                                 <td style={tableBodyColumn}>
                                    <Text style={productText}>{followUp.status}</Text>
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

export default FollowUpAssignmentEmail;
