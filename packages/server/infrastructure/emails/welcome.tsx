import React from 'react';

import { Body, Column, Container, Head, Heading, Hr, Html, Img, Link, Row, Section, Tailwind, Text } from '@react-email/components';

interface Props {
   firstName: string;
}

const WelcomeEmail: React.FC<Props> = ({ firstName }) => {
   return (
      <Html>
         <Head />

         <Tailwind>
            <Body className="bg-[#f2f2f2] py-[16px] w-full h-full font-sans">
               <Container className="bg-white p-[32px] h-full" style={container}>
                  <Section className="mt-[48px]">
                     <Img
                        src="https://res.cloudinary.com/dezg6qoig/image/upload/v1757631238/logo_rp5wxm.jpg"
                        width="97"
                        height="57"
                        alt="RCNLagos Island Church"
                        className="object-contain"
                     />
                  </Section>

                  <Section className="mt-[16px]">
                     <Heading style={header}>
                        <strong>RCNLAGOS ISLAND CHURCH</strong>
                     </Heading>

                     <Heading style={subheader}>
                        <strong>REMNANT CHRISTIAN NETWORK</strong>
                     </Heading>

                     <Section style={{ width: '100%', height: '100%', maxHeight: '400px', marginTop: '48px' }}>
                        <Img
                           src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334145/image8_kxx4ay.png"
                           width="100%"
                           height="100%"
                           alt="RCNLagos Island Church"
                           className="object-contain"
                        />
                     </Section>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={leftAlignedBody}>
                        <strong>Hi {firstName},</strong>
                     </Text>

                     <Text className="mt-[8px]" style={leftAlignedBody}>
                        Welcome to <strong>RCNLAGOS ISLAND CHURCH</strong> 🎉 We joyfully welcome you and we're glad you could fellowship with us!
                     </Text>

                     <Text className="mt-[8px]" style={leftAlignedBody}>
                        As brethren, we are reminded of Psalm 133:1 — “Behold, how good and pleasant it is for brethren to dwell together in unity!” This month, we lean into that
                        unity with expectation for a greater outpouring of His Spirit in our midst.
                     </Text>

                     <Hr className="mt-[32px]" />
                  </Section>

                  <Section>
                     <Text style={sectionTitle}>ABOUT US</Text>

                     <Heading className="mt-[16px]" style={subtitle}>
                        About RCN (Remnant Christian Network)
                     </Heading>

                     <Text className="mt-[16px]" style={body}>
                        Remnant Christian Network (RCN) is a global apostolic movement committed to reviving authentic Christianity in our generation. Our mandate is to strive for
                        the rebirth of apostolic Christianity across the nations by raising a people of prayer, sound doctrine, and kingdom service. Through teaching, intercession,
                        and discipleship, RCN is equipping believers to live in alignment with God’s purposes and to be vessels of His glory in their families, communities, and
                        nations.
                     </Text>

                     <Hr className="mt-[32px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Heading style={subtitle}>About RCNLagos Island Church</Heading>

                     <Text className="mt-[8px]" style={body}>
                        RCNLagos Island Church is the Lagos Island expression of Remnant Christian Network Lagos. Planted with the same vision and heartbeat, the RCNLagos Island
                        Church is a thriving family of believers passionate about prayer, the word, and fellowship. Located in the heart of Lekki, the Island Church serves as a hub
                        for equipping, refreshing, and mobilising God’s people for kingdom impact. It’s more than a church; it’s a family where believers are strengthened, aligned,
                        and sent out to live out apostolic Christianity in their everyday lives.
                     </Text>

                     <Hr className="mt-[32px] mb-0" />
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationHeader}>With Love</Text>

                     <Text style={salutationBody}>Reverend. Michael Nsofor</Text>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationBody}>
                        Contact Us: <Link style={{ ...link, fontSize: '20px' }}>info@rcnlagosisland.com</Link>
                     </Text>

                     <Hr color="#000000" className="mt-[64px] mb-0" />
                  </Section>

                  <Section className="mt-[24px] justify-center flex w-full">
                     <Row align="center" style={socials}>
                        <Column>
                           <Link href="https://www.instagram.com/rcnlagosisland/">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334093/image6_tkovsi.jpg"
                                 width="40"
                                 height="40"
                                 alt="Instagram"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column style={socialSeparator}>
                           <Link href="https://web.facebook.com/profile.php?id=61553792941216">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334094/image9_ng3nh5.jpg"
                                 width="40"
                                 height="40"
                                 alt="FaceBook"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column>
                           <Link href="https://www.youtube.com/@RCNLagosIsland">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334096/image11_snnxaf.png"
                                 width="60"
                                 height="50"
                                 alt="YouTube"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>
                     </Row>
                  </Section>

                  <Section className="mt-[24px]">
                     <Text style={footer}>
                        {process.env.SENDER_NAME} © {new Date().getFullYear()}.
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
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '500',
   color: '#333333',
   textAlign: 'center' as const,
};

const container = {
   maxWidth: '900px',
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
   fontSize: '30px',
   fontWeight: '700',
   color: '#000000',
   textAlign: 'center' as const,
   textTransform: 'uppercase' as const,
};

const leftAlignedBody = { ...body, textAlign: 'left' as const };

const link = {
   textDecoration: 'underline',
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '500',
   textAlign: 'center' as const,
};

const subheader = {
   marginTop: '18px',
   fontSize: '18px',
   fontWeight: '400',
   color: '#000000',
   textAlign: 'center' as const,
   textTransform: 'uppercase' as const,
};

const salutationBody = {
   color: '#000000',
   fontSize: '20px',
   lineHeight: '24px',
   fontWeight: '700',
   margin: '0px',
   textAlign: 'center' as const,
};

const salutationHeader = {
   color: '#000000',
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '400',
   margin: '0px',
   textAlign: 'center' as const,
};

const sectionTitle = {
   textAlign: 'center' as const,
   fontSize: '18px',
   fontWeight: '700',
};

const socials = {
   width: '100%',
   marginBottom: '24px',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
};

const socialSeparator = {
   padding: '0 16px',
};

const subtitle = {
   fontSize: '18px',
   fontWeight: '700',
   textAlign: 'center' as const,
};

const table = {
   width: '100%',
   borderCollapse: 'collapse' as const,
   border: '5px solid #000000',
};

export default WelcomeEmail;
