import React from 'react';

import {
   Body,
   Button,
   Column,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Img,
   Link,
   Preview,
   Row,
   Section,
   Tailwind,
   Text,
} from '@react-email/components';
import type { Announcement } from '../../generated/prisma';

interface Props {
   userFirstName: string;
   messageUrl: string;
   announcements: Announcement[];
}

const NewsletterEmail: React.FC<Props> = ({ userFirstName, messageUrl, announcements }) => {
   return (
      <Html>
         <Head />

         <Preview>Weekly Newsletter</Preview>

         <Tailwind>
            <Body className="bg-[#f2f2f2] py-[16px] w-full h-full font-sans">
               <Container className="bg-white p-[64px] h-full" style={container}>
                  <Section className="">
                     <Img
                        src="https://res.cloudinary.com/dezg6qoig/image/upload/v1757631238/logo_rp5wxm.jpg"
                        width="97"
                        height="57"
                        alt="RCNLagos Island Church"
                        className="object-contain"
                     />

                     <Heading style={header}>Your Weekly Newsletter</Heading>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={title}>
                        Dear <strong>{userFirstName}</strong>,
                     </Text>

                     <Text className="mt-[8px]" style={body}>
                        It's a new week! How are you doing? Share your joys, challenges, or prayer needs. We are here to listen. In case you
                        missed the last service, here's the link for you to catch up. Click the link below to watch the full message.
                     </Text>

                     <Hr className="mt-[16px] mb-0" />
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={title}>Posture of the Blessed: Walking in the Family (Part I)</Text>

                     <Text className="mt-[8px]" style={body}>
                        It was a deeply impactful time in God's presence — and a glorious way to step into our new space. In case you missed
                        the service or want to rewatch, you can catch the replay by clicking the link below. We look forward to seeing you
                        and worshipping with you this Sunday!
                     </Text>

                     <Button className="mt-[16px] py-[8px] px-[16px]" href={messageUrl} style={trackOrder}>
                        Catch Up
                     </Button>

                     <Hr className="mt-[16px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Text style={title}>Announcements</Text>

                     <Section style={productSection}>
                        {announcements.map((announcement) => (
                           <Row key={announcement.id} style={tableRow}>
                              <Column style={tableImageColumn}>
                                 <Img
                                    src={announcement.imageUrl}
                                    style={productImage}
                                    alt={announcement.title}
                                    className="object-contain"
                                 />
                              </Column>

                              <Column style={tableBodyColumn}>
                                 <Text style={header}>{announcement.title}</Text>
                                 <Text style={productText}>{announcement.content}</Text>
                              </Column>
                           </Row>
                        ))}
                     </Section>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationHeader}>With Love</Text>

                     <Text style={salutationBody}>RCNLagos Island Church</Text>

                     <Hr className="mt-[64px] mb-0" />
                  </Section>

                  <Section className="mt-[24px]">
                     <Row align="left" style={socials}>
                        <Column>
                           <Link href="">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1733577801/twitter_holpou.png"
                                 width="24"
                                 height="24"
                                 alt="Twitter"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column style={socialSeparator}>
                           <Link href="https://web.facebook.com/profile.php?id=61553792941216">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1733577798/facebook_wpsecb.png"
                                 width="24"
                                 height="24"
                                 alt="FaceBook"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column>
                           <Link>
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1733577798/linkedin_uwbmwe.png"
                                 width="24"
                                 height="24"
                                 alt="LinkedIn"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>
                     </Row>
                  </Section>

                  <Section className="mt-[24px]">
                     <Text style={footer}>
                        RCNLagosIslandChurch © {new Date().getFullYear()}.
                        <br />
                        Striving for the rebirth of apostolic Christianity.
                     </Text>
                  </Section>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
};

const body = {
   fontSize: '14px',
   lineHeight: '24px',
   fontWeight: '400',
   color: '#333333',
};

const container = {
   maxWidth: '800px',
   width: '100%',
};

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

const productSection = {
   width: '100%',
   marginTop: '16px',
};

const productText = {
   color: '#000000',
   fontSize: '14px',
   lineHeight: '20px',
   fontWeight: '400',
};

const productImage = {
   width: '150px',
   height: '150px',
   borderRadius: '4px',
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

const sectionTitle = {
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '500',
   color: '#666666',
   margin: '0px',
};

const socials = {
   width: '20%',
   marginBottom: '24px',
};

const socialSeparator = {
   marginLeft: '24px',
   marginRight: '24px',
};

const tableBodyColumn = {
   flex: '1',
   padding: '14px 24px',
};

const tableImageColumn = {
   width: '180px',
   padding: '14px 24px',
};

const tableRow = {
   width: '100%',
   borderBottom: '1px solid #d6d6d6',
};

const title = {
   ...body,
   fontSize: '18px',
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

export default NewsletterEmail;
